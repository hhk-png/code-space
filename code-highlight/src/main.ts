import './style.css'

const code = `
function typeOf(value) {
  var s = typeOf value;
  const a = get()
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}
`;

const strReg1 = /"(.*?)"/g;
const strReg2 = /'(.*?)'/g;
const specialReg = /\b(new|var|if|do|function|while|switch|for|foreach|in|continue|break)(?=[^\w])/g;
const specialJsGlobReg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g;
const specialJsReg = /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g;
const specialMethReg = /\b(indexOf|match|replace|toString|length)(?=[^\w])/g;
const specialPhpReg  = /\b(define|echo|print_r|var_dump)(?=[^\w])/g;
const specialCommentReg  = /(\/\*.*\*\/)/g;
const inlineCommentReg = /(\/\/.*)/g;
const htmlTagReg = /(&lt;[^\&]*&gt;)/g;
const sqlReg = /\b(CREATE|ALL|DATABASE|TABLE|GRANT|PRIVILEGES|IDENTIFIED|FLUSH|SELECT|UPDATE|DELETE|INSERT|FROM|WHERE|ORDER|BY|GROUP|LIMIT|INNER|OUTER|AS|ON|COUNT|CASE|TO|IF|WHEN|BETWEEN|AND|OR)(?=[^\w])/g;

const codeProcessed = code
  .replace(strReg1,'<span class="string">"$1"</span>')
  .replace(strReg2,"<span class=\"string\">'$1'</span>")
  .replace(specialReg,'<span class="special">$1</span>')
  .replace(specialJsGlobReg,'<span class="special-js-glob">$1</span>')
  .replace(specialJsReg,'<span class="special-js">$1</span>')
  .replace(specialMethReg,'<span class="special-js-meth">$1</span>')
  .replace(htmlTagReg,'<span class="special-html">$1</span>')
  .replace(sqlReg,'<span class="special-sql">$1</span>')
  .replace(specialPhpReg,'<span class="special-php">$1</span>')
  .replace(specialCommentReg,'<span class="special-comment">$1</span>')
  .replace(inlineCommentReg,'<span class="special-comment">$1</span>');

console.log(codeProcessed)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <pre><code>${codeProcessed}<code></pre>
`

