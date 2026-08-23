/** True when the site is built with a Studio site token (SDK content hydrate). */
export function studioContentEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STUDIO_SITE_TOKEN);
}
