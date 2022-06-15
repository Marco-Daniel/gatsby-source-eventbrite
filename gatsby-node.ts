import { GatsbyNode } from "gatsby";
import { fetch } from "./src/fetch";
import { entitiesToFetch } from "./src/entitiesToFetch";
import { createNodes } from "./src/createNodes";
// import { makeTypeName } from "./helpers/makeTypeName";
// import { createRemoteFileNode } from "gatsby-source-filesystem";

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  gatsbyApi,
  pluginOptions
) => {
  const { reporter } = gatsbyApi;
  const { organizationId, accessToken } = pluginOptions;

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
  // use Set to remove duplicates
  const entities = entitiesToFetch(pluginOptions.entities);

  // Fetch all defined entities and create nodes
  const eventbriteData = await fetch({
    organizationId,
    accessToken,
    entities,
    reporter,
  });

  createNodes(eventbriteData, gatsbyApi);
};

// export const onCreateNode: GatsbyNode["onCreateNode"] = async (
//   gatsbyApi,
//   pluginOptions
// ) => {
//   const { node, actions, createNodeId, getCache } = gatsbyApi;
//   const { createNode, createNodeField } = actions;

//   const entities = entitiesToFetch(pluginOptions.entities);

//   if (entities.some((entity) => node.internal.type === makeTypeName(entity))) {
//     const fileNode = await createRemoteFileNode({
//       url: (node.logo as any).url,
//       parentNodeId: node.id,
//       createNode,
//       createNodeId,
//       getCache,
//     });

//     console.log(fileNode);

//     if (fileNode) {
//       createNodeField({ node, name: "localFile", value: fileNode.id });
//     }
//   }
// };

// export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
//   (gatsbyApi, pluginOptions) => {
//     const { createTypes } = gatsbyApi.actions;

//     const entities = entitiesToFetch(pluginOptions.entities);

//     entities.forEach((entity) => {
//       createTypes(`
//       type ${makeTypeName(entity)} implements Node {
//         localFile: File @link(from: "fields.localFile")
//       }
//     `);
//     });
//   };
