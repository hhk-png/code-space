import EventEmitter from "events";
import express from "express";
import { Express } from "express";
import Plugins from "../plugins/plugins.ts";

export class App extends EventEmitter {
  server: Express;
  stopped: boolean = false;
  plugins: Plugins;

  constructor() {
    super();

    this.plugins = new Plugins(this);

    this.server = express();
    this.server.use(express.json());
  }

  start() {
    this.plugins.loadFromConfig();

    this.server.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.server.listen(8080, () => {
      console.log("Server is running on port 8080");
      this.emit("start");
    });
  }

  stop() {
    if (this.stopped) {
      return;
    }
    this.plugins.stop();
    console.log("Server is stopping");
    this.emit("stop");
    this.stopped = true;
    process.exit();
  }
}
