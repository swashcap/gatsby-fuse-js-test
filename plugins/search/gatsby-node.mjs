import Fuse from "fuse.js";
import fs from "node:fs/promises";
import incstr from "incstr";
import path from "node:path";

const isProdBuild = process.env.NODE_ENV === "production";

/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
export const createPages = async (args, options) => {
  const { graphql, reporter } = args;
  const { cwd = process.cwd() } = options;

  const buildDate = new Date().toISOString();
  const getId = incstr.idGenerator({ prefix: "fuse-" });
  const staticDirname = path.join(cwd, "public");
  const searchIndexFilename = path.join(staticDirname, "search-index.json");
  const searchResultsFilename = path.join(staticDirname, "search-results.json");

  const response = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  `);

  if (response.errors) {
    reporter.panic(response.errors);
  }
  if (!response.data) {
    reporter.warn("No MDX nodes returned");

    return;
  }

  const store = response.data.allMarkdownRemark.nodes.map((node) => {
    return {
      id: getId(),
      slug: node.fields.slug,
      title: node.frontmatter.title,
    };
  });

  const index = Fuse.createIndex(["id", "title"], store, {});

  await fs.mkdir(staticDirname, { recursive: true });

  await Promise.all([
    fs.writeFile(
      searchResultsFilename,
      JSON.stringify(
        {
          data: store,
          metadata: { buildDate },
        },
        null,
        isProdBuild ? 0 : 2,
      ),
    ),

    fs.writeFile(
      searchIndexFilename,
      JSON.stringify(
        {
          data: index,
          metadata: { buildDate },
        },
        null,
        isProdBuild ? 0 : 2,
      ),
    ),
  ]);

  reporter.log(
    `Wrote file: ${path.relative(process.cwd(), searchResultsFilename)}`,
  );
  reporter.log(
    `Wrote file: ${path.relative(process.cwd(), searchIndexFilename)}`,
  );
};
