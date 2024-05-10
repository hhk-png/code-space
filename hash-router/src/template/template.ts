
// home and about tempalte
export function home() {
  let div = document.createElement('div')
  let link = document.createElement('a')
  link.href = '#/about'
  link.innerText = 'About'

  div.innerHTML = '<h1>Home</h1>';
  div.appendChild(link);

  return div
}

export function about() {
  let div = document.createElement('div')
  let link = document.createElement('a')
  link.href = '#/'
  link.innerText = 'Home'

  div.innerHTML = '<h1>About</h1>'
  div.appendChild(link)

  return div
};

