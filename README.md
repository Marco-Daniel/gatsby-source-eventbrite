# gatsby-source-eventbrite

Source plugin for pulling events and related data from eventbrite.

FORKED FROM: [https://github.com/GatsbyCentral/gatsby-source-eventbrite](https://github.com/GatsbyCentral/gatsby-source-eventbrite)

WORK IN PROGRESS: At the moment it just fetches `events` and `venues` from eventbrite.com without further processing or filtering. Other Endpoints are configurable but haven't been tested yet.
Works with Eventbrite's API v3.

## Install

`git clone https://github.com/Marco-Daniel/gatsby-source-eventbrite.git` into `./plugins/`

see [https://www.gatsbyjs.com/docs/creating-a-local-plugin/](https://www.gatsbyjs.com/docs/creating-a-local-plugin/) for more information about using local plugins in gatsby

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-eventbrite`,
    options: {
      organizationId: `The ID of your organization`,
      accessToken: `your_access_token`,
      // OPTIONAL: Defaults are Events and Venues
      entities: ["events", "venues", "..."],
    },
  },
];
```
