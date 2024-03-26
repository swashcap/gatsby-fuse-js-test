import Fuse from "fuse.js";
import fs from "node:fs/promises";
import path from "node:path";
import { faker } from "@faker-js/faker";
import _ from "lodash";

const isProdBuild = process.env.NODE_ENV === "production";

/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
export const createPages = async (args, options) => {
  const { reporter } = args;
  // TODO: Check that filenames are under `process.cwd()`
  const { indexFilename, resultsFilename } = options;

  const buildDate = new Date().toISOString();

  const documents = Array.from(new Array(100)).map((_i, i) => {
    const title = `External ${faker.lorem.words({ max: 8, min: 2 })}`;

    return {
      id: `external-${i + 1}`,
      title,
      url: `http://localhost:8000/${_.kebabCase(title)}/`,
    };
  });

  const index = Fuse.createIndex(["id", "title"], documents);

  await Promise.all([
    fs.mkdir(path.dirname(indexFilename), { recursive: true }),
    fs.mkdir(path.dirname(resultsFilename), { recursive: true }),
  ]);

  await Promise.all([
    fs.writeFile(
      resultsFilename,
      JSON.stringify(
        {
          data: documents,
          metadata: {
            buildDate,
          },
        },
        undefined,
        isProdBuild ? 0 : 2,
      ),
    ),

    fs.writeFile(
      indexFilename,
      JSON.stringify(
        {
          data: index,
          metadata: {
            buildDate,
          },
        },
        undefined,
        isProdBuild ? 0 : 2,
      ),
    ),
  ]);

  reporter.log(`Wrote file: ${path.relative(process.cwd(), resultsFilename)}`);
  reporter.log(`Wrote file: ${path.relative(process.cwd(), indexFilename)}`);
};
