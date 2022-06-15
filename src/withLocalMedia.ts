import { createRemoteFileNode } from "gatsby-source-filesystem";

const createMediaNode = async ({
  url,
  createNode,
  createNodeId,
  cache,
  touchNode,
}) => {
  let fileNodeID;

  const mediaDataCacheKey = `eventbrite-media-${url}`;
  const cacheMediaData = await cache.get(mediaDataCacheKey);

  if (cacheMediaData?.fileNodeID) {
    fileNodeID = cacheMediaData.fileNodeID;
    touchNode({ nodeId: cacheMediaData.fileNodeID });
  }

  if (!fileNodeID) {
    try {
      const fileNode = await createRemoteFileNode({
        url,
        cache,
        createNode,
        createNodeId,
      });

      if (fileNode) {
        fileNodeID = fileNode.id;
        await cache.set(mediaDataCacheKey, { fileNodeID });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return fileNodeID;
};

export const withLocalMedia = async ({
  entity,
  entry,
  createNode,
  createNodeId,
  cache,
  touchNode,
}) => {
  let fileNodeID;

  if (entity === "events") {
    if (entry.logo && entry.logo.original) {
      fileNodeID = await createMediaNode({
        createNode,
        createNodeId,
        cache,
        touchNode,
        url: entry.logo.original.url,
      });
    }
  }

  if (fileNodeID) {
    return {
      ...entry,
      logo: {
        ...entry.logo,
        original: {
          ...entry.logo.original,
          localFile___NODE: fileNodeID,
        },
      },
    };
  }

  return entry;
};
