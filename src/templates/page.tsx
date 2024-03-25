import React from "react";
import { HeadFC, PageProps, graphql } from "gatsby";

import { Layout } from "../components/Layout";

export type PageTemplateProps = PageProps<Queries.PageTemplateQuery>;

export default function PageTemplate(props: PageTemplateProps) {
  const { data } = props;

  return (
    <Layout>
      <h1>{data.markdownRemark?.frontmatter?.title}</h1>

      <div
        dangerouslySetInnerHTML={{ __html: data.markdownRemark?.html ?? "" }}
      />
    </Layout>
  );
}

export const query = graphql`
  query PageTemplate($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
      }
      html
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export const Head: HeadFC<Queries.PageTemplateQuery> = (props) => {
  const siteTitle = props.data.site?.siteMetadata?.title;
  const mdxTitle = props.data.markdownRemark?.frontmatter?.title;

  return (
    <title>
      {mdxTitle} | {siteTitle}
    </title>
  );
};
