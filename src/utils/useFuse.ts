import * as React from "react";
import Fuse from "fuse.js";
import { graphql, useStaticQuery } from "gatsby";

import { useCachedFetch } from "./useCachedFetch";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
}

const externalOptions = { timeout: 5000 };

export const useFuse = () => {
  const data = useStaticQuery(graphql`
    query UseFuse {
      site {
        siteMetadata {
          externalSearch {
            indexURL
            resultsURL
          }
        }
      }
    }
  `);

  const [fuse, setFuse] = React.useState<Fuse<SearchResult> | null>(null);

  const indexFetch = useCachedFetch<{
    data: {
      keys: unknown[];
      records: unknown[];
    };
  }>("/search-index.json");
  const resultsFetch = useCachedFetch<{ data: SearchResult[] }>(
    "/search-results.json",
  );
  const externalIndexFetch = useCachedFetch(
    data.site.siteMetadata.externalSearch.indexURL,
    externalOptions,
  );
  const externalResultsFetch = useCachedFetch(
    data.site.siteMetadata.externalSearch.resultsURL,
    externalOptions,
  );

  React.useEffect(() => {
    if (
      indexFetch.isLoading ||
      resultsFetch.isLoading ||
      externalIndexFetch.isLoading ||
      externalResultsFetch.isLoading
    ) {
      return;
    }

    if (
      indexFetch.data &&
      resultsFetch.data &&
      externalIndexFetch.data &&
      externalResultsFetch.data &&
      // Validate external data:
      !!externalIndexFetch.data &&
      typeof externalIndexFetch.data === "object" &&
      "data" in externalIndexFetch.data &&
      !!externalIndexFetch.data.data &&
      typeof externalIndexFetch.data.data === "object" &&
      "records" in externalIndexFetch.data.data &&
      Array.isArray(externalIndexFetch.data.data.records) &&
      !!externalResultsFetch.data &&
      typeof externalResultsFetch.data === "object" &&
      "data" in externalResultsFetch.data &&
      Array.isArray(externalResultsFetch.data.data)
    ) {
      const parsedIndex = Fuse.parseIndex({
        keys: indexFetch.data.data.keys,
        records: [
          ...indexFetch.data.data.records,

          ...externalIndexFetch.data.data.records.map((record) => {
            return {
              ...record,
              i: record.i + indexFetch.data.data.records.length,
            };
          }),
        ],
      });

      console.info("Creating combined Fuse.js instance");

      // todo: try-catch?
      const fuse = new Fuse<SearchResult>(
        [
          ...resultsFetch.data.data,

          ...externalResultsFetch.data.data.map((result) => {
            return {
              id: result.id,
              slug: result.url,
              title: result.title,
            };
          }),
        ],
        { keys: ["title"] },
        parsedIndex,
      );

      setFuse(fuse);

      return;
    }

    if (indexFetch.data && resultsFetch.data) {
      // const parsedIndex = Fuse.parseIndex(indexFetch.data);

      console.info("Creating singular Fuse.js instance");

      const fuse = new Fuse<SearchResult>(
        resultsFetch.data.data,
        { keys: ["title"] },
        // parsedIndex,
      );

      setFuse(fuse);
    }
  }, [indexFetch, resultsFetch, externalIndexFetch, externalResultsFetch]);

  return {
    errors: [
      indexFetch.error,
      resultsFetch.error,
      externalIndexFetch.error,
      externalResultsFetch.error,
    ],
    fuse,
    isLoading:
      indexFetch.isLoading ||
      resultsFetch.isLoading ||
      externalIndexFetch.isLoading ||
      externalResultsFetch.isLoading,
  };
};
