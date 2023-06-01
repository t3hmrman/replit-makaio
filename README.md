# template-svelte-composable-component

This repository contains a template for components in [Svelte][svelte].

Components should have:

- [`metadata` exports](./docs/metadata-exports.md) for every Component with information about it
- i18n via [`svelte-i18n`][svelte-i18n]
- styling via [`tailwindcss`][tailwind]
- schema enforcement via [`zod`][zod]
- tests with [`vitest`][vitest] and [`playwright`][playwright]

The primary component of this repository is [`LandingPage.svelte`](./src/components/LandingPage.svelte)

[tailwind]: https://tailwindcss.com/
[svelte-i18n]: https://github.com/kaisermann/svelte-i18n
[zod]: https://github.com/colinhacks/zod
[playwright]: https://playwright.dev
[svelte]: https://svelte.dev

## Metadata exports

## Quickstart

To build the project:

```console
just setup build
```

This should output the built project (as-is) to the `dist` folder, ready to deploy.

## Development

### Tooling

To develop this project, you'll need the following tooling:

- [`just`][just] for running tasks (alternative to `make`)
- [`node`][node]
- [`nvm`][nvm]

[just]: https://github.com/casey/just
[node]: https://nodejs.org
[nvm]: https://nvm.io

### Quickstart

Once required tooling has been installed, you can get started developing:

```console
just setup # run once
just devloop
```

Key files in this project are:

- [`index.html`](./index.html): contains the page shell for Svelte to use
- [`src/index.ts`](./src/index.ts): contains the initialization code that creates the `LandingPage` Svelte component
- [`src/components/*.svelte`](./src/components): the components in use (including `LandingPage` itself)

## Testing

Tests are written with [`vitest`][vitest]

### How to run the tests

You can run all tests with the following:

```console
just test
```

You can run tests individually as well:

```console
just test-unit
just test-int
just test-e2e
```

## Reusablility

The `LandingPage` component is built for composability, which means that it exposes all configuration for the components within it so that it can be easily used the top level.

See `index.ts` -- it illustrates this concept and serves as a live demonstration:

```typescript
import {
  default as LandingPage,
  metadata as LandingPageMeta,
} from "./components/LandingPage.svelte";
import { z } from "zod";

// Components *do* rely on TailwindCSS
import "./index.css";

const component = new LandingPage({
  target: document.getElementById("component"),
  props: {
    // The top level component must declare props for the instantiations
    // it contains.
    //
    // For example below, we specify the props that
    // will be piped through to the
    // top navigation (an instance of <NavBar>)
    topnav: {
      brandLinkText: "Brand",
    },

    featureGroup: {
      second: {
        // Textual inputs are fed to svelte-i18n where necessary
        // so they can be paths into the i18n object rather than just strings
        // they should be decided at *the top level*, not the component level
        // (as components could be instantiated multiple times)
        heading: "featureGroup.heading",

        body: "Lots of important information in here.",
        orientation: "image-right",
      },
    },
  } as z.infer<typeof LandingPageMeta.props.zod>,
});

export default component;
```

[svelte-i18n]: https://github.com/kaisermann/svelte-i18n
[vitest]: https://vitest.dev
[svelte-docs-stores]: https://svelte.dev/docs#run-time-svelte-store-writable
