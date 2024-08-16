import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("http://localhost:8080/calculator.html");

  // Check if the answer span is rendered
  const answerSpan = page.locator("#answer");
  await expect(answerSpan).toBeVisible();

  // Check if the page title is correct
  await expect(page).toHaveTitle("Calculator");

  // Check that the starting answer text is our current default, "12345678"
  await expect(answerSpan).toHaveText("12345678");

  // Find the button with the text "3" in it:
  const buttonThree = page.locator('button:has-text("3")');
  await expect(buttonThree).toBeVisible();

  // Click the button twice:
  await buttonThree.click();
  await buttonThree.click();

  // Check that the text in the button is just "3".
  await expect(answerSpan).toHaveText("3");
});
