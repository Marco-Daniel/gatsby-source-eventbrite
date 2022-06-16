import axios from "axios";
import { Reporter } from "gatsby";
import { httpExceptionHandler } from "./http-exception-handler";

// High-level function to coordinate fetching data from eventbrite.com

type FetchInput = {
  organizationId: string;
  accessToken: string;
  entities: string[];
  reporter: Reporter;
};

// loop over all entities and return an object of all entries per entity type
export const fetch = async ({
  organizationId,
  accessToken,
  entities,
  reporter,
}: FetchInput) =>
  entities.reduce(async (acc, entity) => {
    reporter.info(`Fetch Eventbrite data for '${entity}' entity`);
    // Fetch events from the user (paginated, 50 per page)
    // TODO Implement other URI's
    let fetchResults: any[] = [];
    let continueFetching = true;
    let page = 1;

    while (continueFetching) {
      try {
        const result = await axios({
          method: `get`,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0",
          },
          url: `https://www.eventbriteapi.com/v3/organizations/${organizationId}/${entity}?token=${accessToken}&page=${page}`,
        });

        fetchResults = [...fetchResults, ...result.data[entity]];

        page += 1;
        continueFetching = Boolean(result.data?.pagination?.has_more_items);
      } catch (e) {
        httpExceptionHandler(e, reporter);
      }
    }

    acc[entity] = [...fetchResults];

    return acc;
  }, {} as any);
