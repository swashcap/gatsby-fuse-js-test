import { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "node:path";

const postTemplate = path.resolve(`./src/templates/page.tsx`);

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const result = await graphql<{
    allMdx: {
      nodes: {
        id: string;
        fields: {
          slug: string;
        };
        internal: {
          contentFilePath: string;
        };
      }[];
    };
  }>(`
    query CreatePages {
      allMdx {
        nodes {
          id
          fields {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX result", result.errors);
  }

  // you'll call `createPage` for each result
  result.data?.allMdx.nodes.forEach((node) => {
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and use a helper function
      // like slugify to create a slug
      path: node.fields.slug,
      // Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    });
  });
};

export const onCreateNode: GatsbyNode["onCreateNode"] = (args) => {
  const {
    actions: { createNodeField },
    getNode,
    node,
  } = args;

  if (node.internal.type !== "Mdx") {
    return;
  }

  const filePath = createFilePath({
    getNode,
    node,
  });

  createNodeField({
    name: "slug",
    node,
    value: filePath,
  });
};
