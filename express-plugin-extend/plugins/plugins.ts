import fs from "fs";
import path from 'path'

export default class Plugins {
  app: any;
  plugins: { [key: string]: any };
  pluginBase: string = path.resolve('./plugins')
  constructor(app: any) {
    // super();
    this.app = app;
    this.plugins = {};
  }
  
  async loadFromConfig(configPath = './plugins.json') {
    configPath = path.resolve(this.pluginBase, configPath)
    console.log(configPath)
    const plugins = JSON.parse(fs.readFileSync(configPath, 'utf8')).plugins;
    for (const plugin of plugins) {
      if (plugin.enabled) {
        this.load(plugin.name);
      }
    }
  }

  async load(name: string) {
    try {
      const filePath = path.dirname(import.meta.url) + `/${name}.ts`
      const plugin = await import(filePath);
      this.plugins[name] = plugin;
      await this.plugins[name].load(this.app);
      console.log(`Loaded plugin: '${name}'`);
    } catch(e) {
      console.log(`Failed to load plugin: '${name}'`);
      this.app.stop();
    }
  }

  unload(name: string) {
    if (this.plugins[name]) {
      this.plugins[name].unload();
      delete this.plugins[name];
      console.log(`Unloaded plugin: '${name}'`)
    }
  }

  stop() {
    for (let plugin in this.plugins) {
      this.unload(plugin);
    }
  }
}
