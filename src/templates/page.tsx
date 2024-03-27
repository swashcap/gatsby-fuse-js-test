import React from "react";
import { HeadFC, PageProps, graphql } from "gatsby";

import { Layout } from "../components/Layout";
import { formatDate } from "../utils/formatDate";

export type PageTemplateProps = PageProps<Queries.PageTemplateQuery>;

export default function PageTemplate(props: PageTemplateProps) {
  const {
    data: { markdownRemark },
  } = props;

  return (
    <Layout>
      <h1>{markdownRemark?.frontmatter?.title}</h1>

      {markdownRemark?.frontmatter?.date && (
        <time dateTime={markdownRemark.frontmatter.date}>
          {formatDate(new Date(markdownRemark.frontmatter.date))}
        </time>
      )}

      <hr />

      <div dangerouslySetInnerHTML={{ __html: markdownRemark?.html ?? "" }} />
    </Layout>
  );
}

export const query = graphql`
  query PageTemplate($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        date
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
