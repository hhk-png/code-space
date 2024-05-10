<script setup lang="ts">
import { reactive, defineProps } from "vue";

interface Props {
  containerWidth?: number;
  containerHeight?: number;
  fontsize?: number;
  contentColor?: string;
  contentBgc?: string;
}

const {
  containerWidth: WIDTH,
  containerHeight: HEIGHT,
  fontsize: FONTSIZE,
  contentColor,
  contentBgc
} = withDefaults(defineProps<Props>(), {
  containerWidth: 600,
  containerHeight: 200,
  fontsize: 20,
  contentColor: "rgba(255, 255, 255, 0.956)",
  contentBgc: "rgba(0, 0, 0, 0.759)"
})


// inner
const PADDING = 0
const NUMOFHORIZONTAL = Math.floor((WIDTH - PADDING * 2) / (FONTSIZE * 0.6))
const NUMOFVERTICAL = Math.floor((HEIGHT - PADDING * 2) / (FONTSIZE * 1.5)) - 1

const strs = reactive<string[]>([])

const addChar = (char: string) => {
  const lastStr = strs[strs.length - 1] || "";
  const newStr = lastStr + char;
  if (newStr.length <= NUMOFHORIZONTAL) {
    if (strs.length === 0) {
      strs.push(newStr);
    } else {
      strs[strs.length - 1] = newStr;
    }
  } else {
    if (strs.length > NUMOFVERTICAL) {
      strs.shift()
    }
    strs.push(char)
  }
}

const strStyle = {
  width: WIDTH + "px",
  height: HEIGHT + "px",
  padding: PADDING + "px",
  fontSize: FONTSIZE + "px",
  color: contentColor
};

const spanStyle = {
  backgroundColor: contentBgc
}

defineExpose({ addChar })


</script>

<template>
  <div :style="strStyle" class="str">
    <span v-for="(text, index) in strs" :key="text + index" :style="spanStyle">{{ text }}</span>
  </div>
</template>

<style scoped>
.str {
  box-sizing: border-box;
}

.str span {
  display: inline-block;
}

.bgc-yellow {
  background-color: rgba(0, 0, 0, 0.759);
}
</style>
