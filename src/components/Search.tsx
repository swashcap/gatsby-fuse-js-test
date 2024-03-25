import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useGatsbyPluginFusejs } from "react-use-fusejs";

export function Search() {
  const data = useStaticQuery(graphql`
    {
      fusejs {
        index
        data
      }
    }
  `);

  const [query, setQuery] = React.useState("");
  const result = useGatsbyPluginFusejs(query, data.fusejs);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {result.map(({ item }) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
