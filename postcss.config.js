export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 生产环境压缩内联 CSS，减小 UMD 包体积
    ...(process.env.NODE_ENV === 'production'
      ? { cssnano: { preset: ['default', { discardComments: { removeAll: true } }] } }
      : {}),
  },
}
