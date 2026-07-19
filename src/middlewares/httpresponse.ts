export default class HttpResponse {
  static success(data: unknown, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string) {
    return {
      success: false,
      message,
      data: {}
    };
  }
}