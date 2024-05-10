import { describe, it, expect } from 'vitest'
import { shikiTokens, getAdaptiveWidthAndHeight, decodeContent } from '../src/components/code-block.ts'


describe('code-block', async () => {

  it('getAdaptiveWidthAndHeight', () => {
    expect(getAdaptiveWidthAndHeight("12", 2, 2)).toEqual([6, 4]);
    expect(() => getAdaptiveWidthAndHeight("12", 1, -3)).toThrowError(/greater/);
    expect(() => getAdaptiveWidthAndHeight("12", -1, 1)).toThrowError(/greater/);
  });

  it('decodeContent', () => {
    expect(decodeContent("1")).toBe("1");
    expect(decodeContent("  ")).toBe("\u00A0".repeat(2));
    expect(decodeContent("")).toBe("\u00A0");
  })

  it("shikiTokens", async () => {
    const content = `const show = console.log

    async function fact(n) {
      return n === 0 ? 1 : n * (await fact (n - 1))
    }
    
    fact(4).then(show)
    fact(5).then(show)
    fact(2).then(show)
    fact(3).then(show)
    fact(1).then(show)`;
    const tokenLines = await shikiTokens(content);
    expect(tokenLines.length).toBe(content.split('\n').length)
    
    const content2 = "";
    const tokenLines2 = await shikiTokens(content2);
    expect(tokenLines2.length).toBe(1);
  });
})
