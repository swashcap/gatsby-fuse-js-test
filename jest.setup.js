/**
 * `AbortSignal.timeout` isn't supported in Jest's older version of jsdom.
 *
 * {@see https://github.com/jestjs/jest/pull/14846#issuecomment-1885785901}
 * {@see https://github.com/whatwg/dom/issues/951#issuecomment-922833719}
 */
AbortSignal.timeout = (ms) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new DOMException("TimeoutError"), ms));
  return controller.signal;
};
