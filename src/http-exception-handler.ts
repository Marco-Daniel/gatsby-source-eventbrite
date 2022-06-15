import { Reporter } from "gatsby";

export const httpExceptionHandler = (e: any, reporter: Reporter) => {
  const {
    status,
    statusText,
    data: { message },
  } = e.response;

  reporter.error(`The server response was "${status} ${statusText}"`);

  if (message) {
    reporter.error(`Inner exception message : "${message}"`);
  }
};
