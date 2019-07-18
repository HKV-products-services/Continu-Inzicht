const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

const NextI18Next = require('next-i18next/dist/commonjs')

module.exports = new NextI18Next({
  debug: false,
  defaultLanguage: 'nl',
  otherLanguages: ['en','pt'],
  defaultNS: 'mangrove',
  localeStructure: '{{lng}}/{{ns}}',
  localePath: './src/static/locales',
  serverLanguageDetection: false,
  browserLanguageDetection: false,
  localeSubpaths: 'none'
})