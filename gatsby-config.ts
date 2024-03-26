import type { GatsbyConfig } from "gatsby";
import path from "node:path";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Gatsby FuseJS Test`,
    siteUrl: `https://www.yourdomain.tld`,

    /** @note These are generated by the "external-search" plugin below. */
    externalSearch: {
      indexURL: "/external-index.json",
      resultsURL: "/external-results.json",
    },
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "docs",
        path: "./docs/",
      },
    },
    "gatsby-transformer-remark",
    {
      resolve: "search",
      options: {
        cwd: __dirname,
      },
    },
    {
      resolve: "external-search",
      options: {
        indexFilename: path.resolve(__dirname, "public/external-index.json"),
        resultsFilename: path.resolve(
          __dirname,
          "public/external-results.json",
        ),
      },
    },
  ],
};

export default config;
