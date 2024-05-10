const ast = require('./ast.js')
const esprima = require('esprima')
const escodegen = require('escodegen')

const Parser = ast.Parser
const TreeShaker = ast.TreeShaker

const shakeItBaby = new TreeShaker(new Parser('module1'));
const moduleStringOptimized = shakeItBaby.Modules
  .map(m => escodegen.generate(m))
  .join('');


const moduleStringUnshaked = shakeItBaby.Unshaked
  .map(m => escodegen.generate(m))
  .join('');

const impr = Math.floor(
  (
    1 -
    moduleStringOptimized.length /
    moduleStringUnshaked.length
  ) * 100
);
console.log('IMPROVEMENT: ', impr, '% 🎉');
// IMPROVEMENT:  36 % 🎉