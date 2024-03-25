import * as React from "react";
import { HeadFC, Link, PageProps, graphql } from "gatsby";

import { Layout } from "../components/Layout";

export type IndexPageProps = PageProps<Queries.IndexPageQuery>;

const IndexPage: React.FunctionComponent<IndexPageProps> = (props) => {
  const { data } = props;

  return (
    <Layout>
      <ul>
        {data.allMdx.nodes.map((node) => {
          return (
            <li>
              <Link to={node.frontmatter?.slug ?? "/"}>
                {node.frontmatter?.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    allMdx {
      nodes {
        frontmatter {
          slug
          title
        }
      }
    }
  }
`;

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
