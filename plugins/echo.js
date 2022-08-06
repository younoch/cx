export default async function ({ $echo, $auth, store }) {
  if ($echo.options.broadcaster !== $echo.config.broadcaster) {
    $echo.options.broadcaster = $echo.config.broadcaster;
    await $echo.connect();
    if (!$auth.loggedIn) {
      return;
    }
    const authId = await $auth.user.id;
    await store.dispatch('online/joinOnline');
    await store.dispatch('notification/joinToChannel', authId);
    await store.dispatch('notification/getNotifications');
  }
}
