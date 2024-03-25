import React from "react";
import { PageProps, graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";

import { Layout } from "../components/Layout";

const shortcodes = { Link }; // Provide common components here

export type PageTemplateProps = PageProps<Queries.PageTemplateQuery>;

export default function PageTemplate(props: PageTemplateProps) {
  const { data, children } = props;

  return (
    <Layout>
      <h1>{data?.mdx?.frontmatter?.title}</h1>

      <MDXProvider components={shortcodes}>{children}</MDXProvider>
    </Layout>
  );
}

export const query = graphql`
  query PageTemplate($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;
