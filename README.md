![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# Quantified Trees – Baumblick
> The app **Baumblick** is part of a federally funded project called [**Quantified Trees**](https://qtrees.ai/) (QTrees). It is thus part of the German adoption strategy to climate change with focus on how to help city trees to not suffer and die because of rising temperatures and more and more frequent droughts. The app tells the story of each Berlin city tree by using a vast amount of open data like location and tree specific data. On an interactive map users can see how thirsty city trees of Berlin are. More precisely, it visualizes the trees' ground suction tension. This suction tension represents the amount of energy tree roots need in order to suck out water from the soil. Using open data as well as sensors distributed under the ground, an AI developed by [Birds on Mars](https://www.birdsonmars.com/) is able to generate nowcasts and a 14-days forecasts for each tree – even for those that are not equipped with sensors! The app is oriented towards the public and should inform in a simple and intuitive way.

## Attention: This project is about to be archived (2024-07-11)
This project is about to be archived. To keep it working without backend, database and vector tiles, we have prepared static data that is used instead. Please see https://github.com/technologiestiftung/baumblick-frontend/pull/124 for reference. The snapshot data has the following format and contains all data needed for the frontend to work properly with ~47k trees.  Please not that the forecast values are generated randomly.

```
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    13.502675622307946,
                    52.40368675459003
                ]
            },
            "properties": {
                "trees_id": "00008100:0011dd1c",
                "nowcast_values_30cm": 105.91428,
                "nowcast_values_60cm": 108.66888,
                "nowcast_values_90cm": 41.63244,
                "nowcast_values_stamm": 85.4052,
                "trees_lat": 52.40368675459003,
                "trees_lng": 13.502675622307946,
                "baumscheibe_m2": null,
                "shading_spring": 0.63,
                "shading_summer": 0.5,
                "shading_fall": 0.63,
                "shading_winter": 0.8,
                "rainfall_in_mm": 1.210145
            }
        }
    ]
}
```

## Context

Climate change is causing increasingly hot, dry weather in many places. In recent years, Berlin has also experienced more hot days than ever before. Determining whether trees are in need of water isn't as easy as looking at the ground on the surface level. Many factors such as the tree's age, specie, plate size or ground quality play an important role. Old trees, for instance, tend to have deep roots and thereby be less dependent on additional watering. Overwatering can in fact be more detrimental to a tree than helpful.

This application is completely based on open data, much of which is administrative or weather data. Open data is now an important part of Berlin's administrative activities and not only creates transparency and openness, but also enables analysis and applications like this to make everyday life a little bit more pleasant. You can find more open data at the [Berlin Open Data Portal](https://daten.berlin.de/).

## Tech stack

This website is a NextJS app configured with:

- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, type checking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)

## Getting started

### Requirements

#### Node.js

This project is a Next.js app which requires you to have [Node.js](https://nodejs.org/en/) installed.

#### MapTiler

We use [MapTiler](https://maptiler.com/) for rendering the base map in the background. You will need to put your MapTiler API key into the `NEXT_PUBLIC_MAPTILER_KEY` environment variable. Make also sure to add whatever URL the app is run on to the list of allowed URLs in your MapTiler configuration.

Because we use a customized base map hosted on MapTiler, you also need to provide the `NEXT_PUBLIC_MAPTILER_BASEMAP_URL`.

Both variables can be found in our shared vault.

#### Database

The Postgres database is hosted on AWS. See the documentation for setting it up in this repo [github.com/technologiestiftung/qtrees-ai-data](https://github.com/technologiestiftung/qtrees-ai-data)

We are using a [PostgREST](https://github.com/PostgREST/postgrest) layer in between the database and the frontend. See the documentation for setting it up in this repo [github.com/technologiestiftung/qtrees-ai-data](https://github.com/technologiestiftung/qtrees-ai-data) as well.
#### Trees vector tiles

We fetch the trees vector tileset from our self-hosted tile-server. Add the URL to that tileset to the environment variable `NEXT_PUBLIC_TREE_TILES_URL`. Find the variable in our shared vault as well. You can find the source code for the server here [github.com/technologiestiftung/qtrees-vectortiles-generator/](https://github.com/technologiestiftung/qtrees-vectortiles-generator/)

#### Trees API (using Next API routes)

We use a small "passthrough" API which exposes all the data that is required. The Postgres Database (AWS RDS) has a [PostgREST](https://github.com/PostgREST/postgrest) instance running on an AWS EC2 in front of it. The API is deployed as a Next.js API Routes. It mostly passes the requests through and does some sanity checks. Some API routes currently have a direct connection to the database. This will be replaced with remote procedure calls through PostgREST eventually. See the related files under [pages/api](pages/api/). Make sure to include the necessary environment variables as specified in `.env.example`.

### Installation

Clone the repository to your local machine:

```bash
git clone git@github.com:technologiestiftung/treewatch-frontend.git
```

Move into the repository folder:

```bash
cd treewatch-frontend
```

Make sure you use the Node.js version specified in `.nvmrc`. Find out which Node version you're currently on with:

```bash
node --version
```

If this version differs from the one specified in `.nvmrc`, please install the required version, either manually, or using a tool such as [nvm](https://github.com/nvm-sh/nvm), which allows switching to the correct version via:

```bash
nvm use
```

With the correct Node version, install the dependencies:

```bash
npm install
```

To access the PostgREST API you will need to provide connection details in your environment. In this repository you can find a file `.env.example`. Duplicate this file and name it `.env`.

In `.env` you must enter the connection details for Supabase as suggested in `.env.example`. If you do not know how to obtain the necessary details, please ask a repository maintainer for access.

You are now ready to start a local development server on http://localhost:3000 via:

```bash
npm run dev
```

## Development

### TypeScript

Since this app uses TypeScript and the data ist stored in a PostgreSQL database, we need a way to ensure type-safety for the requested data. We do this by fetching the types from the database schema and converting them to TypeScript types, to be found in `./src/lib/types/database.ts`.

For that to work we have a [PostgREST](https://postgrest.org/en/stable/) server running in front of the database. PostgREST is part of the [Supabase](https://supabase.com/) ecosystem which is why we can use the [supabase/cli](https://github.com/supabase/cli) for generating our types from the PostgREST server.

Whenever we need to update the types because of a database schema change, we can so by running `npm run generate-types`.

Note that there are 3 requirements for running the script:

- the [Supabase CLI](https://supabase.com/docs/guides/cli) installed locally as it does the actual type generation
- Docker (required for the Supabase command)
- Making environment variable `DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DATABASE>"` available for the script

> **Gotcha**: As of February 2023 the type generator does not recognize database views, so you will have to type these yourself by inspecting a view and setting its types accordingly wherever you make the request for it.

## Deployment

**QTrees – Baumblick** is deployed to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Content

The content of Baumblick can be customized. You can edit it in the following locations:

- The images for the slides on the homepage are located under: `/images/home-slider/`.
- The text for the slides and the alternative text for the images are located in `/locales/de/common.json`.
- The index page of the available stories is located under `/pages/stories/index.tsx`. The path parameter should point to a valid file name, for example `/stories/my-file-name`.
- The text for the expert articles "stories" can be edited in the individual files located under `/pages/stories`. The file format is MDX, a superset of Markdown. It can be edited with a markdown editor.

## Page analytics

We use [Matomo](https://matomo.org/) for website analytics. Matomo is respectful of the users' privacy, the page visits are tracked anonymously.

In the production environment, a `NEXT_PUBLIC_MATOMO_URL` and `NEXT_PUBLIC_MATOMO_SITE_ID` is configured for this purpose.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/treewatch-frontend/commits?author=dnsos" title="Code">💻</a> <a href="https://github.com/technologiestiftung/treewatch-frontend/commits?author=dnsos" title="Documentation">📖</a></td>
    <td align="center"><a href="https://vogelino.com/"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/treewatch-frontend/commits?author=vogelino" title="Code">💻</a> <a href="https://github.com/technologiestiftung/treewatch-frontend/commits?author=vogelino" title="Documentation">📖</a></td>
    <td align="center"><a href="https://fabianmoronzirfas.me"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/treewatch-frontend/commits?author=ff6347" title="Code">💻</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## Content Licensing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

## Credits

<a src="https://citylab-berlin.org/en/start/">
  <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
</a>
<br />
<br />
<table>
  <tr style="vertical-align:top">
    <td>
      A project by:
      <br />
      <br />
      <a src="https://www.technologiestiftung-berlin.de/en/">
        <img width="180" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a><br/>
      <a src="https://www.birdsonmars.com/">
        <img width="180" src="https://logos.citylab-berlin.org/logo-birds-on-mars.png" /><br/>
      </a><br/>
      <a src="https://www.berlin.de/ba-mitte/politik-und-verwaltung/aemter/strassen-und-gruenflaechenamt/">
        <img width="180" src="https://qtrees.ai/wp-content/uploads/2021/11/berlin_mitte_logo.png" /><br/>
      </a><br/>
    </td>
    <td>
      Associated partners:
      <br />
      <br />
      <img width="180" src="https://qtrees.ai/wp-content/uploads/2022/06/B_BA_W_NE_Logo_DE_H_PT_4C-2048x342.png" />
      <br/>
      <img width="180" src="https://qtrees.ai/wp-content/uploads/2022/06/logo_arbor_revital_20mm.png" />
    </td>
    <td>
      Sponsors:
      <br/>
      <br />
      <img width="180" src="https://qtrees.ai/wp-content/uploads/2022/04/BMUV_Fz_2021_Office_Farbe_de_c-1536x1122.png" />
      <img width="180" src="https://qtrees.ai/wp-content/uploads/2021/12/zug-logo.png" />
    </td>
  </tr>
</table>
<!-- trigger build -->
