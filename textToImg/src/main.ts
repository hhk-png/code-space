// import './style.css'
import { canvasWrapText } from './textToImg'

const data = canvasWrapText(
    "火影忍者，尾兽拥有无穷无尽的查克拉和战斗力，被称为“凶暴的神”，因此在忍界大战中各国为了胜利都会不择手段地去争夺它。然而，能找到尾兽并不代表你就能控制它们，要想控制它们有两种办法。一种是与尾兽彼此理解互相信任，比如鸣人那样；另一种则是凭借绝对力量完全控制尾兽！能做到前者的不少，比如鸣人、奇拉比、二位由木人等等，可拥有后者实力的却只有三人。火影忍者，尾兽拥有无穷无尽的查克拉和战斗力，被称为“凶暴的神”，因此在忍界大战中各国为了胜利都会不择手段地去争夺它。然而，能找到尾兽并不代表你就能控制它们，要想控制它们有两种办法。一种是与尾兽彼此理解互相信任，比如鸣人那样；另一种则是凭借绝对力量完全控制尾兽！能做到前者的不少，比如鸣人、奇拉比、二位由木人等等，可拥有后者实力的却只有三人。")

const img = document.createElement('img')
img.src = data
document.body.appendChild(img)

