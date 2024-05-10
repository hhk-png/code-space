import axios from "axios"
import fs from 'node:fs/promises'
import path from 'node:path'
import { load as cheerioload } from 'cheerio'

const randomNum = (): number => {
  const date = Date.now()
  return date - Math.floor(date / 100) * 100
}

const nameSet: Set<string> = new Set()
const getURLName = (url: string) => {
  if (url.length === 0) {
    throw new Error('Url should not be undefined.')
  }
  const urlObj = new URL(url)
  const hostSplit = urlObj.hostname.split('.')
  const fileName = hostSplit[hostSplit.length - 2]
  if (nameSet.has(fileName)) {
    return fileName + randomNum()
  }
  nameSet.add(fileName)
  return fileName
}


export async function downloadHtmlPage(urls: string | string[]) {
  if (typeof urls === 'string') {
    urls = [urls]
  }
  for (const url of urls) {
    const htmlPageString = (await axios.get(url)).data
    const fileName = getURLName(url)
    fs.writeFile(path.resolve(__dirname, '../htmlPages/', fileName) + ".html", htmlPageString, { flag: 'a' })  
    console.log(`${url} downloaded.`)
  }
}

// export function () {

// }



export const getImageUrl = async (htmlFilePath: string, imageClassName: string) => {
  const imageUrls: string[] = []
  if (imageClassName[0] !== '.') return imageUrls
  const htmlPage = await fs.readFile(path.resolve(__dirname, htmlFilePath), { encoding: 'utf-8' })
  const $ = cheerioload(htmlPage)
  $(imageClassName).each((index, val) => {
    const src = (val as any).attribs.src
    imageUrls.push(src)
  })
  return imageUrls
}

export const downloadImage = (urls: string[], fileToWrite?: string) => {
  urls.forEach(async (val, index) => {
    const image = await axios.get(val, { responseType: 'arraybuffer' })
    fs.writeFile(path.resolve(__dirname, `./images/image${index + 1}.jpg`), image.data, { flag: 'a' })
  })
}




