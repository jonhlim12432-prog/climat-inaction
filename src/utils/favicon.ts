/**
 * Dynamically updates the browser favicon, apple-touch-icon, and Web App Manifest
 * so that when installing the app from Chrome (mobile or desktop), the active website logo
 * is automatically attached and used as the app install icon.
 */
export function updateFavicon(iconUrl?: string) {
  const hasCustomLogo = Boolean(iconUrl && iconUrl.trim() !== '');
  const activeLogo = hasCustomLogo ? iconUrl!.trim() : '/icon.svg';
  const appleIcon = hasCustomLogo ? iconUrl!.trim() : '/apple-touch-icon.png';

  // 1. Update or create browser favicon link
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = activeLogo;

  // 2. Update or create apple-touch-icon for mobile home screen
  let appleTouchLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleTouchLink) {
    appleTouchLink = document.createElement('link');
    appleTouchLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleTouchLink);
  }
  appleTouchLink.href = appleIcon;

  // 3. Dynamically update or create Web App Manifest so Chrome's native "Install App" prompt uses the logo
  updateWebManifest(iconUrl);

  // 4. Synchronize logo to backend for Chrome WebAPK service background fetches
  if (hasCustomLogo) {
    fetch('/api/branding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: activeLogo }),
    }).catch(() => {});
  }
}

/**
 * Dynamically generates and injects an updated Web App Manifest blob containing the active website logo
 */
export function updateWebManifest(customLogoUrl?: string) {
  try {
    const hasCustomLogo = Boolean(customLogoUrl && customLogoUrl.trim() !== '');
    const activeLogo = hasCustomLogo ? customLogoUrl!.trim() : '/pwa-512x512.png';

    const manifestData = {
      id: '/',
      name: 'Climate Action - Citizen Portal',
      short_name: 'ClimateAction',
      description: 'Full-stack municipal climate action reporting and information system with real-time telemetry, GIS incident tracking, and offline resilience.',
      theme_color: '#064e3b',
      background_color: '#064e3b',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: activeLogo,
          sizes: '192x192 512x512',
          type: activeLogo.startsWith('data:image/svg') || activeLogo.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
          purpose: 'any',
        },
        {
          src: activeLogo,
          sizes: '512x512',
          type: activeLogo.startsWith('data:image/svg') || activeLogo.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon.svg',
          sizes: '192x192 512x512',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    };

    const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: 'application/manifest+json',
    });
    const manifestBlobUrl = URL.createObjectURL(manifestBlob);

    let manifestLink: HTMLLinkElement | null = document.querySelector("link[rel='manifest']");
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestBlobUrl;
  } catch (err) {
    console.warn('Failed to update dynamic manifest:', err);
  }
}
