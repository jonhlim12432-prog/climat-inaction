/**
 * Dynamically updates the browser favicon icon tag when a new logo is uploaded.
 */
export function updateFavicon(iconUrl?: string) {
  const defaultFavicon =
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>";
  const targetUrl = iconUrl && iconUrl.trim() !== '' ? iconUrl.trim() : defaultFavicon;

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.href = targetUrl;

  // Also update or create apple-touch-icon for mobile home screen bookmarking
  let appleTouchLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleTouchLink) {
    appleTouchLink = document.createElement('link');
    appleTouchLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleTouchLink);
  }
  appleTouchLink.href = targetUrl;
}
