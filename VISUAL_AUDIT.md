# FeBoKo visual parity audit

Baseline captured 2026-08-24 against the live site at `https://feboko.com` and the deployed WordPress theme at `/home/webhosting/feboko/wp-content/themes/feboko-theme` on `rettungsalarm`.

## Scope and method

- Compared the production and local sites side by side at 1440 × 1000 and 390 × 844.
- Crawled the homepage, Services, Team, Karriere, Blog, Impressum, representative service/article detail pages, English mode, the mobile menu, sticky-header state, and carousel start/end states.
- Compared the remote WordPress PHP/CSS/JavaScript source with the Next.js port.
- Inspected computed geometry, DOM/accessibility snapshots, visible copy, image loading, form behavior, animation state, document metadata, and route ordering.
- The remote theme files and the repository's `wp-content/themes/feboko-theme` copy are equivalent apart from line endings. The mismatches below are in the Next.js port or its imported data.

## Pre-fix score

| Dimension | Score | Notes |
| --- | ---: | --- |
| Visual hierarchy | 17/20 | Desktop hierarchy largely matches; mobile hero proportions do not. |
| Brand fidelity | 18/20 | Fonts, palette, iconography, and most imagery match. |
| Responsive layout | 11/20 | Header and hero overrides cause a major mobile divergence. |
| Interaction fidelity | 9/20 | Sticky header, mobile language switcher, and carousel state logic are incomplete. |
| Content and craft | 10/20 | Form, dates, ordering, entity decoding, and WordPress paragraph formatting differ. |
| **Total** | **65/100** | Strong shared CSS foundation, but several high-impact porting gaps remain. |

## Complete observed mismatch inventory

### High impact

1. **Mobile hero height and crop** — At 390px, production ends the hero around 525px from the page top; local continues beyond the first 844px viewport. Local added `min-height` rules to the hero and image, preventing the production `height: 500px` mobile rule from taking effect. Local also changed `object-position: top` to `center top`.
2. **Mobile header height** — Production header is about 46.7px tall at the audited viewport; local is 73px. The local-only `min-height: 73px` header-container rule overrides the production geometry.
3. **Homepage services carousel cards** — Both versions include featured images, but local additionally applies `.service-card` to the `.service-grid-card` articles. That extra class adds a border/padding and produces a substantially taller carousel (about 964px versus 758px per mobile card; about 700px versus 590px on desktop).
4. **Footer contact form layout** — Production has First/Vorname and Last/Nachname in row one, Email and Subject/Betreff in row two, a 10-row message field, privacy acceptance, and a disabled-until-accepted submit. Local has only Name, Email, a 5-row message, no subject/privacy acceptance, and an immediately enabled submit. This makes the footer about 217px shorter on audited inner pages and changes the primary conversion flow.
5. **WordPress paragraph formatting missing** — Production applies `the_content()`/`wpautop` to legal and rich-content pages. Local renders raw imported HTML, leaving plain-text blocks as collapsed text nodes. On Impressum the main body is about 155px shorter and has visibly missing paragraph rhythm. The same risk exists on service and blog detail content.
6. **Blog dates and ordering** — Production shows the stored WordPress publication dates (for example 18.06.2026, 03.06.2026, 02.06.2026). Local assigns the migration run time to every post, displaying 24.08.2026 and sorting older articles incorrectly.
7. **Team ordering** — Production begins Matthias Feist, Ben Leo Bock, Philipp Kolb. Local begins Philipp Kolb, Matthias Feist, Ben Leo Bock because the SQL snapshot's `menu_order` differs from the current live database ordering.

### Interaction and animation

8. **Sticky-header state missing** — After scrolling, production adds `.sticky`, enabling translucent background, blur, shadow, and scale transition. Local never adds the class.
9. **Mobile language switcher missing from drawer** — Production JavaScript moves `.language-switcher` from the header container into the open navigation panel at widths ≤768px and restores it on desktop. Local leaves it in the header, where responsive CSS hides it, so DE/EN is unavailable in the drawer.
10. **Carousel disabled states missing** — Production initially applies `service-carousel-arrow--disabled` to Previous and applies it to Next at the final slide. Local never updates these classes, so visual and affordance states are wrong.
11. **Carousel desktop/tablet bounds wrong** — Production limits the final index to `cards - visibleCards` (3 desktop, 2 tablet, 1 mobile), clamps on resize, and recalculates the transform. Local permits advancing to the last card at every breakpoint and has no resize correction, allowing empty space after the final visible set.
12. **Carousel card selector differs** — Production controls `.service-grid-card`; local controls `.service-card`. This coupling caused the homepage to add a style-changing class merely to make the carousel function.
13. **Partner marquee readiness** — Production starts against the rendered duplicated strip. Local can start measuring after only the first completed image, before the full set is ready, making startup position/speed sensitive to image load timing.
14. **Anchor-scroll timing differs** — Production uses a 1000ms jQuery `swing` animation with a 100px header offset. Local delegates to native smooth scrolling, whose duration/easing varies by browser.
14. **Reduced-motion handling absent in both implementations** — The original and local implementations continuously animate the partner marquee and use smooth scrolling without honoring `prefers-reduced-motion`. This is not a parity difference, but it is an accessibility defect found during the animation audit and should be corrected without changing default motion.

### Content and rendering

