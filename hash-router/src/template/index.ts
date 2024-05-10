// register template

import { home, about } from './template'

const templates: Record<string, Function> = {}

// register template func
function template(name: string, templateFunction: Function) {
  return templates[name] = templateFunction
}

template('home', home)
template('about', about)

export default templates

