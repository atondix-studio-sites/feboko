import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { unserialize } from "php-serialize";
import bcrypt from "bcryptjs";
import { prisma, Language, JobType } from "@feboko/database";

const ROOT = join(__dirname, "..");
const SQL_PATH = join(ROOT, "data", "feboko-db-export.sql");

type WpPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: string;
  menuOrder: number;
  postType: string;
  mimeType: string | null;
  parentId: number;
};

function loadSql(): string {
  if (!existsSync(SQL_PATH)) {
    throw new Error(`SQL dump not found at ${SQL_PATH}`);
  }
  return readFileSync(SQL_PATH, "utf-8");
}

function extractTableInsert(sql: string, table: string): string {
  const marker = `INSERT INTO \`wp_${table}\``;
  const start = sql.indexOf(marker);
  if (start === -1) return "";
  const next = sql.indexOf("\n-- Dumping", start + 1);
  const end = next === -1 ? sql.length : next;
  return sql.slice(start, end);
}

function parseSqlString(input: string, start: number): { value: string; end: number } | null {
  if (input[start] !== "'") return null;
  let i = start + 1;
  let value = "";
  while (i < input.length) {
    const ch = input[i];
    if (ch === "\\") {
      value += input[i + 1] ?? "";
      i += 2;
      continue;
    }
    if (ch === "'") {
      return { value, end: i + 1 };
    }
    value += ch;
    i++;
  }
  return null;
}

function parseOptions(sql: string): Map<string, string> {
  const block = extractTableInsert(sql, "options");
  const map = new Map<string, string>();
  const re = /\(\d+,\s*'([^']+)',\s*'/g;
  let match;
  while ((match = re.exec(block)) !== null) {
    const name = match[1];
    const parsed = parseSqlString(block, match.index + match[0].length - 1);
    if (parsed) {
      map.set(name, parsed.value);
      re.lastIndex = parsed.end;
    }
  }
  return map;
}

function parsePostmeta(sql: string): Map<number, Map<string, string>> {
  const block = extractTableInsert(sql, "postmeta");
  const byPost = new Map<number, Map<string, string>>();
  const re = /\((\d+),\s*(\d+),\s*'([^']+)',\s*'/g;
  let match;
  while ((match = re.exec(block)) !== null) {
    const postId = Number(match[2]);
    const key = match[3];
    const parsed = parseSqlString(block, match.index + match[0].length - 1);
    if (!parsed) continue;
    if (!byPost.has(postId)) byPost.set(postId, new Map());
    byPost.get(postId)!.set(key, parsed.value);
    re.lastIndex = parsed.end;
  }
  return byPost;
}

