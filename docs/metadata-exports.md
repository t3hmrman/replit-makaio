# Metadata Exports

Every component should export the metadata relevant to *using* the component.

## Metadata structure

```typescript
interface ComponentMetadata {
  name: string; // Name fo the component in UpperCamelCase
  description: string; // A description of the component and what it does/how to use it
  component: {
    className: string; // An identifying class name for the component
  };
  props: {
    zod: ZodObject; // A zod specification of the props accepted by this component
    schema: JSONSchemaObject; // A JSONSchema specification of the props accepted by this component
  };
}
```

### Example

```svelte
<script context="module" lang="ts">
  import { z } from 'zod';
  import { zodToJsonSchema } from "zod-to-json-schema";

  const zod = z.object({
    isMenuOpen: z.boolean().optional(),
    brandLinkHref: z.string().optional(),
    brandLinkText: z.string().optional(),
    menuButtonText: z.string().optional(),
    menuItems: z.array(z.object({
      id: z.number(),
      label: z.string(),
    })),
  })
        .describe("Props for LandingPage component");

  // Framework metadata
  export const metadata = {
    name: 'NavBar',
    description: {
      'en': 'Navigation bar (normally used at the top of a page)',
    },
    component: {
      className: 'component-navbar',
    },
    props: {
      zod,
      schema: zodToJsonSchema(zod, "LandingPage")
    },
  };
</script>

<script>
  ...
</script>

<header>
  ...
</header>
```
