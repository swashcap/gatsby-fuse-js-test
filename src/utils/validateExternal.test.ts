import {
  validateExternalIndex,
  validateExternalResults,
} from "./validateExternal";

describe("validateExternal", () => {
  test("validateExternalIndex", () => {
    expect(validateExternalIndex({})).toBe(false);
    expect(
      validateExternalIndex({
        data: null,
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {},
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: null,
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
          records: null,
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
          records: [],
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
          records: [{}],
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
          records: [
            {
              i: null,
            },
          ],
        },
      }),
    ).toBe(false);
    expect(
      validateExternalIndex({
        data: {
          keys: [],
          records: [
            {
              i: 0,
            },
          ],
        },
      }),
    ).toBe(true);
  });

  test("validateExternalResults", () => {
    expect(validateExternalResults({})).toBe(false);
    expect(validateExternalResults({ data: null })).toBe(false);
    expect(validateExternalResults({ data: [] })).toBe(false);
    expect(validateExternalResults({ data: [{}] })).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: null,
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: null,
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: "",
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: "",
            title: null,
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: "",
            title: "",
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: "",
            title: "",
            url: null,
          },
        ],
      }),
    ).toBe(false);
    expect(
      validateExternalResults({
        data: [
          {
            date: "",
            id: "",
            title: "",
            url: "",
          },
        ],
      }),
    ).toBe(true);
  });
});
