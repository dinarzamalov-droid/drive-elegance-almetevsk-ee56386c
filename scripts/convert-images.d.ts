import type { Plugin } from "vite";
export declare const QUALITY: Record<string, Record<string, unknown>>;
export declare function convertAssets(options?: { log?: (msg: string) => void }): Promise<{ converted: number }>;
export declare function autoImageFormats(): Plugin;
