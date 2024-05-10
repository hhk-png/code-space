
import { getHighlighter, setCDN } from 'shiki'
import type { IThemedToken } from 'shiki'

// set shiki config
setCDN('/node_modules/shiki')

// preprocess blank line
const preprocessToken = (arr: IThemedToken[][]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length === 0) {
      arr[i].push({
        content: ' ',
        color: '#000',
      });
    }
  }
  return arr;
};

export const getFontWidthAndHeight = (fontSize: number, fontFamily: string) => {
  if (fontSize <= 0) {
    fontSize = 12;
  }
  const span = document.createElement('span');
  span.style.visibility = "hidden";
  span.style.fontSize = fontSize + 'px';
  span.style.fontFamily = fontFamily;
  span.style.display = "block";
  document.body.appendChild(span);
  if (typeof span.textContent !== "undefined") {
    span.textContent = 'a';
  } else {
    span.innerText = 'a';
  }
  const spanComputedStyle = window.getComputedStyle(span);
  return [parseInt(spanComputedStyle.width), parseInt(spanComputedStyle.height)]
}

export const shikiTokens = async (str: string) => {
  if (str.length === 0) {
    str = "Please pass the x and y parameters.";
  }
  const highlighter = await getHighlighter({
    themes: ['github-light', 'nord'],
    langs: ['javascript', 'python']
  });
  const output = highlighter.codeToThemedTokens(str, 'javascript');

  return preprocessToken(output);
}

// adaptive width and height
export const getAdaptiveWidthAndHeight = (str: string, HINTERVAL: number, VINTERVAL: number) => {
  if (HINTERVAL <= 0 || VINTERVAL <= 0) {
    throw new Error("font width and height should greater than 0.")
  }
  const arr = str.split('\n');
  const len = arr.length;
  const maxHLen = Math.max(...arr.map((item) => item.length));
  return [(maxHLen + 1) * HINTERVAL, (len + 1) * VINTERVAL]
}

// handle space
export const decodeContent = (str: string) => {
  if (str.length === 0) {
    return '\u00A0';
  }
  if (/^\s+$/.test(str)) {
    return '\u00A0'.repeat(str.length);
  }
  return str;
}

export const throttle = (func: Function, delay: number) => {
  let start: boolean = true;
  return (...args: any[]) => {
    if (start) {
      func(...args);
      start = false;
      setTimeout(() => {
        start = true;
      }, delay)
    }
  };
}
