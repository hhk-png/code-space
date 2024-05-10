import { AnyNode, Cheerio, CheerioAPI, load as cheerioload } from "cheerio";
import fs from 'fs/promises'
import path from "path";

// https://stackoverflow.com/questions/46699684/dom-traversal-with-cheerio-how-to-get-all-the-elements-with-their-correspondin

const getMaxLength = (strs: string[]) => {
  return strs.reduce((acc, val) => {
    return Math.max(acc, val.length)
  }, -1)
}

async function analyseTag(pathName: string) {
  let $: CheerioAPI

  const foundElements: Record<string, number> = {}

  const traverse_tree = (root: Cheerio<AnyNode>) => {
    if (root.children().length) {
      traverse_tree(root.children().first());
    }
    root.nextAll().each(function (i, elem) {
      if ($(elem).children().length) {
        traverse_tree($(elem).children().first())
      }
      else {
        if (!foundElements[$(elem)[0].name]) {
          foundElements[$(elem)[0].name] = 1;
        }
        else {
          foundElements[$(elem)[0].name]++
        }
      }
    })
  }
  const fileNames = await fs.readdir(pathName)

  for(const name of fileNames) {
    if (!name.endsWith('.html')) {
      throw new Error("The type of file should be 'html'")
    }
    const htmlPage = await fs.readFile(path.resolve(__dirname, '../htmlPages/', name), { encoding: 'utf-8' })
    $ = cheerioload(htmlPage)
    traverse_tree($('body'))
  }

  await fs.writeFile(path.resolve(__dirname, '../resource/', 'htmlTagData.json'), JSON.stringify(foundElements))
  // console.log(foundElements)
  const tags = [...Object.keys(foundElements)]
  tags.sort((a, b) => foundElements[b] - foundElements[a])
  const maxLen = getMaxLength(tags)
  // const sum = Object.values(foundElements).reduce((acc, val) => acc + val, 0)
  tags.forEach((val) => {
    console.log(`${val}${' '.repeat(maxLen - val.length)} => ${foundElements[val]}`)
  })
}

analyseTag(path.resolve(__dirname, '../htmlPages'))
