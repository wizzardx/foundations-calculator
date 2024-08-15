/**
 * @file Custom utility for running doctests on TypeScript files.
 * @description This module provides functionality to parse and run example code from JSDoc comments.
 */

/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

interface Example {
  name: string;
  code: string;
  expected: string;
  fileName: string;
  functionName: string;
  lineNumber: number;
}

/**
 * Runs a single example and compares the result with the expected output.
 * @param {Example} example - The example to run, containing name, code, and expected output.
 * @param {Record<string, unknown>} importedModule - The imported module containing the functions to test.
 * @throws {Error} If the example doesn't match the expected output or if an unexpected error occurs.
 * @example
 * ```ts
 * const example = {
 *   name: 'add',
 *   code: 'add(2, 3)',
 *   expected: '5',
 *   fileName: 'math.ts',
 *   functionName: 'add',
 *   lineNumber: 10
 * };
 * const importedModule = { add: (a, b) => a + b };
 * runExample(example, importedModule);
 * // This would run the example and check if the output matches the expected result
 * ```
 */
function runExample(
  example: Example,
  importedModule: Record<string, unknown>,
): void {
  const { name, code, expected, fileName, functionName, lineNumber } = example;
  const actualResult: unknown = new Function(
    ...Object.keys(importedModule),
    `return ${code}`,
  )(...Object.values(importedModule));

  if (expected.startsWith("Throws")) {
    throw new Error(`Example for ${name} did not throw an error as expected`);
  }

  if (JSON.stringify(actualResult) !== JSON.stringify(eval(expected))) {
    throw new Error(
      `Doctest failed in file ${fileName}, function ${functionName} on line ${lineNumber}:\n` +
        `Example: ${code}\n` +
        `Expected: ${expected}\n` +
        `Actual: ${JSON.stringify(actualResult)}`,
    );
  }
}

/**
 * Handles errors thrown during example execution.
 * @param {unknown} error - The error thrown during example execution.
 * @param {Example} example - The example that caused the error.
 * @throws {Error} If the error doesn't match the expected error or if an unexpected error occurs.
 * @example
 * ```ts
 * const example = {
 *   name: 'divide',
 *   code: 'divide(1, 0)',
 *   expected: 'Throws Error: Division by zero',
 *   fileName: 'math.ts',
 *   functionName: 'divide',
 *   lineNumber: 20
 * };
 * try {
 *   // Some code that throws an error
 * } catch (error) {
 *   handleError(error, example);
 * }
 * // This would check if the thrown error matches the expected error
 * ```
 */
function handleError(error: unknown, example: Example): void {
  const { expected, fileName, functionName, lineNumber, code } = example;
  if (!expected.startsWith("Throws")) {
    throw new Error(
      `Unexpected error in file ${fileName}, function ${functionName} on line ${lineNumber}:\n` +
        `Example: ${code}\n` +
        `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const expectedErrorMessage: string = expected.replace("Throws Error: ", "");
  if (error instanceof Error) {
    if (error.message !== expectedErrorMessage) {
      throw new Error(
        `Doctest failed in file ${fileName}, function ${functionName} on line ${lineNumber}:\n` +
          `Example: ${code}\n` +
          `Expected error: ${expectedErrorMessage}\n` +
          `Actual error: ${error.message}`,
      );
    }
  } else {
    throw new Error(
      `Doctest failed in file ${fileName}, function ${functionName} on line ${lineNumber}:\n` +
        `Example: ${code}\n` +
        `Expected an Error object to be thrown, but got: ${String(error)}`,
    );
  }
}

/**
 * Runs doctests for a given TypeScript file.
 * @param {string} filePath - The path to the TypeScript file to test.
 * @throws {Error} If an example fails or if there's an error during execution.
 * @example
 * ```ts
 * await runDocTests('./src/functions.ts');
 * // This would run all the doctests in the functions.ts file
 * ```
 */
export async function runDocTests(filePath: string): Promise<void> {
  const fileContent: string = fs.readFileSync(filePath, "utf-8");
  const sourceFile: ts.SourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );

  const examples: Example[] = [];

  /**
   * Visits nodes in the AST to find JSDoc examples.
   * @param {ts.Node} node - The current node being visited.
   * @example
   * ```ts
   * const sourceFile = ts.createSourceFile('example.ts', 'const x = 5;', ts.ScriptTarget.Latest);
   * visitNode(sourceFile);
   * // This would process the AST of the 'example.ts' file
   * ```
   */
  function visitNode(node: ts.Node): void {
    if (
      ts.isExportAssignment(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isVariableStatement(node)
    ) {
      const jsDocTags: readonly ts.JSDocTag[] = ts.getJSDocTags(node);
      const exampleTag: ts.JSDocTag | undefined = jsDocTags.find(
        (tag: ts.JSDocTag): boolean => tag.tagName.escapedText === "example",
      );

      if (exampleTag && typeof exampleTag.comment === "string") {
        const commentText: string = exampleTag.comment;

        const match: RegExpMatchArray | null = commentText.match(
          /```ts\n([\s\S]*?)\n\/\/\s*=>\s*([\s\S]*?)\n```/,
        );
        if (match) {
          const [, code, expected] = match;
          const name: string = ts.isVariableStatement(node)
            ? (node.declarationList.declarations[0].name as ts.Identifier).text
            : ts.isFunctionDeclaration(node) && node.name
              ? node.name.text
              : "default export";

          const lineNumber: number =
            sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

          examples.push({
            name,
            code: code.trim(),
            expected: expected.trim(),
            fileName: path.basename(filePath),
            functionName: name,
            lineNumber,
          });
        }
      }
    }

    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);

  const modulePath: string = path.resolve(__dirname, filePath);
  const importedModule: Record<string, unknown> = await import(modulePath);

  for (const example of examples) {
    try {
      runExample(example, importedModule);
    } catch (error: unknown) {
      handleError(error, example);
    }
  }
}
