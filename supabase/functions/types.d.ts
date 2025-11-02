// @ts-nocheck
// Minimal Deno runtime helpers for editor only. Avoid declaring DOM `Response` twice.
declare global {
  namespace Deno {
    namespace env {
      function get(key: string): string | undefined;
    }
  }
}

export {};