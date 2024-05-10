<script setup lang="ts">
import {reactive, ref, onMounted} from 'vue'

const verify = ref<HTMLCanvasElement>()
const state = reactive({
  pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  imgCode: ''
})

const { width, height } = defineProps({
  width: {
    type: Number,
    default: 120,
    required: true
  },
  height: {
    type: Number,
    default: 40,
    required: true
  }
})

// expose state to its parents
defineExpose({
  state
})

onMounted(() => {
  state.imgCode = draw(width, height)
})

const handleDraw = () => {
  state.imgCode = draw(width, height)
}

// random number
const randomNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

// random rgb color
const randomColor = (min: number, max: number): string => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

const draw = (width: number, height: number): string => {
  const ctx = verify.value?.getContext('2d')
  ctx!.fillStyle = randomColor(180, 230)
  ctx?.fillRect(0, 0, width, height)
  let imgCode: string = ''
  // 4 verify code
  for (let i = 0; i < 4; i++) {
    const text: string = state.pool[randomNum(0, state.pool.length)]
    imgCode += text
    const fontSize = randomNum(18, 40)
    const rotate = randomNum(-180, 180)
    ctx!.font = fontSize + 'px Simhei'
    ctx!.textBaseline = 'top'
    ctx!.fillStyle = randomColor(80, 150)
    ctx?.save()
    ctx?.translate(30 * i + 15, 15)
    ctx?.rotate((rotate * Math.PI) / 180)
    ctx?.fillText(text, -15 + 5, -15)
    ctx?.restore()
  }
  // 5 lines
  for (let i = 0; i < 5; i++) {
    ctx?.beginPath()
    ctx?.moveTo(randomNum(0, width), randomNum(0, height))
    ctx?.lineTo(randomNum(0, width), randomNum(0, height))
    ctx!.strokeStyle = randomColor(180, 230)
    ctx?.stroke()
  }
  // 40 random points
  for (let i = 0; i < 40; i++) {
    ctx?.beginPath()
    ctx?.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx?.closePath()
    ctx!.fillStyle = randomColor(150, 200)
    ctx?.fill()
  }
  // return code, its length is 4
  return imgCode
}

</script>
<template>
  <div class="verify-img">
    <canvas ref="verify" :width="width" :height="height" @click="handleDraw"></canvas>
  </div>
</template>
<style scoped>

</style>