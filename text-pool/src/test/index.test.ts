import { expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import TextPool from "../components/TextPool.vue"

const wrapper = mount(TextPool)

it("should pass", () => {
  expect(1).toBe(1)
});

it("test mount", () => {
  
  expect(wrapper.html()).toContain("div")
})

