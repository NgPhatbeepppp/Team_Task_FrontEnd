// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Thêm dòng này
  darkMode: 'class', // Hoặc 'media' nếu bạn muốn dựa trên cài đặt hệ thống
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}