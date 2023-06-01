import { afterAll, beforeAll, describe, test, it } from "vitest";
import { preview, type PreviewServer } from "vite";
import { expect, chromium, type Browser, type Page } from "@playwright/test";
import getPort from "get-port";

/**
 * This file tests *the entire suite via the demo page*
 *
 * It would be preferable to have per-component E2E tests but that's not quite working yet
 */
describe("Demo", async () => {
  let browser: Browser;
  let page: Page;
  let server: PreviewServer;
  let serverURL: string;
  let port: number;

  beforeAll(async () => {
    port = await getPort();
    serverURL = `http://localhost:${port}`;
    server = await preview({ preview: { port } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test("loads with the proper title", async () => {
    await page.goto(serverURL);
    await expect(await page.title()).toBe("Demo");
  });
});
