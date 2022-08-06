export default function ({ $vuetify }) {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    $vuetify.theme.dark = true;
  } else {
    $vuetify.theme.dark = false;
  }
}
