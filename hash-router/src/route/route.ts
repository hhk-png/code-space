// register route

import templates from "../template"

const routes: Record<string, Function> = {}

// register route func
function route(path: string, template: string | Function) {
  if (typeof template === 'function') {
    return routes[path] = template
  } else if (typeof template === 'string') {
    return routes[path] = templates[template]
  } else {
    throw new Error(`there is no route ${path}`)
  }
}

// get router through routeName
export function resolveRoute(routeName: string) {
  try {
    return routes[routeName]
  } catch(e) {
    throw new Error(`Route ${routeName} not found`)
  }
}

route('/', 'home')
route('/about', 'about')