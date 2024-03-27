import { act, renderHook } from "@testing-library/react";

import { useFuse } from "./useFuse";
import { useCachedFetch } from "./useCachedFetch";

const mockUseCachedFetch = useCachedFetch as jest.Mock;

jest.mock("gatsby", () => ({
  graphql: jest.fn(),
  useStaticQuery: jest.fn().mockReturnValue({
    site: {
      siteMetadata: {
        externalSearch: {
          indexURL: "http://localhost:8001/index.json",
          resultsURL: "http://localhost:8001/results.json",
        },
      },
    },
  }),
}));

// beforeAll(() => {
//   global.fetch = jest.fn().mockResolvedValue({
//     json: jest.fn().mockResolvedValue({}),
//     ok: true,
//   });
// });

// afterAll(() => {
//   delete (global as any).fetch;
// });

/**
 * @note Mocking `global.fetch` proved too difficult due to async `dispatch` in
 * `useCachedFetch`. Mock the custom hook instead:
 */
jest.mock("./useCachedFetch", () => {
  const responses = {
    "http://localhost:8001/index.json": {
      data: { data: {} },
      error: null,
      isLoading: false,
    },
    "http://localhost:8001/results.json": {
      data: {
        data: [
          {
            title: "",
          },
        ],
      },
      error: null,
      isLoading: false,
    },
    "/search-index.json": {
      data: { data: {} },
      error: null,
      isLoading: false,
    },
    "/search-results.json": {
      data: {
        data: [],
      },
      error: null,
      isLoading: false,
    },
  };

  return {
    useCachedFetch: jest.fn().mockImplementation((input: string) => {
      if (!(input in responses)) {
        throw new Error(`Unknown input: "${input}"`);
      }

      return responses[input as keyof typeof responses];
    }),
  };
});

describe("useFuse", () => {
  test("Should return initial state correctly.", () => {
    mockUseCachedFetch.mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useFuse());

    expect(result.current).toEqual({
      errors: [],
      fuse: null,
      isLoading: true,
    });
  });

  test("Should return errors correctly.", () => {
    const error1 = new Error("Error 1");
    const error2 = new Error("Error 2");

    mockUseCachedFetch
      .mockReturnValueOnce({
        data: null,
        error: error1,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: null,
        error: error2,
        isLoading: false,
      });

    const { result } = renderHook(() => useFuse());

    expect(result.current).toEqual({
      errors: [error1, error2],
      fuse: null,
      isLoading: false,
    });
  });

  test("Should return Fuse.js instance correctly.", () => {
    const { result } = renderHook(() => useFuse());

    expect(result.current).toHaveProperty("errors", []);
    expect(result.current).toHaveProperty("fuse");
    expect(result.current).toHaveProperty("isLoading", false);

    // TOOD: test `fuse` instance
    const { fuse } = result.current;
  });
});
