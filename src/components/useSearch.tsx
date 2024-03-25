import * as React from "react";
import Fuse from "fuse.js";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
}

// TODO: Implement caching so network requests don't happen on every mount
export const useFuseInstance = ():
  | {
      data: null;
      error: null;
      isLoading: true;
    }
  | {
      data: Fuse<SearchResult>;
      error: null;
      isLoading: false;
    }
  | {
      data: null;
      error: Error;
      isLoading: false;
    } => {
  const [data, setData] = React.useState<Fuse<SearchResult> | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    Promise.all([
      fetch("/search-index.json", { signal }),
      fetch("/search-results.json", { signal }),
    ])
      .then(([indexResponse, resultsResponse]) => {
        if (!indexResponse.ok) {
          throw new Error(
            `Unable to fetch index: ${indexResponse.status} ${indexResponse.statusText}`,
          );
        }
        if (!resultsResponse.ok) {
          throw new Error(
            `Unable to fetch index: ${resultsResponse.status} ${resultsResponse.statusText}`,
          );
        }

        return Promise.all([indexResponse.json(), resultsResponse.json()]);
      })
      .then(([indexData, resultsData]) => {
        /**
         * Create a Fuse.js instance with the index data.
         * {@see https://www.fusejs.io/api/indexing.html}
         */
        const parsedIndex = Fuse.parseIndex(indexData.data);

        const fuse = new Fuse<SearchResult>(
          resultsData.data,
          {
            keys: ["title"],
          },
          parsedIndex,
        );

        setData(fuse);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError(error);
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, []);

  return {
    data,
    error,
    isLoading,
  } as any;
};
