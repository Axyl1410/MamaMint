/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "translateY(0%)" }, // Đoạn văn bản đầu tiên hiển thị
          "25%": { transform: "translateY(0%)" }, // Đoạn văn bản đầu tiên vẫn hiển thị
          "50%": { transform: "translateY(-100%)" }, // Đoạn văn bản thứ hai xuất hiện
          "75%": { transform: "translateY(-100%)" }, // Đoạn văn bản thứ hai vẫn hiển thị
          "100%": { transform: "translateY(0%)" }, // Quay lại văn bản đầu tiên
        },
      },
      animation: {
        slide: "slide 6s cubic-bezier(0.4, 0, 0.2, 1) infinite", // Lặp vô hạn
      },
    },
  },
  plugins: [],
};
