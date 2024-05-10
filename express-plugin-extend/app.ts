import { App } from "./server/server.js";

const app = new App();
app.start();
[
  "exit",
  "SIGINT",
  "SIGUSR1",
  "SIGUSR2",
  "SIGTERM",
  "uncaughtException"
].forEach((e) => {
  process.on(e, () => app.stop());
});
