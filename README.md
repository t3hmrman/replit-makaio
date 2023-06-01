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

# template-svelte-composable-component

This repository contains a template for composable components in [Svelte][svelte].

Outside of simply being a component, a "composable component" is any Svelte component that:

- Provides a static exports called `props`, which is a [JSONSchema][jsonschema] object definition of all props
- Support for passing a service by name, given a [service resolution mechanism](#service-resolution) (ex. `service:<contract>[:<id>]`)
- All services & external reactivity available via props (i.e. components should have no global state)
- Support for i18n (via [`svelte-i18n`][svelte-i18n])
  - i.e. no un-interpolated strings in components
- Support for tests (via [`vitest`][vitest])
  - i.e. at least one unit, integration (`jsdom`), and e2e test (`playwright`/`puppeteer`/`selenium`) must be present

The goal is to create a standard for robust Svelte components that can be reused easily within this framework.

## Integrations

## What is a Service?

A service is any JS object defined by a specific interface.

For example, here's the interface for a [Svelte store](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract).

```typescript
type SubscriptionFn<T> = (value: T) => void;
type SubscriptionCancelFn = () => void;

interface SvelteStore<T> {
  subscribe<T>(subFn: SubscriptionFn<T>) => Promise<SubscriptionCancelFn>;

  set<T>?(value: T) => Promise<void>;
}
```

Here's an example of a How do we know that a certain object represents a certain interface? Unforunately we can't All services that comply must provide two things:

```typescript
import { z } from 'zod';

export const uri = "urn:sade:stores:svelte/v1";

export class ExampleService<T> implements SvelteStore {

  subscribe<T>(fn: SubscriptionFn<T>) {
    console.log("subscribing...");
    // ...logic here ...
    return Promise.resolve(() => console.log("cancelled!"));
  }

  set<T>(value: T) {
    console.log("setting...");
    // ...logic here ...
  }

});
```

Unfortunately at present there is no way to validate that components meet the URI contract they _say_ they do.

[zod]: https://github.com/colinhacks/zod

### Service Resolution

As you might imagine, though Svelte support passing objects, passing an _object_ is not supported in some JS component contexts (i.e. those which are closer to what the DOM provides natively).

To work in such environments, composable components can also pass _references_ to services, trusting that the downstream component uses an appropriate _service resolution function_.

If services are specified via IDs (ex. `store:<contract>`), then a flexible service discovery mechanism is used. The service discovery mechanism is attached to the component object _itself_ (i.e. `Component.service.resolve`) and can be changed at runtime (when the component class is used).

The default service revolution is to use a lookup of existing svelte stores, by contract:

```svelte
<script lang="ts" context="module">
import { serviceResolution } from "composable-components";
import { yourStore } from "$lib/stores";

// This is a Component (class) level static export
// all instances of the class will share this export, and it can be relied upon by
// external consumers of this class.
export const service = {

  // Ultra-minimal service resolution.
  // Note that this resolution function does *not* support services with different IDs
  resolve: (serviceId: string) => {
    if serviceId.startsWith(some-contract') { return yourStore; }
    throw new Error(`Failed to resolve store for service ID [${serviceId}]`);
  },

};
</script>

<script>
    let svc = this.service.resolve('some-contract');
    let heading = svc.getString('heading'); // let's assume the some-contract service can return reactive strings fit for Svelte
    let body = svc.getString('body');
</script>

<div>
  <h1>{ $heading }</h2>
  <p>{ $body }</p>
</div>
```

This also enables pulling in stores via any other mechanism that could be holding them (Svelte itself, etc).

In the future, having a flexible service resolution mechanism on a per-component basis enables useful features:

- Support for native web components
- Support for many different component frameworks (React, Vue, etc)
- Support in server-side rendering (for components that support it)
- Use of the [SADE pattern][sade] (invented by the creator of this repo) in web/DOM native with minimal-to-no JS.

[svelte-i18n]: https://github.com/kaisermann/svelte-i18n
[vitest]: https://vitest.dev
[svelte-docs-stores]: https://svelte.dev/docs#run-time-svelte-store-writable
[sade-pattern]: https://mrman.gitlab.io/services-as-dom-elements/
