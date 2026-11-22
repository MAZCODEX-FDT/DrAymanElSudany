import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...a) => twMerge(clsx(a));

/** Prefix a site-root path with the deploy base (needed when the site lives in a sub-folder, e.g. GitHub Pages). */
export const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
