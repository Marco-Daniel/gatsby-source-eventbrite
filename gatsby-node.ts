import { GatsbyNode } from "gatsby";
import { fetch } from "./src/fetch";
import { defaultEntities } from "./src/defaultEntities";
import { linkEventWithVenue } from "./src/createNodeRelations";
import { processEntry } from "./src/processEntry";
import { withLocalMedia } from "./src/withLocalMedia";

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  { actions, cache, createNodeId, reporter },
  options
) => {
  const { createNode, touchNode } = actions;
  const { organizationId, accessToken } = options;
  const entities = Array.isArray(options.entities) ? options.entities : [];

  // check if provided plugin options are properly configured
  if (typeof organizationId !== "string") {
    reporter.error("You must provide an organization ID");
    throw Error("No organizationId");
  }

  if (typeof accessToken !== "string") {
    reporter.error("You must provide an access token");
    throw Error("No accessToken");
  }

  // Merge default entities with configured ones
  const entitiesToFetch = [...new Set([...defaultEntities, ...entities])];

  // Fetch all defined entities and create nodes
  const nodes = {};

  const processedEntries = entitiesToFetch.map((entity) => {
    return fetch({ organizationId, accessToken, entity, reporter })
      .then((entries) =>
        entries[entity].map((entry) =>
          processEntry(entry, entity, createNodeId)
        )
      )
      .then((entries) =>
        Promise.all(
          entries.map(async (entry) => {
            const entryWithLocalMedia = await withLocalMedia({
              entity,
              entry,
              createNode,
              createNodeId,
              cache,
              touchNode,
            });
            return entryWithLocalMedia;
          })
        )
      )
      .then((entries) => (nodes[entity] = entries));
  });

  await Promise.all(processedEntries).then(() => {
    Object.keys(nodes).forEach((entity) => {
      if (entity === "events") {
        nodes[entity].forEach(() => {
          linkEventWithVenue(nodes, entity);
        });
      }
      nodes[entity].forEach((entry) => createNode(entry));
    });
  });
};
