import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ isDev, app, $config }) => {
  if (!isDev) {
    Vue.use(VueGtag, {
      config: { id: $config.googleMeasurementId },
      appName: $config.appName,
      pageTrackerScreenviewEnabled: true
    },
      app.router);
  } else {
    console.log("Skipping GA in development")
  }
}
