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
}

/**
 * Runs doctests for a given TypeScript file.
 * @param {string} filePath - The path to the TypeScript file to test.
 * @throws {Error} If an example fails or if there's an error during execution.
 * @example
 * await runDocTests('./src/functions.ts');
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

          examples.push({ name, code: code.trim(), expected: expected.trim() });
        }
      }
    }

    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);

  const modulePath: string = path.resolve(__dirname, filePath);
  const importedModule: Record<string, unknown> = await import(modulePath);

  for (const example of examples) {
    const { name, code, expected } = example;
    const actualResult: unknown = new Function(
      ...Object.keys(importedModule),
      `return ${code}`,
    )(...Object.values(importedModule));
    const expectedResult: unknown = new Function(`return ${expected}`)();

    if (JSON.stringify(actualResult) !== JSON.stringify(expectedResult)) {
      throw new Error(
        `Example for ${name} failed: expected ${expectedResult}, but got ${actualResult}`,
      );
    }
  }
}
