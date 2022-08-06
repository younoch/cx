export default function ({ $auth, redirect, route }) {
  if (!$auth.loggedIn) {
    return;
  }

  if (route.path === '/') {
    redirect('/feed');
  }
}
