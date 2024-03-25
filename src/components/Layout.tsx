import * as React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import { VisuallyHidden, VisuallyHiddenProps } from "react-aria";
import "normalize.css/normalize.css";

import * as styles from "./Layout.module.css";
import { Search } from "./Search";

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;

  const data = useStaticQuery<Queries.LayoutQuery>(graphql`
    query Layout {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  /** @note Casting is necessary to add `href` */
  const visuallyHiddenProps = {
    children: "Skip to content",
    elementType: "a",
    href: "#content",
    isFocusable: true,
  } as VisuallyHiddenProps;

  return (
    <>
      <VisuallyHidden {...visuallyHiddenProps} />

      <header className={styles.header}>
        <Link rel="home" to="/">
          {data.site?.siteMetadata?.title}
        </Link>

        <Search />
      </header>

      <main className={styles.content} id="content">
        {children}
      </main>
    </>
  );
};
