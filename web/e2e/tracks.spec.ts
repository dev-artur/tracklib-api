import { test, expect, type Page } from "@playwright/test";

async function fillTrackForm(page: Page, overrides: Partial<Record<"Title" | "Artist" | "Genre" | "BPM", string>> = {}) {
  const values = { Title: `E2E track ${Date.now()}`, Artist: "Playwright", Genre: "test", ...overrides };
  for (const [label, value] of Object.entries(values)) {
    await page.getByLabel(label).fill(value);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("adds a track and shows it in the list", async ({ page }) => {
  const title = `E2E track ${Date.now()}`;

  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Artist").fill("Playwright");
  await page.getByLabel("Genre").fill("test");
  await page.getByLabel("Album").fill("test");
  await page.getByLabel("BPM").fill("120");
  await page.getByLabel("Tags").fill("test");
  await page.getByRole("button", { name: "Add Track" }).click();

  await expect(page.getByText(`${title} - Playwright`)).toBeVisible();
});

test("shows a server validation error when BPM is out of range", async ({ page }) => {
  await fillTrackForm(page, { BPM: "500" });
  await page.getByRole("button", { name: "Add Track" }).click();
  await expect(page.getByRole("alert")).toContainText(/bpm/i);
});

// No e2e test for the empty state: the test database is shared between
// parallel workers and is never empty after the first run, so the scenario
// can't be reproduced without clearing the DB (which would race with other
// tests). Empty-state rendering is covered by the TrackList component test.
