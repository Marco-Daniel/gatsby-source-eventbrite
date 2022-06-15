import { SourceNodesArgs } from "gatsby";
import { makeTypeName } from "../helpers/makeTypeName";

export const createNodes = (
  eventbriteData: any,
  gatsbyApi: SourceNodesArgs
) => {
  const { reporter, actions, createNodeId, createContentDigest } = gatsbyApi;
  const { createNode } = actions;

  Object.entries(eventbriteData).forEach(([type, entries]) => {
    if (Array.isArray(entries)) {
      const typeName = makeTypeName(type);

      entries.forEach((entry) => {
        createNode({
          ...entry,
          eventbriteId: entry.id,
          id: createNodeId(`${typeName}-${entry.id}`),
          parent: null,
          children: [],
          internal: {
            type: typeName,
            content: JSON.stringify(entry),
            contentDigest: createContentDigest(entry),
          },
        });
      });
    } else {
      reporter.warn(
        `There are no eventbrite entries for ${type}, is there something wrong?`
      );
    }
  });
};
