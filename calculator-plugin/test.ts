import { betaCalc } from "./index.ts";

const squaredPlugin = {
  name: "squared",
  exec: (currentValue: number, newValue: number) => {
    return currentValue * currentValue;
  },
};

const calc = new betaCalc();
calc.register(squaredPlugin);

calc.setValue(3);
calc.press("plus", 2);
calc.press("minus", 1);
calc.press("squared", -1);
