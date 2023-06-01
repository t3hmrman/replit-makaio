<script context="module" lang="ts">
  import { z } from "zod";
  import { zodToJsonSchema } from "zod-to-json-schema";

  import {
    default as ExampleSection,
    metadata as ExampleSectionMeta,
  } from "./ExampleSection.svelte";

  // Build the zod description of the props
  const zod = z
    .object({
      first: ExampleSectionMeta.props.zod,
      second: ExampleSectionMeta.props.zod,
    })
    .describe("Props for LandingPage component");

  // Framework metadata
  export const metadata = {
    name: "LandingPage",
    isPage: true,
    description: {
      en: "A landing page",
    },
    component: {
      className: "page-landing-page",
    },
    props: {
      zod,
      schema: zodToJsonSchema(zod, "LandingPage"),
    },
  };
</script>

<script lang="ts">
  import "../i18n-setup";

  export let first: z.infer<typeof ExampleSectionMeta.props.zod> = {};
  export let second: z.infer<typeof ExampleSectionMeta.props.zod> = {};
</script>

<div class="page-landing-page landing-page">
  <main>
    <ExampleSection {...first} />
    <ExampleSection {...second} />
  </main>
</div>

<style>
  :global(html) {
    margin: 0;
  }
  :global(body) {
    margin: 0;
  }
</style>
