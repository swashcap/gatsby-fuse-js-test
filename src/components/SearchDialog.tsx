import * as React from "react";
import classNames from "classnames";
import {
  Button,
  Dialog,
  DialogProps,
  Heading,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { FuseResult } from "fuse.js";
import { VisuallyHidden } from "react-aria";

import * as styles from "./SearchDialog.module.css";
import { ArticleLink } from "./ArticleLink";
import { SearchResult, useFuse } from "../utils/useFuse";

export type SearchDialogProps = DialogProps & React.RefAttributes<HTMLElement>;

export const SearchDialog: React.FunctionComponent<SearchDialogProps> = (
  props,
) => {
  const { className, ...rest } = props;

  const [query, setQuery] = React.useState("");
  const { errors, fuse, isLoading } = useFuse();
  const [results, setResults] = React.useState<FuseResult<SearchResult>[]>([]);

  React.useEffect(() => {
    if (!fuse || !query) {
      return;
    }

    setResults(fuse.search(query));
  }, [fuse, query]);

  return (
    <Dialog className={styles.dialog} {...rest}>
      {({ close }) => (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              close();
            }}
            role="search"
          >
            <VisuallyHidden>
              <Heading slot="title">Search</Heading>
            </VisuallyHidden>

            <TextField
              autoFocus
              className={styles.field}
              onChange={(nextValue) => setQuery(nextValue)}
              value={query}
            >
              <Label className={styles.fieldLabel}>
                <span aria-label="Search">🔍</span>
              </Label>
              <Input className={styles.fieldInput} />
            </TextField>

            <VisuallyHidden isFocusable>
              <Button onPress={close}>Submit</Button>
            </VisuallyHidden>
          </form>

          {isLoading && <div className={styles.loading}>Loading…</div>}

          {!!errors.length && (
            <span className={styles.errors}>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </span>
          )}

          <ul
            aria-label="Search results"
            className={styles.results}
            role="list"
          >
            {results.map((result) => {
              const { date, slug, title } = result.item;

              return (
                <li key={slug}>
                  <ArticleLink date={date} href={slug} title={title} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Dialog>
  );
};
