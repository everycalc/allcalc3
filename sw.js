// A minimal service worker to ensure ads.txt is served correctly.

// This event listener ensures the service worker activates
// as soon as it's installed.
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Take control of all pages under this service worker's scope immediately.
  event.waitUntil(self.clients.claim());
});

// The core logic to handle the ads.txt file.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // If the request is for ads.txt, respond directly with the required content and a 200 OK status.
  if (url.pathname === '/ads.txt') {
    event.respondWith(
      new Response('google.com, pub-2892214526865008, DIRECT, f08c47fec0942fa0', {
        status: 200,
        statusText: "OK",
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return; // Important: stop further processing for this request.
  }

  // For all other requests, do nothing and let the browser handle them as usual.
  // This removes the complex caching to ensure this service worker activates reliably.
  return;
});
