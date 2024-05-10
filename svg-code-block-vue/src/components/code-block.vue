<script setup lang="ts">
import { onMounted, ref, withDefaults } from 'vue';
import { getFontWidthAndHeight, shikiTokens, getAdaptiveWidthAndHeight, decodeContent, throttle } from './code-block.ts'
import { IThemedToken } from 'shiki';

// 传递进来的数据
const props = withDefaults(defineProps<{
  content: string
  fontSize?: number
  x?: number
  y?: number
}>(), {
  content: "Please pass content prop",
  fontSize: 20,
  x: 0,
  y: 0,
})
const emits = defineEmits(['copy']);


const fontFamily = ref<string>('"Lucida Console", Courier, monospace');
const [HINTERVAL, VINTERVAL] = getFontWidthAndHeight(props.fontSize, fontFamily.value);
console.log(HINTERVAL, VINTERVAL)
const adaptiveWidth = ref<number>(0);
const adaptiveHeight = ref<number>(0);
const [aWidth, aHeight] = getAdaptiveWidthAndHeight(props.content, HINTERVAL, VINTERVAL);
adaptiveWidth.value = aWidth;
adaptiveHeight.value = aHeight;


const tokenLines = ref<IThemedToken[][]>(await shikiTokens(props.content));

console.log(tokenLines)

// svg dom 对象
const svgElement = ref<SVGElement | null>(null)
onMounted(() => {
  // 在svg 内部时，需要传入 x 和 y
  if (svgElement.value?.parentNode?.nodeName === 'svg' && !props.x && !props.y) {
    console.warn('Please pass the x and y parameters.')
  }
})

// click to copy
const copyContent = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  await navigator.clipboard.writeText(props.content)
  emits('copy', props.content)
}
const copyDelay = ref<number>(1000);
const copyContentThrottle = throttle(copyContent, copyDelay.value);

</script>

<template>
  <svg @click="copyContentThrottle" :width="adaptiveWidth" :height="adaptiveHeight" :font-family="fontFamily"
    style="background-color: #eee;" ref="svgElement" xmlns="http://www.w3.org/2000/svg" :font-size="fontSize" >
    <text :x="0.5 * HINTERVAL" :y="(index + 1) * VINTERVAL + 0.25 * fontSize"
      v-for="(tokenLine, index) in tokenLines" :key="index">
      <tspan :fill="token.color" v-for="(token, index) in tokenLine" :key="index">
        {{ decodeContent(token.content) }}
      </tspan>
    </text>
  </svg>
</template>

<style scoped>
.userSelectNone {
  user-select: text;
  cursor: default;
}


svg text tspan::selection {
  fill: #000;
  background-color: antiquewhite;
}

/* 
  备选字体
    font-family="Comic sans MS"
    Lucida Console
*/
</style>
./types.ts