const isDev = import.meta.env.MODE !== "production";

export const log = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

export const warn = (...args: unknown[]) => {
  if (isDev) console.warn(...args);
};

export const error = (...args: unknown[]) => {
  if (isDev) console.error(...args);
};

export default { log, warn, error };
