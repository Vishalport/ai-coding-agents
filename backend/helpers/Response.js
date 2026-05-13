class Response {
  constructor(result = {}, responseMessage = "Operation completed successfully", newResponseCode) {
    this.responseMessage = responseMessage;
    this.responseCode = newResponseCode;
    if (newResponseCode === 200) {
      this.result = result || {};
    }
  }

  static success(res, msg)             { return new Response(res, msg, 200); }
  static unauthorized(res, msg)        { return new Response(res, msg, 401); }
  static badRequest(res, msg)          { return new Response(res, msg, 400); }
  static internal(res, msg)            { return new Response(res, msg, 500); }
  static notFound(res, msg)            { return new Response(res, msg, 404); }
  static internalServerError(res, msg) { return new Response(res, msg, 500); }
  static conflict(res, msg)            { return new Response(res, msg, 409); }
  static forbidden(res, msg)           { return new Response(res, msg, 403); }
  static invalid(res, msg)             { return new Response(res, msg, 402); }
  static alreadyExist(res, msg)        { return new Response(res, msg, 409); }
}

module.exports = Response;
