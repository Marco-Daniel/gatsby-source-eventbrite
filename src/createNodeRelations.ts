//Form one - one parent/child relation between event and venue
export const linkEventWithVenue = (nodes, entity) => {
  const joinVenueToEvent = (eventVenueId, nodes) =>
    nodes.venues.filter((venue) => venue.id === eventVenueId)[0];

  nodes[entity].forEach((node) => {
    node["venue"] = joinVenueToEvent(node.venue_id, nodes);
  });
};
