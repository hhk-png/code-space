const esprima = require('esprima')
const fs = require('fs')

class Parser {
  constructor(entryModule) {
    this.importedNames = new Set();
    this.importedList = [];
    this.moduleName = entryModule;
    this.followImportSources = this.followImportSources.bind(this);
  }

  parseModule(relPath) {
    const codeBuffer = fs.readFileSync(__dirname + relPath);
    return esprima.parseModule(codeBuffer.toString());
  }

  extractImports(module) {
    const extractedImports = this.traverseSyntaxTree({
      AST: this.parseModule(`/modules/${module}.js`),
      extractType: 'ImportDeclaration',
      recursiveCaller: this.followImportSources,
      extractor: (node) => {
        return node.specifiers.map(val => val.imported.name);
      }
    });

    extractedImports
      .forEach(imp => this.importedNames.add(imp));
    return this.importedNames;
  }

  followImportSources({ source }) {
    const followModule = source.value.replace('./', '');
    followModule.length
      ? (() => {
        this.extractImports(followModule);
        this.importedList.push({
          name: followModule,
          module: this.parseModule(`/modules/${followModule}.js`)
        });
      })()
      : undefined;
  }

  traverseSyntaxTree({
    AST,
    extractType,
    extractor,
    recursiveCaller = noop => noop
  }) {
    const { body } = AST;
    let extractedNodes = [];
    body.forEach(node => {
      if (extractType === node.type) {
        const extractedVals = extractor(node);
        extractedNodes.push(...extractedVals)
        recursiveCaller(node);
      }
    })
    return extractedNodes;
  }

  get Imports() {
    return this.importedNames.size
      ? this.importedNames
      : this.extractImports(this.moduleName);
  }
}

class TreeShaker {
  constructor({ Imports, importedList }) {
    // [{ module: AST }]
    this.unshaked = importedList.map(val => val.module);
    this.modules = TreeShaker.shake(importedList, Imports);
  }

  static shake(modules, importedVals) {
    const processedModules = []
    for (const { module: m } of modules) {
      const { body } = m;
      const shakedModule = { ...m };
      const shakedBody = [];

      body.forEach(node => {
        if (node.type === 'ExportNamedDeclaration') {
          node.declaration.declarations
            .forEach(({ id }) => {
              if (importedVals.has(id.name)) {
                shakedBody.push(node);
              }
            });
        } else {
          shakedBody.push(node);
        }
      })
      shakedModule.body = shakedBody;
      processedModules.push(shakedModule);
    }
    return processedModules
  }

  get Unshaked() {
    return this.unshaked;
  }

  get Modules() {
    return this.modules;
  }
}

module.exports = {
  Parser,
  TreeShaker
}

