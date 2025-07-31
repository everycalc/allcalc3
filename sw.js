const CACHE_NAME = 'all-in-one-calculator-v2.3.0'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/metadata.json',
  '/manifest.json',
  '/data/calculators.ts',
  '/data/policyContent.tsx',

  // Components
  '/components/AOVCalculator.tsx',
  '/components/AdsensePlaceholder.tsx',
  '/components/AgeCalculator.tsx',
  '/components/AreaCalculator.tsx',
  '/components/AreaCostEstimator.tsx',
  '/components/AverageCalculator.tsx',
  '/components/BMICalculator.tsx',
  '/components/BreakEvenCalculator.tsx',
  '/components/BreakEvenROASCalculator.tsx',
  '/components/CLVCACCalculator.tsx',
  '/components/CalculatorButton.tsx',
  '/components/CalculatorCard.tsx',
  '/components/CalculatorCarousel.tsx',
  '/components/CalculatorHistoryView.tsx',
  '/components/CalculatorPageWrapper.tsx',
  '/components/CarpetAreaCalculator.tsx',
  '/components/CompoundInterestCalculator.tsx',
  '/components/CookieConsentBanner.tsx',
  '/components/CreditCardInterestCalculator.tsx',
  '/components/CurrencyConverter.tsx',
  '/components/DailyRewardsPage.tsx',
  '/components/DateTracker.tsx',
  '/components/DiscountCalculator.tsx',
  '/components/Display.tsx',
  '/components/ECommerceProfitCalculator.tsx',
  '/components/FDRDCalculator.tsx',
  '/components/FeedbackModal.tsx',
  '/components/ForceAccelerationCalculator.tsx',
  '/components/FuelCostCalculator.tsx',
  '/components/GSTTaxCalculator.tsx',
  '/components/HistoryAd.tsx',
  '/components/HistoryDropdown.tsx',
  '/components/HistoryPanel.tsx',
  '/components/HomeLoanEMICalculator.tsx',
  '/components/HomePage.tsx',
  '/components/InfoTooltip.tsx',
  '/components/InsufficientFuelModal.tsx',
  '/components/InterstitialAdModal.tsx',
  '/components/InventoryManagementCalculator.tsx',
  '/components/JustInTimeGuide.tsx',
  '/components/LoanCalculator.tsx',
  '/components/Logo.tsx',
  '/components/LogTrigCalculator.tsx',
  '/components/MedianModeCalculator.tsx',
  '/components/MutualFundReturnsCalculator.tsx',
  '/components/OfflineNotice.tsx',
  '/components/OutOfFuelToast.tsx',
  '/components/PdfFuelModal.tsx',
  '/components/PercentageCalculator.tsx',
  '/components/PieChart.tsx',
  '/components/PolicyPage.tsx',
  '/components/ProductCostCalculator.tsx',
  '/components/ProfitMarginCalculator.tsx',
  '/components/RecentHistory.tsx',
  '/components/RecipeCostCalculator.tsx',
  '/components/RentVsBuyCalculator.tsx',
  '/components/RewardedAdModal.tsx',
  '/components/SIPCalculator.tsx',
  '/components/SaveDatesModal.tsx',
  '/components/SavedDatesPage.tsx',
  '/components/ScientificCalculator.tsx',
  '/components/ShareButton.tsx',
  '/components/SharePromptModal.tsx',
  '/components/Sidebar.tsx',
  '/components/StandardCalculator.tsx',
  '/components/TabButton.tsx',
  '/components/ThemeModal.tsx',
  '/components/ThemeSelector.tsx',
  '/components/TripExpenseSplitter.tsx',
  '/components/UnitConverter.tsx',
  '/components/UnskippableAdModal.tsx',
  '/components/VelocityDistanceCalculator.tsx',
  '/components/VolumeCalculator.tsx',
  '/components/ExplanationModal.tsx',

  // Contexts
  '/contexts/AdContext.tsx',
  '/contexts/DailyRewardsContext.tsx',
  '/contexts/DateTrackerContext.tsx',
  '/contexts/FuelContext.tsx',
  '/contexts/HistoryContext.tsx',
  '/contexts/ThemeContext.tsx',

  // 3rd party
  "https://cdn.tailwindcss.com",
  "https://esm.sh/react@^19.1.0",
  "https://esm.sh/react-dom@^19.1.0/client",
  "https://esm.sh/react@^19.1.0/",
  "https://esm.sh/react-dom@^19.1.0/",
  "https://esm.sh/@dnd-kit/core@6.1.0",
  "https://esm.sh/@dnd-kit/sortable@8.0.0",
  "https://esm.sh/@dnd-kit/utilities@3.2.2",
  "https://esm.sh/jspdf@2.5.1",
  "https://esm.sh/html2canvas@1.4.1",
  "https://esm.sh/@google/genai"
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache assets during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Directly serve ads.txt from the service worker to ensure it's always available.
  if (url.pathname === '/ads.txt') {
    event.respondWith(
      new Response('google.com, pub-2892214526865008, DIRECT, f08c47fec0942fa0', {
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return;
  }

  // Use a Network First, Falling Back to Cache strategy for the main page (navigation)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If the fetch is successful, clone it and cache it for offline use.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If the network fails, serve the cached page.
          return caches.match(request).then(response => {
            return response || caches.match('/index.html');
          });
        })
    );
    return;
  }
  
  // For metadata.json, always try network first to get the latest version info.
  if (url.pathname === '/metadata.json') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Use a Stale-While-Revalidate strategy for all other assets
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(response => {
        const fetchPromise = fetch(request).then(networkResponse => {
          // If we got a valid response, update the cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
          console.warn('Fetch failed; returning offline fallback if available.', request.url, error);
          // The request was not in cache and network failed.
          // You could return a specific offline placeholder for images/scripts if needed.
        });

        // Return the cached response immediately if available, 
        // and let the fetch happen in the background to update the cache.
        return response || fetchPromise;
      });
    })
  );
});


// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
