export interface ExternalIndex {
  data: {
    keys: unknown[];
    records: {
      i: number;
    }[];
  };
}

export const validateExternalIndex = (
  response: unknown,
): response is ExternalIndex => {
  return (
    !!response &&
    typeof response === "object" &&
    "data" in response &&
    !!response.data &&
    typeof response.data === "object" &&
    "keys" in response.data &&
    Array.isArray(response.data.keys) &&
    "records" in response.data &&
    Array.isArray(response.data.records) &&
    !!response.data.records[0] &&
    typeof response.data.records[0] === "object" &&
    "i" in response.data.records[0] &&
    typeof response.data.records[0].i === "number"
  );
};

export interface ExternalResults {
  data: {
    date: string;
    id: string;
    title: string;
    url: string;
  }[];
}

export const validateExternalResults = (
  response: unknown,
): response is ExternalResults => {
  return (
    !!response &&
    typeof response === "object" &&
    "data" in response &&
    !!response.data &&
    Array.isArray(response.data) &&
    !!response.data[0] &&
    typeof response.data[0] === "object" &&
    "date" in response.data[0] &&
    typeof response.data[0].date === "string" &&
    "id" in response.data[0] &&
    typeof response.data[0].id === "string" &&
    "title" in response.data[0] &&
    typeof response.data[0].title === "string" &&
    "url" in response.data[0] &&
    typeof response.data[0].url === "string"
  );
};