function parsePosts(sql: string): WpPost[] {
  const rows: WpPost[] = [];
  const postsSection = sql.split("-- Dumping data for table feboko-db.wp_posts")[1]?.split("-- Dumping")[0] ?? "";
  const segments = postsSection.split(/\n\t\(/);

  const tailRe =
    /, (\d+), '(service|team|job|partner|post|page|attachment|revision|nav_menu_item|wpcf7_contact_form|wp_navigation)', '([^']*)', (\d+)\)[,;]?\s*$/;

  for (let i = 0; i < segments.length; i++) {
    let seg = segments[i];
    if (i === 0) {
      const idx = seg.indexOf("VALUES");
      if (idx >= 0) seg = seg.slice(idx + 6);
    }

    const tailMatch = seg.match(tailRe);
    if (!tailMatch) continue;

    const menuOrder = Number(tailMatch[1]);
    const postType = tailMatch[2];
    const mimeType = tailMatch[3] || null;

    const idMatch = seg.match(/^[\s\S]*?^(\d+),/m) ?? seg.match(/^(\d+),/);
    if (!idMatch) continue;
    const id = Number(idMatch[1]);

    const publishIdx = seg.indexOf("'publish'");
    const inheritIdx = seg.indexOf("'inherit'");
    const statusIdx = publishIdx >= 0 ? publishIdx : inheritIdx;
    if (statusIdx === -1) continue;
    const status = publishIdx >= 0 ? "publish" : "inherit";
    const beforeStatus = seg.slice(0, statusIdx);

    const titleMatches = [...beforeStatus.matchAll(/'((?:\\'|[^'])*)'/g)];
    if (titleMatches.length < 4) continue;

    const content = titleMatches[2][1].replace(/\\'/g, "'").replace(/\\r\\n/g, "\n");
    const title = titleMatches[3][1].replace(/\\'/g, "'");

    const slugMatch = seg.match(
      /'closed', '', '([^']+)', '', '', '[^']*', '[^']*', '', (\d+), '[^']*'/,
    );
    const slug = slugMatch?.[1] ?? `post-${id}`;
    const parentId = Number(slugMatch?.[2] ?? 0);

    rows.push({
      id,
      title,
      content,
      excerpt: titleMatches[4]?.[1]?.replace(/\\'/g, "'") ?? "",
      slug,
      status,
      menuOrder,
      postType,
      mimeType,
      parentId,
    });
  }

  return rows;
}

function phpOptionsToJson(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [sectionKey, sectionVal] of Object.entries(data as Record<string, unknown>)) {
    if (!sectionVal || typeof sectionVal !== "object") {
      out[sectionKey] = sectionVal;
      continue;
    }
    const section: Record<string, unknown> = {};
    for (const [fieldKey, fieldVal] of Object.entries(sectionVal as Record<string, unknown>)) {
      if (fieldKey === "image") {
        section.image = fieldVal;
      } else if (fieldVal && typeof fieldVal === "object") {
        section[fieldKey] = fieldVal;
      } else {
        section[fieldKey] = fieldVal;
      }
    }
    out[sectionKey] = section;
  }
  return out;
}

async function importSiteSections(
  pageKey: string,
  optionName: string,
  options: Map<string, string>,
  mediaMap: Map<number, string>,
) {
  const raw = options.get(optionName);
  if (!raw) return;
  const data = unserialize(raw, { classes: { stdClass: class {} } }) as Record<string, unknown>;
  const sections = phpOptionsToJson(data);

  for (const [sectionKey, sectionData] of Object.entries(sections)) {
    const section = sectionData as Record<string, unknown>;
    let imageId: string | undefined;
    if (section.image && typeof section.image === "number") {
      imageId = mediaMap.get(section.image);
    }
    const { image, ...rest } = section;
    await prisma.siteSection.upsert({
      where: { pageKey_sectionKey: { pageKey, sectionKey } },
      create: {
        pageKey,
        sectionKey,
        data: rest,
        imageId,
      },
      update: {
        data: rest,
        imageId,
      },
    });
  }
}

async function main() {
  console.log("Loading SQL dump...");
  const sql = loadSql();
  const options = parseOptions(sql);
  const postmeta = parsePostmeta(sql);
  const posts = parsePosts(sql);

  console.log(`Parsed ${posts.length} posts, ${options.size} options`);

  const mediaMap = new Map<number, string>();
  const siteUrl = options.get("siteurl") || "https://feboko.com";

  // Media / attachments
  for (const post of posts.filter((p) => p.postType === "attachment" && p.status === "inherit")) {
    const meta = postmeta.get(post.id);
    const file = meta?.get("_wp_attached_file");
    const originalUrl = file
      ? `${siteUrl}/wp-content/uploads/${file}`
      : post.slug.startsWith("http")
        ? post.slug
        : null;
    const media = await prisma.media.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        originalUrl,
        localPath: file ? `/media/${file}` : null,
        mimeType: post.mimeType,
        altText: post.title,
      },
      update: {
        originalUrl,
        localPath: file ? `/media/${file}` : null,
        mimeType: post.mimeType,
        altText: post.title,
      },
    });
    mediaMap.set(post.id, media.id);
  }

  // Header image from theme mods (regex avoids stdClass unserialize issues)
  const themeMods = options.get("theme_mods_feboko-theme");
  let headerMediaId: string | undefined;
  if (themeMods) {
    const headerMatch = themeMods.match(/header_image";s:\d+:"([^"]+)"/);
    const headerUrl = headerMatch?.[1];
    if (headerUrl) {
      const media = await prisma.media.create({
        data: {
          originalUrl: headerUrl,
          localPath: headerUrl.includes("/uploads/")
            ? `/media/${headerUrl.split("/uploads/")[1]}`
            : null,
        },
      });
      headerMediaId = media.id;
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      siteName: options.get("blogname") || "FeBoKo Consulting",
      headerImageId: headerMediaId,
      contactEmail: "info@feboko.com",
      contactPhone: "+49 (0) 157 33717052",
      linkedinUrl: "https://www.linkedin.com/company/feboko",
    },
    update: {
      siteName: options.get("blogname") || "FeBoKo Consulting",
      headerImageId: headerMediaId,
    },
  });

  await importSiteSections("frontpage", "feboko_frontpage_options", options, mediaMap);
  await importSiteSections("about", "feboko_aboutpage_options", options, mediaMap);
  await importSiteSections("career", "feboko_careerpage_options", options, mediaMap);

  // Services
  for (const post of posts.filter((p) => p.postType === "service" && p.status === "publish")) {
    const meta = postmeta.get(post.id) ?? new Map();
    const lang = (meta.get("_feboko_service_language") || "de") as Language;
    const thumbId = meta.get("_thumbnail_id");
    await prisma.service.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        language: lang,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content || null,
        secondHeading: meta.get("_feboko_second_heading") || null,
        megaMenuItems: meta.get("_feboko_mega_menu_items") || null,
        sortOrder: post.menuOrder,
        featuredImageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
      update: {
        slug: post.slug,
        language: lang,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content || null,
        secondHeading: meta.get("_feboko_second_heading") || null,
        megaMenuItems: meta.get("_feboko_mega_menu_items") || null,
        sortOrder: post.menuOrder,
        featuredImageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
    });
  }

  // Team
  for (const post of posts.filter((p) => p.postType === "team" && p.status === "publish")) {
    const meta = postmeta.get(post.id) ?? new Map();
    const thumbId = meta.get("_thumbnail_id");
    await prisma.teamMember.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        name: post.title,
        position: meta.get("_team_position") || null,
        email: meta.get("_team_email") || null,
        phone: meta.get("_team_phone") || null,
        aboutDe: meta.get("_team_about") || null,
        aboutEn: meta.get("_team_about_en") || null,
        sortOrder: post.menuOrder,
        imageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
      update: {
        slug: post.slug,
        name: post.title,
        position: meta.get("_team_position") || null,
        email: meta.get("_team_email") || null,
        phone: meta.get("_team_phone") || null,
        aboutDe: meta.get("_team_about") || null,
        aboutEn: meta.get("_team_about_en") || null,
        sortOrder: post.menuOrder,
        imageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
    });
  }

  // Jobs
  for (const post of posts.filter((p) => p.postType === "job" && p.status === "publish")) {
    const meta = postmeta.get(post.id) ?? new Map();
    const jobType = meta.get("_job_type") as JobType | undefined;
    await prisma.job.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        title: post.title,
        location: meta.get("_job_location") || null,
        type: jobType && Object.values(JobType).includes(jobType) ? jobType : null,
        departmentDe: meta.get("_job_department_de") || null,
        departmentEn: meta.get("_job_department_en") || null,
        deadline: meta.get("_job_deadline") || null,
        summaryDe: meta.get("_job_summary_de") || null,
        summaryEn: meta.get("_job_summary_en") || null,
        descriptionDe: meta.get("_job_description_de") || null,
        descriptionEn: meta.get("_job_description_en") || null,
        requirementsDe: meta.get("_job_requirements_de") || null,
        requirementsEn: meta.get("_job_requirements_en") || null,
        contactEmail: meta.get("_job_contact_email") || null,
        sortOrder: post.menuOrder,
      },
      update: {
        slug: post.slug,
        title: post.title,
        location: meta.get("_job_location") || null,
        type: jobType && Object.values(JobType).includes(jobType) ? jobType : null,
        departmentDe: meta.get("_job_department_de") || null,
        departmentEn: meta.get("_job_department_en") || null,
        deadline: meta.get("_job_deadline") || null,
        summaryDe: meta.get("_job_summary_de") || null,
        summaryEn: meta.get("_job_summary_en") || null,
        descriptionDe: meta.get("_job_description_de") || null,
        descriptionEn: meta.get("_job_description_en") || null,
        requirementsDe: meta.get("_job_requirements_de") || null,
        requirementsEn: meta.get("_job_requirements_en") || null,
        contactEmail: meta.get("_job_contact_email") || null,
        sortOrder: post.menuOrder,
      },
    });
  }

  // Partners
  for (const post of posts.filter((p) => p.postType === "partner" && p.status === "publish")) {
    const meta = postmeta.get(post.id) ?? new Map();
    const logoId = meta.get("_partner_logo_id");
    await prisma.partner.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        name: post.title,
        sortOrder: post.menuOrder,
        logoId: logoId ? mediaMap.get(Number(logoId)) : undefined,
      },
      update: {
        name: post.title,
        sortOrder: post.menuOrder,
        logoId: logoId ? mediaMap.get(Number(logoId)) : undefined,
      },
    });
  }

  // Blog posts
  for (const post of posts.filter((p) => p.postType === "post" && p.status === "publish")) {
    const meta = postmeta.get(post.id) ?? new Map();
    const lang = (meta.get("_feboko_service_language") || "de") as Language;
    const thumbId = meta.get("_thumbnail_id");
    await prisma.blogPost.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        language: lang,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content || null,
        publishedAt: new Date(posts.find((p) => p.id === post.id) ? new Date().toISOString() : Date.now()),
        featuredImageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
      update: {
        slug: post.slug,
        language: lang,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content || null,
        featuredImageId: thumbId ? mediaMap.get(Number(thumbId)) : undefined,
      },
    });
  }

  // Pages
  for (const post of posts.filter((p) => p.postType === "page" && p.status === "publish")) {
    if (["homepage", "blog"].includes(post.slug)) continue;
    await prisma.page.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        titleDe: post.title,
        contentDe: post.content || null,
      },
      update: {
        slug: post.slug,
        titleDe: post.title,
        contentDe: post.content || null,
      },
    });
  }

  // Default nav menus
  await prisma.navMenuItem.deleteMany();
  const footerFeboko = [
    { labelDe: "Homepage", labelEn: "Homepage", href: "/" },
    { labelDe: "Services", labelEn: "Services", href: "/services" },
    { labelDe: "Team", labelEn: "Team", href: "/team" },
    { labelDe: "Karriere", labelEn: "Careers", href: "/karriere" },
    { labelDe: "Blog", labelEn: "Blog", href: "/blog" },
  ];
  const footerLegal = [
    { labelDe: "Impressum", labelEn: "Imprint", href: "/impressum" },
    { labelDe: "Datenschutz", labelEn: "Privacy Policy", href: "/datenschutz" },
    { labelDe: "Nutzungsbedingungen", labelEn: "Terms of Use", href: "/nutzungsbedingungen" },
    { labelDe: "Kontakt", labelEn: "Contact", href: "/#contact" },
  ];
  for (let i = 0; i < footerFeboko.length; i++) {
    const item = footerFeboko[i];
    await prisma.navMenuItem.create({
      data: { menuKey: "footer-feboko", ...item, sortOrder: i },
    });
  }
  for (let i = 0; i < footerLegal.length; i++) {
    const item = footerLegal[i];
    await prisma.navMenuItem.create({
      data: { menuKey: "footer-legal", ...item, sortOrder: i },
    });
  }

  // Admin user
  const email = process.env.ADMIN_EMAIL || "admin@feboko.com";
  const password = process.env.ADMIN_PASSWORD || "changeme";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name: "Admin" },
    update: { passwordHash },
  });

  console.log("Migration complete.");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
