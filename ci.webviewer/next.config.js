const path = require('path')
const Dotenv = require('dotenv-webpack')
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  distDir: '../dist',
  assetPrefix: process.env.type === 'app' ? './' : '',
  entry: ['@babel/polyfill', './app/js'],
  publicRuntimeConfig: {
    localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
      ? process.env.LOCALE_SUBPATHS
      : 'none',
  },
  webpack: config => {
    
    config.output.publicPath = `./${config.output.publicPath}`
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()

      if (
        entries['index.js'] &&
        !entries['index.js'].includes('./src/polyfills.js')
      ) {
        entries['index.js'].unshift('./src/polyfills.js')
      }

      return entries
    }
    config.node = {fs: 'empty'}
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    return config
  }
})