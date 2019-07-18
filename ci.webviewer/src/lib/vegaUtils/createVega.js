import vegaEmbed from "vega-embed"
import { vega } from "vega-embed"

export function createVega(element, spec, loadCallback, options, key) {
  const sunday = options.t('sunday')
  const monday = options.t('monday')
  const tuesday = options.t('tuesday')
  const wednesday = options.t('wednesday')
  const thursday = options.t('thursday')
  const friday = options.t('friday')
  const saturday = options.t('saturday')

  const shortsunday = options.t('shortsunday')
  const shortmonday = options.t('shortmonday')
  const shorttuesday = options.t('shorttuesday')
  const shortwednesday = options.t('shortwednesday')
  const shortthursday = options.t('shortthursday')
  const shortfriday = options.t('shortfriday')
  const shortsaturday = options.t('shortsaturday')

  const january = options.t('january')
  const february = options.t('february')
  const march = options.t('march')
  const april = options.t('april')
  const may = options.t('may')
  const june = options.t('june')
  const july = options.t('july')
  const august = options.t('august')
  const september = options.t('september')
  const october = options.t('october')
  const november = options.t('november')
  const december = options.t('december')

  const jan = options.t('jan')
  const feb = options.t('feb')
  const mar = options.t('mar')
  const apr = options.t('apr')
  const smay = options.t('smay')
  const jun = options.t('jun')
  const jul = options.t('jul')
  const aug = options.t('aug')
  const sep = options.t('sep')
  const oct = options.t('oct')
  const nov = options.t('nov')
  const dec = options.t('dec')
  
  vega.timeFormatLocale({
    "dateTime": "%a %e %B %Y %T",
    "date": "%d-%m-%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": [sunday, monday, tuesday, wednesday, thursday, friday, saturday],
    "shortDays": [shortsunday, shortmonday, shorttuesday, shortwednesday, shortthursday, shortfriday, shortsaturday],
    "months": [january, february, march, april, may, june, july, august, september, october, november, december],
    "shortMonths": [jan, feb, mar, apr, smay, jun, jul, aug, sep, oct, nov, dec]
  })

  if (!spec) {
    spec = {}
  }

  const vegaEmbedObject = vegaEmbed(element, spec, {
    // patch: {
    //   signals: [{
    //     "name": "init",
    //     "value": "October"
    //   }]
    // },
    theme: "vox",
    defaultStyle: true,
    renderer: "svg",
    actions: {
      export: true,
      source: false,
      compiled: false,
      editor: false
    },
    i18n: {
      CLICK_TO_VIEW_ACTIONS: options.t('clickaction'),
      PNG_ACTION: options.t('pngaction'),
      SVG_ACTION: options.t('svgaction')
    }
  })
    .then(function (result) {      
      result.view.options = options
      result.view.key = key
      loadCallback(result.view, options, key)
    })
    .catch(console.error)

  return vegaEmbedObject
}
