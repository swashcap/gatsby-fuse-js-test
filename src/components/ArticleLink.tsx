import * as React from "react";
import classNames from "classnames";
import { Link } from "gatsby";

import * as styles from "./ArticleLink.module.css";
import { formatDate } from "../utils/formatDate";

export interface ArticleLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "title"> {
  date?: string | null;
  href: string;
  title?: string | null;
}

export const ArticleLink: React.FunctionComponent<ArticleLinkProps> = (
  props,
) => {
  const { className, date, href, title, ...rest } = props;

  const content = (
    <>
      <span className={styles.title}>{title}</span>

      {date && (
        <time className={styles.date} dateTime={date}>
          {formatDate(new Date(date))}
        </time>
      )}
    </>
  );

  if (href.startsWith("/")) {
    <Link className={classNames(styles.link, className)} to={href} {...rest}>
      {content}
    </Link>;
  }

  return (
    <a className={classNames(styles.link, className)} href={href} {...rest}>
      {content}
    </a>
  );
};
