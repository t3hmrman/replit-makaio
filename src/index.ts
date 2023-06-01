import { default as LandingPage } from "./components/LandingPage.svelte";

import "./index.css";

const component = new LandingPage({
  target: document.getElementById("component"),
  props: {
    // The top level component must declare props for the component
    // instantiations it contains.
    //
    // For example below, we specify the props that
    // will be piped through to the
    // ExampleSection component(s) in LandingPage
    //
    first: {
      // instance of ExampleSection
      heading: "First Section",
      body: "sections.first.body",
      buttonText: "First Button",
      onButtonClick: () => {
        console.log("custom event firing!");
      },
    },

    second: {
      // instance of ExampleSection
      heading: "Second Section",
      body: "sections.second.body",
    },
  }, // this object is of type LandingPageMeta.props.zod
});

export default component;
