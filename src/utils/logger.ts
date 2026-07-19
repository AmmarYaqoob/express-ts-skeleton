export class Logger {
  info(message: string) {
    console.log(message);
  }

  error(message: unknown) {
    console.error(message);
  }
}

export default new Logger();