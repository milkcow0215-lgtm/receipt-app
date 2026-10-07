const CACHE_NAME =
  'receipt-app-v1';


const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];


self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          cache =>
            cache.addAll(APP_FILES)
        )

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  'activate',
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>
            Promise.all(

              keys
                .filter(
                  key =>
                    key !== CACHE_NAME
                )
                .map(
                  key =>
                    caches.delete(key)
                )

            )
        )

    );

    self.clients.claim();

  }
);


self.addEventListener(
  'fetch',
  event => {

    /*
      GitHub PWA 자체 파일만 캐시 처리.

      Apps Script 영수증 데이터는
      항상 인터넷에서 최신 내용을 불러옴.
    */

    const requestUrl =
      new URL(
        event.request.url
      );


    if (
      requestUrl.origin ===
      self.location.origin
    ) {

      event.respondWith(

        caches
          .match(event.request)
          .then(
            cached =>
              cached ||
              fetch(event.request)
          )

      );

    }

  }
);