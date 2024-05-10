import axios from "axios"
import fs from 'node:fs/promises'
import path from 'node:path'
import { load as cheerioload } from 'cheerio'
import { downloadHtmlPage } from './src/downloadImage'

const urls: string[] = [
  // 'https://www.zhihu.com/hot',
  // 'https://leetcode.cn/',
  // 'https://www.runoob.com/',
  // 'https://fanyi.baidu.com/',
  // 'https://www.csdn.net/',
  // 'https://juejin.cn/',
  // 'https://world.taobao.com/?',
  // 'https://www.baidu.com/',
  // 'https://fanyi.sogou.com/text',
  // 'https://nodejs.org/api/documentation.html',
  // 'https://new.qq.com/ch/tech/',
]

downloadHtmlPage(urls)


