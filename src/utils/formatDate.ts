const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

export const formatDate = (date: Date) => {
  return dateTimeFormat.format(date);
};
