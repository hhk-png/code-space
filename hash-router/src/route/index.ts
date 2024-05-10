// page display
import { resolveRoute } from "./route"

let appDiv = document.getElementById('app')


// router
export function router() {
  let url = window.location.hash.slice(1) || '/'
  console.log(window.location)
  let route = resolveRoute(url)

  let routeElement = route()

  appDiv?.appendChild(routeElement)
}


