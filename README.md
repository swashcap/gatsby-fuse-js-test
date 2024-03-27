# Gatsby Fuse.js Test

This repository tests [Gatsby](https://www.gatsbyjs.com) and [Fuse.js](https://www.fusejs.io) integration. Interesting bits:

- The results and search index must be well-known URLs
  - No content hashes in the filename, which rules out [gatsby-plugin-fuse](https://www.gatsbyjs.com/plugins/gatsby-plugin-fusejs/)
  - Custom plugin created: [`plugins/search/`](plugins/search/)
    - Creates `search-results.json` and `search-index.json` in a Gatsby lifecycle hook
- The solution must operate in a federated fashion
  - Custom plugin created: [`plugins/external-search/`](plugins/external-search/)
    - Creates `external-results.json` and `external-index.json` in a Gatsby lifecycle hook
  - Search `.json` fetched in custom hook: [`src/utils/useFuse.ts`](src/utils/useFuse.ts)
    - Some checks and resiliency baked in
  - Test external slowness with built-in _slow_ server
    1. Term 1: `npm run build && npm run serve`
    1. Term 2: `node bin/bin.js`
    1. Open <http://localhost:9000> and search!
- UI uses [React Aria's Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html)

---

<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby Minimal TypeScript Starter
</h1>

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby -- -ts
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

## 🚀 Quick start (Netlify)

Deploy this starter with one click on [Netlify](https://app.netlify.com/signup):

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-minimal-ts)
