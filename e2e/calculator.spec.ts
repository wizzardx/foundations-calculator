import { test as baseTest, expect, Page } from "@playwright/test";

// Define a custom fixture for error-trapping
type ErrorTrappingFixture = {
  consoleMessages: string[];
  uncaughtExceptions: string[];
};

const test = baseTest.extend<ErrorTrappingFixture>({
  consoleMessages: async ({ page }, use) => {
    const messages: string[] = [];
    page.on("console", (msg) => {
      messages.push(msg.text());
    });
    await use(messages);
  },
  uncaughtExceptions: async ({ page }, use) => {
    const exceptions: string[] = [];
    page.on("pageerror", (error) => {
      exceptions.push(error.message);
    });
    await use(exceptions);
  },
});

// Setup function
async function setupPage(page: Page) {
  await page.goto("http://localhost:8080/calculator.html");
}

// Individual tests
test("page loads correctly", async ({ page }) => {
  await setupPage(page);

  const answerSpan = page.locator("#answer");
  await expect(answerSpan).toBeVisible();
  await expect(page).toHaveTitle("Calculator");
  await expect(answerSpan).toHaveText("0");
});

test("clear button works", async ({ page }) => {
  await setupPage(page);

  const answerSpan = page.locator("#answer");
  const buttonClear = page.locator('button:has-text("Clear")');

  await expect(buttonClear).toBeVisible();
  await buttonClear.click();
  await expect(answerSpan).toHaveText("0");
});

test("basic addition works", async ({ page }) => {
  await setupPage(page);

  const answerSpan = page.locator("#answer");
  const buttonThree = page.locator('button:has-text("3")');
  const buttonPlus = page.locator('button:has-text("+")');
  const buttonFive = page.locator('button:has-text("5")');
  const buttonEqual = page.locator('button:has-text("=")');

  await buttonThree.click();
  await buttonThree.click();
  await buttonPlus.click();
  await buttonFive.click();
  await buttonFive.click();
  await buttonEqual.click();

  await expect(answerSpan).toHaveText("88");
});

test("division by zero", async ({ page }) => {
  await setupPage(page);

  const answerSpan = page.locator("#answer");
  const buttonFive = page.locator('button:has-text("5")');
  const buttonDivide = page.locator('button:has-text("/")');
  const buttonZero = page.locator('button:has-text("0")');
  const buttonEqual = page.locator('button:has-text("=")');

  await buttonFive.click();
  await buttonDivide.click();
  await buttonZero.click();
  await buttonEqual.click();

  await expect(answerSpan).toHaveText(
    "No division by zero is allowed, you silly goose!",
  );
});

test("decimal addition works", async ({ page }) => {
  await setupPage(page);

  const answerSpan = page.locator("#answer");
  const buttonOne = page.locator('button:has-text("1")');
  const buttonTwo = page.locator('button:has-text("2")');
  const buttonThree = page.locator('button:has-text("3")');
  const buttonFour = page.locator('button:has-text("4")');
  const buttonPoint = page.locator('button:has-text(".")');
  const buttonPlus = page.locator('button:has-text("+")');
  const buttonEqual = page.locator('button:has-text("=")');

  await buttonOne.click();
  await buttonPoint.click();
  await buttonTwo.click();
  await buttonPlus.click();
  await buttonThree.click();
  await buttonPoint.click();
  await buttonFour.click();
  await buttonEqual.click();

  await expect(answerSpan).toHaveText("4.6");
});

// Check for console errors
test("check for console errors", async ({
  page,
  consoleMessages,
  uncaughtExceptions,
}) => {
  await setupPage(page);

  // Perform some actions that might cause errors
  await page.evaluate(() => {
    console.error("This is a test error");
  });

  // Check if the console error was captured
  expect(consoleMessages).toContain("This is a test error");

  // Now throw an error and check if it's caught
  let thrownError: Error | null = null;
  try {
    await page.evaluate(() => {
      throw new Error("This is a test exception");
    });
  } catch (error) {
    thrownError = error as Error;
  }

  // Check if the error was thrown
  expect(thrownError).not.toBeNull();
  expect(thrownError?.message).toContain("This is a test exception");

  // Log captured messages and exceptions for debugging
  console.log("Captured console messages:", consoleMessages);
  console.log("Captured uncaught exceptions:", uncaughtExceptions);
  console.log("Thrown error:", thrownError);
});
