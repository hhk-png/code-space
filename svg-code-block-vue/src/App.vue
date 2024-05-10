<script setup lang="ts">
import { ref } from 'vue'
import CodeBlock from "./components/code-block.vue";
// 代码
const content = ref<string>(`const show = console.log
//  注释注释
async function fact(n) {
  return n === 0 ? 1 : n * (await fact (n - 1))
}
fact(6).then(show)
const str = "12"

fact(4).then(show)
fact(5).then(show)
fact(2).then(show)
fact(3).then(show)
fact(1).then(show)`)

const copyContent = (content: string) => {
  console.log('copyContent')
  // console.log(content)
}
</script>

<template>
  <div>
    <Suspense>
      <code-block @copy="copyContent" :content="content"></code-block>
    </Suspense>
  </div>
</template>

<style scoped></style>