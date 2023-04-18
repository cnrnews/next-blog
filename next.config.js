/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置图片白名单
  images: {
    domains: ['imgconvert.csdnimg.cn'],
  },
};
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
