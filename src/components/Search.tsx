import * as React from "react";
import classNames from "classnames";
import {
  Button,
  ComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { FuseResult } from "fuse.js";
import { navigate } from "gatsby";

import * as styles from "./Search.module.css";
import { SearchResult, useFuse } from "../utils/useFuse";

export type SearchProps = React.ComponentPropsWithoutRef<"form">;

export const Search: React.FunctionComponent<SearchProps> = (props) => {
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
    <form
      className={classNames(className)}
      {...rest}
      onSubmit={(event) => {
        event.preventDefault();

        rest.onSubmit?.(event);
      }}
      role="search"
    >
      <ComboBox
        defaultItems={results}
        inputValue={query}
        name="q"
        onInputChange={(newValue) => setQuery(newValue)}
        onSelectionChange={(key) => {
          if (typeof key !== "string") {
            console.warn(`Could not navigate to ${key}`);

            return;
          }

          navigate(key);
        }}
      >
        <Label>Search</Label>

        <div>
          <Input />
          <Button>▼</Button>
        </div>

        <FieldError />

        <Popover className={styles.popover}>
          <ListBox>
            {results.map((result) => {
              const { item } = result;

              return (
                <ListBoxItem id={item.slug} key={item.slug}>
                  {item.title}
                </ListBoxItem>
              );
            })}
          </ListBox>
        </Popover>
      </ComboBox>
    </form>
  );
};
