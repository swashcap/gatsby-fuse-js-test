import * as React from "react";
import { HeadFC, Link, PageProps, graphql } from "gatsby";

import * as styles from "./index.module.css";
import { Layout } from "../components/Layout";
import { formatDate } from "../utils/formatDate";
import { ArticleLink } from "../components/ArticleLink";

export type IndexPageProps = PageProps<Queries.IndexPageQuery>;

export default function IndexPage(props: IndexPageProps) {
  const { data } = props;

  return (
    <Layout>
      <h2>Ten latest articles:</h2>

      <ul className={styles.list} role="list">
        {data.allMarkdownRemark.nodes.map((node) => {
          if (!node.fields || !node.fields.slug) {
            console.warn("Missing information for node:", node);

            return null;
          }

          const { slug } = node.fields;

          return (
            <li key={slug}>
              <ArticleLink
                date={node.frontmatter?.date}
                href={slug}
                title={node.frontmatter?.title}
              />
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const query = graphql`
  query IndexPage {
    allMarkdownRemark(limit: 10, sort: { frontmatter: { date: DESC } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date
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
