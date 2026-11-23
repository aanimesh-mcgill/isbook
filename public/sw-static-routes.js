self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      await Promise.all(
        windows.map((client) => {
          let path = '';
          try {
            path = new URL(client.url).pathname;
          } catch {
            return undefined;
          }
          if (
            path.startsWith('/textbooks/') ||
            path.startsWith('/course/') ||
            path.startsWith('/books/')
          ) {
            return client.navigate(client.url);
          }
          return undefined;
        }),
      );
    })(),
  );
});
