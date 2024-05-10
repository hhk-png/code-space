type Exec = (currentValue: number, newValue: number) => number;

interface IPlugin {
  readonly name: string;
  exec: Exec;
}

export class betaCalc {
  currentValue: number = 0;
  core: { [key: string]: Exec } = {
    plus: (currentValue: number, addend: number) => currentValue + addend,
    minus: (currentValue: number, subtrahend: number) =>
      currentValue - subtrahend,
  };

  plugins: { [key: string]: Exec } = {};

  constructor() {}

  setValue(newValue: number) {
    this.currentValue = newValue;
    console.log(this.currentValue);
  }

  press(buttonName: string, newValue: number) {
    const func = this.core[buttonName] || this.plugins[buttonName];
    this.setValue(func(this.currentValue, newValue));
  }

  register(plugin: IPlugin) {
    const { name, exec } = plugin;
    this.plugins[name] = exec;
  }
}



