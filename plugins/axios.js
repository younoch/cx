export default function ({ app, $axios }) {
  const requestUrls = [];

  $axios.onRequest((config) => {
    if (app.$echo) {
      const socketId = app.$echo.socketId();
      // set socket id header
      if (socketId) {
        config.headers.common['X-Socket-ID'] = socketId;
      }
    }

    const source = $axios.CancelToken.source();
    config.cancelToken = source.token;
    requestUrls.push(source);
  });

  // cancel request before navigate
  app.router.beforeEach((to, from, next) => {
    if (requestUrls.length) {
      requestUrls.forEach((source) => {
        source.cancel('Request Canceled!');
      });
    }
    next();
  });
}
