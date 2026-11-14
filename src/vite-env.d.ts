/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARAGRAPHS_URL?: string;
  readonly VITE_CANONICAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
