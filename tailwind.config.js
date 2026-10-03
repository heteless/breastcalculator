module.exports = {
  content: [
    './**/index.html', './**/footer.html', './**/header.html', './script.js',
    '!./node_modules/**', '!./dist/**', '!./dist-dryrun/**',
    '!./_dbg/**', '!./scripts/**', '!./test/**', '!./tests/**', '!./.*/**',
  ],
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
