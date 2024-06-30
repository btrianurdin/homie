import type { H3Event, EventHandlerRequest } from "h3";

const HttpResponse = {
  badRequest: (
    event: H3Event<EventHandlerRequest>,
    message: string = "Bad Request",
  ) => {
    HttpResponse.error(event, message, null, 400);
  },
  serverError: (
    event: H3Event<EventHandlerRequest>,
    message: string = "Internal Server Error",
  ) => {
    HttpResponse.error(event, message, null, 500);
  },
  unauthorized: (
    event: H3Event<EventHandlerRequest>,
    message: string = "Unauthorized",
  ) => {
    HttpResponse.error(event, message, null, 401);
  },
  success: (
    event: H3Event<EventHandlerRequest>,
    message: string = "Success",
    data: unknown,
    statusCode?: number,
  ) => {
    setResponseStatus(event, statusCode || 200);
    return {
      statusCode: statusCode || 200,
      message,
      payload: data,
    };
  },
  error: (
    event: H3Event<EventHandlerRequest>,
    message: string = "Error",
    details: unknown,
    statusCode?: number,
  ) => {
    setResponseStatus(event, statusCode || 500);
    return {
      statusCode: statusCode || 500,
      message,
      details,
    };
  },
};

export default HttpResponse;
