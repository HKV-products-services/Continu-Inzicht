import L from 'leaflet'

import './leaflet/leaflet.easy-button'

export function addMapIcons(map, icons, onClick) {

  const buttons = []

  icons.map((icon, index) => {

    const button = L.easyButton(icon.icon, function (buttonArg, mapArg) {
      if (onClick) {
        onClick(buttonArg, mapArg)
      }
    }, icon.tooltip)
    button.id = index;
    buttons.push(button)
  })

  L.easyBar(buttons, {
    position: 'bottomright'
  }).addTo(map)

}