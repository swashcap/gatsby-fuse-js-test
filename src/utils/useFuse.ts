import * as React from "react";
import Fuse from "fuse.js";
import { graphql, useStaticQuery } from "gatsby";

import { useCachedFetch } from "./useCachedFetch";
import {
  validateExternalIndex,
  validateExternalResults,
} from "./validateExternal";

export interface SearchResult {
  date: string;
  id: string;
  slug: string;
  title: string;
}

const externalOptions = { timeout: 5000 };

/**
 * Fetch results and Fuse.js indices (created by `Fuse.createIndex`) via
 * network requests and return a loaded Fuse.js instance.
 */
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
      validateExternalIndex(externalIndexFetch.data) &&
      validateExternalResults(externalResultsFetch.data)
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
              date: result.date,
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
      const parsedIndex = Fuse.parseIndex(indexFetch.data.data);

      console.info("Creating singular Fuse.js instance");

      const fuse = new Fuse<SearchResult>(
        resultsFetch.data.data,
        { keys: ["title"] },
        parsedIndex,
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
    ].filter((e): e is Error => !!e && e instanceof Error),
    fuse,
    isLoading:
      indexFetch.isLoading ||
      resultsFetch.isLoading ||
      externalIndexFetch.isLoading ||
      externalResultsFetch.isLoading,
  };
};
