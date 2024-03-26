import * as React from "react";

const cache = new Map<string, unknown>();

/**
 * `AbortSignal.any()` has limited browser support.
 * {@see https://github.com/whatwg/fetch/issues/905#issuecomment-491970649}
 */
function anySignal(signals: AbortSignal[]) {
  const controller = new AbortController();

  function onAbort() {
    controller.abort();

    // Cleanup
    for (const signal of signals) {
      signal.removeEventListener("abort", onAbort);
    }
  }

  for (const signal of signals) {
    if (signal.aborted) {
      onAbort();
      break;
    }
    signal.addEventListener("abort", onAbort);
  }

  return controller.signal;
}

export const useCachedFetch = <T = unknown>(
  input: string,
  init?: Parameters<typeof fetch>[1] & { timeout?: number },
) => {
  const [state, dispatch] = React.useReducer<
    React.Reducer<
      | {
          data: null;
          error: null;
          isLoading: true;
        }
      | {
          data: T;
          error: null;
          isLoading: false;
        }
      | {
          data: null;
          error: Error;
          isLoading: false;
        },
      | {
          payload: T;
          type: "data";
        }
      | {
          payload: Error;
          type: "error";
        }
    >
  >(
    (state, action) => {
      if (action.type === "data") {
        return {
          data: action.payload,
          error: null,
          isLoading: false,
        };
      }
      if (action.type === "error") {
        return {
          data: null,
          error: action.payload,
          isLoading: false,
        };
      }

      return state;
    },
    {
      data: null,
      error: null,
      isLoading: true,
    },
  );

  React.useEffect(() => {
    if (cache.has(input)) {
      dispatch({
        payload: cache.get(input) as T,
        type: "data",
      });

      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    fetch(input, {
      ...init,

      signal: anySignal(
        [
          init?.signal,
          signal,
          typeof init?.timeout === "number"
            ? AbortSignal.timeout(init.timeout)
            : undefined,
        ].filter((x): x is AbortSignal => {
          return !!x;
        }),
      ),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Unable to fetch "${input}": ${response.status} ${response.statusText}`,
          );
        }

        return response.json();
      })
      .then((data) => {
        dispatch({
          payload: data as T,
          type: "data",
        });
      })
      .catch((error) => {
        console.error(error);

        dispatch({
          payload: error,
          type: "error",
        });
      });

    return () => {
      abortController.abort("useCachedFetch unmounted");
    };
  }, [input, init]);

  return state;
};
