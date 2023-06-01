import { register, init, getLocaleFromNavigator } from "svelte-i18n";

// Register the initial locales in the dictionary
let REGISTERED = false;
if (!REGISTERED) {
  register("en", () => {
    REGISTERED = true;
    return import("../i18n/en.json");
  });
}

// Initialize the navigator locale
let INITIALIZED = false;
if (!INITIALIZED) {
  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });
  INITIALIZED = true;
}
