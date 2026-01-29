import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f10",       // 最深的背景黑
        sidebar: "#161618",  // 侧边栏背景
        card: "#1c1c1f",     // 卡片背景
        border: "#2c2c2e",   // 边框线
        primary: "#a855f7",  // 霓虹紫
        textMain: "#ececec", // 主文字
        textSub: "#8e8e93",  // 次要文字
      },
    },
  },
  plugins: [],
};
export default config;
