import * as React from "react";
import { HeadFC, Link, PageProps, graphql } from "gatsby";

import { Layout } from "../components/Layout";

export type IndexPageProps = PageProps<Queries.IndexPageQuery>;

export default function IndexPage(props: IndexPageProps) {
  const { data } = props;

  return (
    <Layout>
      <ul>
        {data.allMarkdownRemark.nodes.map((node) => {
          if (!node.fields || !node.fields.slug) {
            console.warn("Missing information for node:", node);

            return null;
          }

          const { slug } = node.fields;

          return (
            <li key={slug}>
              <Link to={slug}>{node.frontmatter?.title}</Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const query = graphql`
  query IndexPage {
    allMarkdownRemark(limit: 10) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export const Head: HeadFC<Queries.IndexPageQuery> = (props) => {
  const siteTitle = props.data.site?.siteMetadata?.title;

  return <title>{siteTitle}</title>;
};
