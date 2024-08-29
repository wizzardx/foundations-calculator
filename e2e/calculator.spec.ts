import { test, expect } from "@playwright/test";
import {
  getOriginalPositionFromSourceMap,
  getClickableErrorStack,
  handleFailedRequest,
} from "./sourceMapUtils";

test("basic test", async ({ page }) => {
  const consoleMessages: string[] = [];
  const uncaughtExceptions: string[] = [];

  // Add a global error event listener
  await page.evaluate(() => {
    window.addEventListener("error", (event) => {
      console.error("Uncaught exception:", event.error);
    });
  });

  page.on("console", async (msg) => {
    const location = msg.location();
    const { source, line, column } = await getOriginalPositionFromSourceMap(
      location?.url ?? "",
      location?.lineNumber ?? 0,
      location?.columnNumber ?? 0,
    );
    const formattedMsg = `${source}:${line}:${column} - ${msg.text()}`;

    consoleMessages.push(formattedMsg);

    if (msg.type() === "error") {
      console.error(`Browser console error: ${formattedMsg}`);
      if (formattedMsg.includes("Uncaught exception:")) {
        uncaughtExceptions.push(formattedMsg);
      }
    } else {
      console.log(`Logged to console: ${formattedMsg}`);
    }
  });

  page.on("pageerror", async (exception: Error) => {
    const clickableStack = await getClickableErrorStack(exception);
    console.error(`Uncaught exception:\n${clickableStack}`);
    uncaughtExceptions.push(exception.message);
    // Also add to consoleMessages to ensure we capture it
    consoleMessages.push(`Uncaught exception: ${exception.message}`);
  });

  page.on("requestfailed", async (request) => {
    const url = request.url();
    console.error(`Failed request: ${url}`);
    await handleFailedRequest(url);
  });

  await page.goto("http://localhost:8080/calculator.html");

  // Check if the answer span is rendered
  const answerSpan = page.locator("#answer");
  await expect(answerSpan).toBeVisible();

  // Check if the page title is correct
  await expect(page).toHaveTitle("Calculator");

  // Check that the starting answer text is our current default, "0"
  await expect(answerSpan).toHaveText("0");

  // Press the 'Clear' button
  const buttonClear = page.locator('button:has-text("Clear")');
  await expect(buttonClear).toBeVisible();
  await buttonClear.click();

  // Our displayed answer should now just be zero:
  await expect(answerSpan).toHaveText("0");

  // Find the button with the text "3" in it:
  const buttonThree = page.locator('button:has-text("3")');
  await expect(buttonThree).toBeVisible();

  // Click the button:
  await buttonThree.click();

  // Displayed text should be 3:
  await expect(answerSpan).toHaveText("3");

  // Click the button again:
  await buttonThree.click();

  // Check that the text in the answer is "33".
  await expect(answerSpan).toHaveText("33");

  // Press the "+" button
  const buttonPlus = page.locator('button:has-text("+")');
  await expect(buttonPlus).toBeVisible();
  await buttonPlus.click();

  // Display should now read "+"
  await expect(answerSpan).toHaveText("+");

  // Press 5 twice:
  const buttonFive = page.locator('button:has-text("5")');
  await expect(buttonFive).toBeVisible();
  await buttonFive.click();
  await buttonFive.click();

  // Display should read "55"
  await expect(answerSpan).toHaveText("55");

  // Press the "=" button
  const buttonEqual = page.locator('button:has-text("=")');
  await expect(buttonEqual).toBeVisible();
  await buttonEqual.click();

  // Display should read "88"
  await expect(answerSpan).toHaveText("88");
});
