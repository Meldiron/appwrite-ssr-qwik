import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";

import "./global.css";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />

        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width" />
        <link rel="manifest" href="/manifest.json" />

        <title>Almost SSR | Qwik</title>
        <meta
          name="description"
          content="Appwrite Loves Qwik! Demo application with authorized server-side and client-side rendering."
        />

        <meta property="og:url" content="https://qwik.ssr.almostapps.eu/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Almost SSR | Qwik" />
        <meta
          property="og:description"
          content="Appwrite Loves Qwik! Demo application with authorized server-side and client-side rendering."
        />
        <meta
          property="og:image"
          content="https://qwik.ssr.almostapps.eu/cover.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="qwik.ssr.almostapps.eu" />
        <meta
          property="twitter:url"
          content="https://qwik.ssr.almostapps.eu/"
        />
        <meta name="twitter:title" content="Almost SSR | Qwik" />
        <meta
          name="twitter:description"
          content="Appwrite Loves Qwik! Demo application with authorized server-side and client-side rendering."
        />
        <meta
          name="twitter:image"
          content="https://qwik.ssr.almostapps.eu/cover.png"
        />
      </head>
      <body lang="en" class="theme-dark">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
