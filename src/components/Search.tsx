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

import * as styles from "./Search.module.css";
import { SearchResult, useFuseInstance } from "./useSearch";

export type SearchProps = React.ComponentPropsWithoutRef<"form">;

export const Search: React.FunctionComponent<SearchProps> = (props) => {
  const { className, ...rest } = props;

  const [query, setQuery] = React.useState("");
  const { data, error, isLoading } = useFuseInstance();
  const [results, setResults] = React.useState<FuseResult<SearchResult>[]>([]);

  React.useEffect(() => {
    if (!data || !query) {
      return;
    }

    setResults(data.search(query));
  }, [data, query]);

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
      <ComboBox isRequired name="q">
        <Label>Search</Label>

        <div>
          <Input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
          />
          <Button>▼</Button>
        </div>

        <FieldError />

        <Popover className={styles.popover}>
          <ListBox>
            {results.map((result) => {
              const { item } = result;

              return <ListBoxItem key={item.id}>{item.title}</ListBoxItem>;
            })}
          </ListBox>
        </Popover>
      </ComboBox>
    </form>
  );
};
