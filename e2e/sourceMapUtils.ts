/**
 * Utility functions for handling source maps and error stacks.
 * @module sourceMapUtils
 * @description This module provides functions to work with source maps,
 * generate clickable error stacks, and handle failed requests.
 */

import { SourceMapConsumer, RawSourceMap } from "source-map";
import * as fs from "fs/promises";
import * as path from "path";

const sourceMapConsumers: Map<string, SourceMapConsumer> = new Map();

/**
 * Retrieves a SourceMapConsumer for the given file path or URL.
 * @param {string} filePathOrUrl - The file path or URL of the source file.
 * @returns {Promise<SourceMapConsumer | undefined>} The SourceMapConsumer instance or undefined if not found.
 * @example
 * const consumer = await getSourceMapConsumer("http://localhost:8080/app.js");
 * if (consumer) {
 *   // Use the consumer...
 * }
 */
async function getSourceMapConsumer(
  filePathOrUrl: string,
): Promise<SourceMapConsumer | undefined> {
  let consumer: SourceMapConsumer | undefined =
    sourceMapConsumers.get(filePathOrUrl);
  if (!consumer) {
    const sourceMapPath: string = getSourceMapPath(filePathOrUrl);
    try {
      const rawSourceMap: RawSourceMap = JSON.parse(
        await fs.readFile(sourceMapPath, "utf8"),
      );
      consumer = await new SourceMapConsumer(rawSourceMap);
      sourceMapConsumers.set(filePathOrUrl, consumer);
    } catch {
      // Source map not found or invalid, but we'll continue without it
    }
  }
  return consumer;
}

/**
 * Gets the source map path for a given file path or URL.
 * @param {string} filePathOrUrl - The file path or URL of the source file.
 * @returns {string} The path to the source map file.
 * @example
 * const sourceMapPath = getSourceMapPath("http://localhost:8080/app.js");
 * // Output: "/path/to/your/project/app.js.map"
 */
function getSourceMapPath(filePathOrUrl: string): string {
  if (filePathOrUrl.startsWith("http://localhost:8080/")) {
    const localPath: string = filePathOrUrl.replace(
      "http://localhost:8080/",
      "",
    );
    return path.join(process.cwd(), `${localPath}.map`);
  }
  return `${filePathOrUrl}.map`;
}

/**
 * Resolves the original source location.
 * @param {object} original - The original source location.
 * @param {string | null} original.source - The original source file.
 * @param {number | null} original.line - The original line number.
 * @param {number | null} original.column - The original column number.
 * @param {object} fallback - The fallback source location.
 * @param {string} fallback.source - The fallback source file.
 * @param {number} fallback.line - The fallback line number.
 * @param {number} fallback.column - The fallback column number.
 * @returns {object} The resolved source location.
 * @example
 * const resolved = resolveOriginalSource(
 *   { source: "original.ts", line: 10, column: 5 },
 *   { source: "fallback.js", line: 1, column: 1 }
 * );
 * // Output: { source: "/path/to/src/original.ts", line: 10, column: 5 }
 */
function resolveOriginalSource(
  original: {
    source: string | null;
    line: number | null;
    column: number | null;
  },
  fallback: { source: string; line: number; column: number },
): { source: string; line: number; column: number } {
  if (original.source !== null) {
    const resolvedSource: string = path.resolve(
      process.cwd(),
      "src",
      path.basename(original.source),
    );
    return {
      source: resolvedSource,
      line: original.line ?? fallback.line,
      column: original.column ?? fallback.column,
    };
  }
  return fallback;
}

/**
 * Gets the original position from a source map for a given file and position.
 * @param {string} filePathOrUrl - The file path or URL of the source file.
 * @param {number} line - The line number in the compiled file.
 * @param {number} column - The column number in the compiled file.
 * @returns {Promise<{ source: string; line: number; column: number }>} The original position.
 * @example
 * const originalPosition = await getOriginalPositionFromSourceMap(
 *   "http://localhost:8080/app.js",
 *   10,
 *   5
 * );
 * // Output: { source: "/path/to/original/file.ts", line: 8, column: 3 }
 */
async function getOriginalPositionFromSourceMap(
  filePathOrUrl: string,
  line: number,
  column: number,
): Promise<{ source: string; line: number; column: number }> {
  if (filePathOrUrl.endsWith("/calculator.html")) {
    return {
      source: path.join(
        process.cwd(),
        filePathOrUrl.replace("http://localhost:8080/", ""),
      ),
      line,
      column,
    };
  }

  const consumer: SourceMapConsumer | undefined =
    await getSourceMapConsumer(filePathOrUrl);
  if (!consumer) {
    return { source: filePathOrUrl, line, column };
  }

  const original: {
    source: string | null;
    line: number | null;
    column: number | null;
  } = consumer.originalPositionFor({ line, column });
  return resolveOriginalSource(original, {
    source: filePathOrUrl,
    line,
    column,
  });
}

/**
 * Generates a clickable error stack trace.
 * @param {Error} error - The error object.
 * @returns {Promise<string>} The clickable error stack trace.
 * @example
 * const error = new Error("Something went wrong");
 * const clickableStack = await getClickableErrorStack(error);
 * // Output:
 * // Error: Something went wrong
 * //     at functionName (/path/to/file.ts:10:5)
 * //     at /path/to/another/file.ts:20:10
 */
export async function getClickableErrorStack(error: Error): Promise<string> {
  if (typeof error.stack !== "string" || error.stack.trim() === "") {
    return `Error: ${error.message}\n(No stack trace available)`;
  }

  const stackLines: string[] = error.stack.split("\n");
  const clickableStack: string[] = await Promise.all(
    stackLines.map(async (line: string) => {
      const match: RegExpMatchArray | null = line.match(
        /at (?:(.+) \()?(.+):(\d+):(\d+)\)?/,
      );
      if (match) {
        const [, functionName, filePath, lineNumber, columnNumber] = match;
        const { source, line, column } = await getOriginalPositionFromSourceMap(
          filePath,
          parseInt(lineNumber),
          parseInt(columnNumber),
        );
        const clickablePath: string = `${source}:${line}:${column}`;
        return functionName
          ? `    at ${functionName} (${clickablePath})`
          : `    at ${clickablePath}`;
      }
      return line; // Return the original line if it doesn't match the expected format
    }),
  );

  return clickableStack.join("\n");
}

/**
 * Handles a failed request.
 * @param {string} _url - The URL of the failed request. Prefixed with underscore to indicate it's intentionally unused.
 * @returns {Promise<void>}
 * @example
 * await handleFailedRequest("http://example.com/api/data");
 * // No output, as this function is currently a placeholder
 */
export async function handleFailedRequest(_url: string): Promise<void> {
  // Placeholder for future implementation
}

export { getOriginalPositionFromSourceMap };