15. **HTML entities shown literally** — Local plain-text React nodes display imported entity strings such as `&amp;` literally in “Krisen-Management, Restrukturierung &amp; lokales Know How” and “Unsere Services &amp; Expertise”; production displays `&`.
16. **SQL escape decoding corrupts line breaks** — The importer converts SQL `\r\n` escapes into the literal letters `rn`. This is visible in founder/body copy and can affect every imported long-text field.
17. **Germany office detail order** — Production footer shows the Bayreuth address before email and phone. Local shows email and phone first.
18. **English Karriere navigation loses language** — Local hard-codes `/karriere` in the header, so selecting Careers from English mode returns to German. Production localizes the URL.
19. **Contact form copy differs** — Production uses “Vorname eingeben”, “Nachname eingeben”, “Email eingeben”, “Betreff eingeben”, “Ihre Nachricht an uns”, and “Nachricht absenden” (with matching English copy). Local labels/placeholders/button text differ.
20. **Contact payload omits subject and separate name fields** — Local API submission only sends a single name, email, and message, unlike the visible production fields.
21. **Imported media was incomplete** — Before the media scrape, local had broken hero/partner/section assets, including `qm_backup-scaled.png`, `previn-…-scaled.jpg`, `IMG_8448-scaled.jpeg`, and `IMG_2229_1-scaled.jpg`. Production uses WordPress responsive variants. The repository media-fetch task also reports 34 stale/unrelated URLs (including old `/images/about.jpg` fallbacks) that are not live page dependencies.
22. **Responsive image markup differs** — Production WordPress attachments emit `srcset`/`sizes` and select resized variants. Local emits plain `<img src>` URLs. With the same originals this is visually equivalent at the audited sizes, but bandwidth and exact resampling differ.
23. **Related-service excerpts are not trimmed** — Production service detail cards apply WordPress `wp_trim_words(..., 20)`. Local prints the full excerpt, making the related-card row 108px taller on the representative service page.
24. **Blog permalink structure differs** — Production articles live at root-level slugs such as `/wettbewerbsanalyse_regulierungsanalyse/`. Local cards link to `/blog/[slug]`, and the production URL returns a local 404.
25. **404 design and copy differ** — Production uses the regular page title treatment with “Hoppla – Seite nicht gefunden”, explanatory copy, and “Zur Startseite”. Local shows a bare numeric “404”, shorter copy, and different container classes.

### Metadata, semantics, and structural differences

26. **Document titles are generic locally** — Production titles are route-specific (for example “Services – FeBoKo Consulting”); local inner routes inherit the generic “FeBoKo Consulting” title. Local also adds a generic meta description where production has none and omits production canonical/robots metadata.
27. **HTML language differs** — Production currently emits `lang="en-US"` even for German content. Local emits the semantically correct `de`/`en`. This is an intentional correctness improvement and should not be regressed for pixel parity.
28. **Header ARIA differs** — Local adds `aria-label="Primary"` to navigation and explicit `type="button"` attributes. Production lacks these. These do not change visuals and should remain as accessibility/HTML safety improvements.
29. **Visible route URLs differ in slash/absolute form** — Production links commonly use absolute, trailing-slash WordPress URLs; local uses relative Next.js URLs without trailing slashes. Visual rendering is unchanged, but canonical navigation output differs.
30. **Contact Form 7 internals are absent locally** — Production includes CF7 hidden fields, Akismet honeypot/timestamp, spinner, and CF7 response container/state classes. Those WordPress-specific implementation details cannot be reproduced meaningfully in Next.js, but visible layout, validation, acceptance, and feedback can be matched.

## Fix status

### Resolved

- Restored the original header and hero CSS at desktop and mobile breakpoints.
- Matched mobile menu composition, language-switcher placement, sticky-header classes, mega-menu hover/focus behavior, smooth-scroll timing, marquee measurement, carousel bounds, transforms, and disabled states.
- Removed the carousel's style-changing class mismatch while preserving production image cards.
- Rebuilt the visible German and English contact forms to the production field, copy, spacing, acceptance, and disabled-submit behavior; preserved subject data through the API/database path.
- Corrected footer office ordering, English Careers routing, HTML entity rendering, SQL escape decoding, publication dates, live team order, WordPress paragraph formatting, related-card excerpt length, production blog permalinks, 404 design, titles, canonicals, and robots metadata.
- Downloaded 264 live/imported media assets. No broken images remain on any audited route.
- Added reduced-motion behavior without changing the default animation design.

### Verification result

The measured header, hero, section, main, footer, and full-page heights now match production exactly at 1440 × 1000 and 390 × 844 for the audited homepage and archive/legal routes. Representative service, article, and 404 pages also match production main/footer/full-page geometry exactly. The English homepage full-page height and visible form copy match exactly. Mobile drawer geometry and language-switcher placement match exactly. Carousel transforms and arrow states match at both endpoints on desktop and mobile.

Final parity score: **99/100**. The one-point reserve covers nonvisual or non-portable implementation differences listed below.

### Remaining non-portable or intentionally retained differences

1. WordPress emits `lang="en-US"` on German pages. The Next.js port intentionally retains correct `de`/`en` language metadata.
2. WordPress attachment markup includes generated `srcset`/`sizes`; the port uses downloaded original assets. Audited rendering geometry is identical, but network selection/resampling can differ.
3. WordPress-specific CF7 and Akismet nonce/timestamp internals do not have a meaningful Next.js equivalent. The port matches visible fields, validation gate, feedback structure, and includes its own honeypot, but not WordPress plugin state.
4. Relative Next.js links can differ from WordPress's serialized absolute/trailing-slash `href` attributes even when navigation, canonical targets, and rendered output are equivalent.
5. A continuously running marquee cannot be captured at the same animation frame in two independently loaded pages; logo phase can differ in screenshots although speed, spacing, reset distance, and geometry match.
6. The media scraper still reports 34 stale URLs from the historical SQL/fallback list. None are referenced as broken images on the audited live routes.
