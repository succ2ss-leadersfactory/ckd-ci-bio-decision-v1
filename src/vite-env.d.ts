/// <reference types="vite/client" />

declare global {
  interface String {
    replaceAll(searchValue: string | RegExp, replaceValue: string): string;
  }
}

export {};
