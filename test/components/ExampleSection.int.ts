import { expect, describe, test, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";

import ExampleSection from "../../src/components/ExampleSection.svelte";

describe("NavBar", () => {
  test("shows branding link text", () => {
    render(NavBar, { heading: "BrandZ" });
    const heading = screen.getByText("BrandZ");
    expect(heading).toBeInTheDocument();
  });
});
