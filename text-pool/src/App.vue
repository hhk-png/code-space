<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import TextPool from './components/TextPool.vue'

// add char randomly
const chars = "abcdefghijklmnopqrstuvwxyz";
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const generateStr = () => {
  const str = Array.from({ length: randomInt(0, 15) }, () => chars[randomInt(0, chars.length)]).join("")
  return str
}

const textPool = ref<typeof TextPool>()

const addChar = (str: string) => {
  textPool.value!.addChar(str);
}
let addCharInterval: number
onMounted(() => {
  addCharInterval = setInterval(() => {
    addChar(generateStr());
  }, 500);
})
onUnmounted(() => {
  clearInterval(addCharInterval)
})

</script>

<template>
  <TextPool ref="textPool"></TextPool>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
