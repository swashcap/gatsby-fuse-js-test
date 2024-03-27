import * as React from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import { FuseResult } from "fuse.js";
import { Link } from "gatsby";
import { VisuallyHidden } from "react-aria";

import * as styles from "./Search.module.css";
import { SearchResult, useFuse } from "../utils/useFuse";

export interface SearchProps {}

export const Search: React.FunctionComponent<SearchProps> = () => {
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
    <DialogTrigger>
      <Button className={styles.trigger}>
        <span aria-hidden="true">🔍</span>
        Search
      </Button>

      <Modal className={styles.modal}>
        <Dialog className={styles.dialog}>
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

              <ul
                aria-label="Search results"
                className={styles.results}
                role="list"
              >
                {results.map((result) => {
                  const { slug, title } = result.item;

                  return (
                    <li key={slug}>
                      {slug.startsWith("/") ? (
                        <Link to={slug}>{title}</Link>
                      ) : (
                        <a href={slug}>{title}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
