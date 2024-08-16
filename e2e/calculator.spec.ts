import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("http://localhost:8080/calculator.html");

  // // Check if the result div is rendered
  // const resultDiv = page.locator("#result");
  // await expect(resultDiv).toBeVisible();

  // Check if the page title is correct
  await expect(page).toHaveTitle("Calculator");

  // You can add more specific tests here, for example:
  // - Check if buttons are present (once you add them)
  // - Test calculator functionality (once implemented)
});
