<script context="module" lang="ts">
  import { z } from "zod";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import { _, init, getLocaleFromNavigator } from "svelte-i18n";

  const zod = z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
      buttonText: z.string().optional(),
      imageSrc: z.string().optional(),
      imageAltText: z.string().optional(),
      orientation: z.enum(["image-left", "image-right"]),
    })
    .describe("Props for ExampleSection component");

  export const metadata = {
    name: "ExampleSection",
    description: {
      en: "A featurette that displays a picture on the left (or right), with a title and body paragraph. This is usually used for displaying a feature of a product on a landing page.",
    },
    component: {
      className: "component-example-section",
    },
    props: {
      zod,
      schema: zodToJsonSchema(zod, "ExampleSection"),
    },
  };
</script>

<script lang="ts">
  import "../i18n-setup";
  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });

  export let heading = "Default prop value";
  export let body = "Default Body text";
  export let orientation = "image-left";

  export let buttonText = "Default Button text";
  export let onButtonClick = () => {
    console.log("[ExampleSection] button clicked");
  };

  export let imageSrc = "https://placehold.co/600x400";
  export let imageAltText = "Default Image Alt Text";
</script>

<div
  class="component-example-section mt-10 w-full md:w-3/4 flex flex-col-reverse md:flex-row bg-transparent rounded-lg overflow-hidden">
  {#if orientation === "image-right"}
    <!-- Text section -->
    <div class=" w-full md:w-1/2 md:p-10 p-5 mt-3 flex flex-col items-start">
      <!-- Heading -->
      <h2 id="heading" class="font-bold text-4xl mb-5">{$_(heading)}</h2>

      <p id="pg" class="text-slate-600 text-start text-xl">
        {$_(body)}
      </p>

      <!-- Button -->
      <div class="mt-4">
        <button
          id="btn"
          on:click|preventDefault="{onButtonClick}"
          class="bg-black text-white px-4 py-2 rounded-lg shadow-lg shadow-gray-400 shadow-gray-700 hover:shadow-xl hover:bg-slate-300 hover:text-blue-600"
          >{$_(buttonText)}</button>
      </div>
    </div>

    <!-- Image section -->
    <div class=" w-full md:w-1/2 relative">
      <img
        class="object-cover w-full md:w-3/4 h-full drop-shadow-xl"
        src="{$_(imageSrc)}"
        alt="{$_(imageAltText)}" />
    </div>
  {:else}
    <!-- Image section -->
    <div class="w-full md:w-1/2 flex items-end justify-end relative">
      <img
        class="object-cover w-full md:w-3/4 h-full drop-shadow-xl"
        src="{imageSrc}"
        alt="{imageAltText}" />
    </div>

    <!-- Text section -->
    <div class="w-full md:w-1/2 md:p-10 p-5 mt-3 flex flex-col items-start">
      <h2 class="font-bold text-4xl mb-5">{$_(heading)}</h2>
      <p class="text-slate-600 text-start text-xl">
        {$_(body)}
      </p>
      <div class="mt-4">
        <button
          on:click|preventDefault="{onButtonClick}"
          class="bg-black text-white px-4 py-2 rounded-lg shadow-lg shadow-gray-400 shadow-gray-700 hover:shadow-xl hover:bg-slate-300 hover:text-blue-600">
          {$_(buttonText)}
        </button>
      </div>
    </div>
  {/if}
</div>
