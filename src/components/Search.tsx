import * as React from "react";
import { Button, DialogTrigger, Modal } from "react-aria-components";

import * as styles from "./Search.module.css";
import { SearchDialog } from "./SearchDialog";

export interface SearchProps {}

export const Search: React.FunctionComponent<SearchProps> = () => {
  return (
    <DialogTrigger>
      <Button className={styles.trigger}>
        <span aria-hidden="true">🔍</span>
        Search
      </Button>

      <Modal className={styles.modal}>
        <SearchDialog />
      </Modal>
    </DialogTrigger>
  );
};
