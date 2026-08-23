import "dotenv/config";
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { pipeline } from "stream/promises";
import { prisma } from "@feboko/database";

const ROOT = join(__dirname, "..");
const MEDIA_DIR = join(ROOT, "apps", "web", "public", "media");
const IMAGES_DIR = join(ROOT, "apps", "web", "public", "images");
const SQL_PATH = join(ROOT, "data", "feboko-db-export.sql");
const SITE = "https://feboko.com";

const PAGES = [
  "/",
  "/services/",
  "/team/",
  "/karriere/",
  "/blog/",
  "/?lang=en",
  "/services/?lang=en",
  "/team/?lang=en",
  "/karriere/?lang=en",
  "/blog/?lang=en",
];

const STATIC_IMAGES = [
  "/images/about.jpg",
  "/images/neverchangearunningteam.jpg",
  "/images/founder1.jpg",
  "/images/founder2.jpg",
];

function collectUploadPaths(text: string): Set<string> {
  const paths = new Set<string>();
  const re = /wp-content\/uploads\/([a-zA-Z0-9_./-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const path = match[1].replace(/[)"'\\]+$/g, "");
    if (path) paths.add(path);
  }
  return paths;
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const dir = dirname(dest);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok || !res.body) return false;
    await pipeline(res.body as unknown as import("stream").Readable, createWriteStream(dest));
    return true;
  } catch {
    return false;
  }
}

async function downloadUpload(relPath: string): Promise<boolean> {
  const dest = join(MEDIA_DIR, relPath);
  if (existsSync(dest)) return true;

  const candidates = [
    `${SITE}/wp-content/uploads/${relPath}`,
    `${SITE}/wp-content/uploads/${encodeURI(relPath)}`,
  ];

  for (const url of candidates) {
    if (await download(url, dest)) {
      console.log(`OK: ${relPath}`);
      return true;
    }
  }
  console.warn(`FAIL: ${relPath}`);
  return false;
}

async function downloadStaticImage(path: string): Promise<boolean> {
  const filename = path.replace(/^\/images\//, "");
  const dest = join(IMAGES_DIR, filename);
  if (existsSync(dest)) return true;
  const url = `${SITE}${path}`;
  if (await download(url, dest)) {
    console.log(`OK: ${path}`);
    return true;
  }
  console.warn(`FAIL: ${url}`);
  return false;
}

async function crawlLiveSite(): Promise<Set<string>> {
  const paths = new Set<string>();
  for (const page of PAGES) {
    try {
      const res = await fetch(`${SITE}${page}`, { redirect: "follow" });
      if (!res.ok) continue;
      const html = await res.text();
      for (const p of collectUploadPaths(html)) paths.add(p);
    } catch {
      console.warn(`SKIP page: ${page}`);
    }
  }
  return paths;
}

function pathsFromSql(): Set<string> {
  if (!existsSync(SQL_PATH)) return new Set();
  const sql = readFileSync(SQL_PATH, "utf8");
  return collectUploadPaths(sql);
}

async function upsertMediaRecord(relPath: string) {
  const originalUrl = `${SITE}/wp-content/uploads/${relPath}`;
  const localPath = `/media/${relPath}`;
  const existing = await prisma.media.findFirst({
    where: { OR: [{ localPath }, { originalUrl }] },
  });
  if (existing) {
    await prisma.media.update({
      where: { id: existing.id },
      data: { originalUrl, localPath },
    });
    return;
  }
  await prisma.media.create({ data: { originalUrl, localPath } });
}

async function main() {
  const paths = new Set<string>();
  for (const p of pathsFromSql()) paths.add(p);
  for (const p of await crawlLiveSite()) paths.add(p);

  const dbMedia = await prisma.media.findMany();
  for (const item of dbMedia) {
    let rel = item.localPath?.replace(/^\/media\//, "");
    if (!rel && item.originalUrl?.includes("/uploads/")) {
      rel = item.originalUrl.split("/uploads/")[1];
    }
    if (rel) paths.add(rel);
  }

  console.log(`Found ${paths.size} upload paths`);

  let ok = 0;
  let fail = 0;
  for (const relPath of paths) {
    const success = await downloadUpload(relPath);
    if (success) {
      ok++;
      await upsertMediaRecord(relPath);
    } else {
      fail++;
    }
  }

  for (const img of STATIC_IMAGES) {
    if (await downloadStaticImage(img)) ok++;
    else fail++;
  }

  console.log(`Done. ${ok} ok, ${fail} failed.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
