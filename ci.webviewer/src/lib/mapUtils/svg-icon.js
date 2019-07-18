import L from 'leaflet'

L.DivIcon.SVGIcon = L.DivIcon.extend({
  options: {
    "circleText": "",
    "className": "svg-icon",
    "circleAnchor": null, //defaults to [iconSize.x/2, iconSize.x/2]
    "circleColor": null, //defaults to color
    "circleOpacity": null, // defaults to opacity
    "circleFillColor": "rgb(255,255,255)",
    "circleFillOpacity": null, //default to opacity 
    "circleRatio": 0.5,
    "circleWeight": null, //defaults to weight
    "color": "rgb(0,102,255)",
    "fillColor": null, // defaults to color
    "fillOpacity": 1,
    "fontColor": "rgb(0, 0, 0)",
    "fontOpacity": "1",
    "fontSize": null, // defaults to iconSize.x/4
    "iconAnchor": null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
    "iconSize": L.point(46, 46),
    "iconPath": null,
    "opacity": 1,
    "popupAnchor": null,
    "strokeColor": "#000",
    "strokeOpacity": 0.7,
    "weight": 1
  },
  initialize: function (options) {
    options = L.Util.setOptions(this, options)
    //iconSize needs to be converted to a Point object if it is not passed as one
    options.iconSize = L.point(options.iconSize)

    //in addition to setting option dependant defaults, Point-based options are converted to Point objects
    if (!options.circleAnchor) {
      options.circleAnchor = L.point(Number(options.iconSize.x) / 2, Number(options.iconSize.x) / 2)
    }
    else {
      options.circleAnchor = L.point(options.circleAnchor)
    }
    if (!options.circleColor) {
      options.circleColor = options.color
    }
    if (!options.circleFillOpacity) {
      options.circleFillOpacity = options.opacity
    }
    if (!options.circleOpacity) {
      options.circleOpacity = options.opacity
    }
    if (!options.circleWeight) {
      options.circleWeight = options.weight
    }
    if (!options.fillColor) {
      options.fillColor = options.color
    }
    if (!options.fontSize) {
      options.fontSize = Number(options.iconSize.x / 4)
    }
    if (!options.iconAnchor) {
      options.iconAnchor = L.point(Number(options.iconSize.x) / 2, Number(options.iconSize.y))
    }
    else {
      options.iconAnchor = L.point(options.iconAnchor)
    }
    if (!options.popupAnchor) {
      options.popupAnchor = L.point(0, (-0.75) * (options.iconSize.y))
    }
    else {
      options.popupAnchor = L.point(options.popupAnchor)
    }
    if (!options.html) {
      options.html = this._createSVG()
    }

  },
  _createCircle: function () {
    var cx = Number(this.options.circleAnchor.x)
    var cy = Number(this.options.circleAnchor.y)
    var radius = this.options.iconSize.x / 2 * Number(this.options.circleRatio)
    var fill = this.options.circleFillColor
    var fillOpacity = this.options.circleFillOpacity
    var stroke = this.options.strokeColor
    var strokeOpacity = this.options.circleOpacity
    var strokeWidth = this.options.circleWeight
    var className = this.options.className + "-circle"

    var circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
      '" fill="' + fill + '" fill-opacity="' + fillOpacity +
      '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity + '" stroke-width="' + strokeWidth + '"/>'

    return circle
  },
  _createPathDescription: function () {
    var height = Number(this.options.iconSize.y)
    var width = Number(this.options.iconSize.x)
    var weight = Number(this.options.weight)
    var margin = weight / 2

    var startPoint = "M " + margin + " " + (width / 2) + " "
    var leftLine = "L " + (width / 2) + " " + (height - weight) + " "
    var rightLine = "L " + (width - margin) + " " + (width / 2) + " "
    var arc = "A " + (width / 4) + " " + (width / 4) + " 0 0 0 " + margin + " " + (width / 2) + " Z"

    //   var d = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
    var d = startPoint + leftLine + rightLine + arc

    return d
  },
  _createPath: function () {
    var pathDescription = this._createPathDescription()
    var strokeWidth = this.options.weight
    var stroke = this.options.strokeColor
    var strokeOpacity = this.options.Opacity
    var fill = this.options.fillColor
    var fillOpacity = this.options.fillOpacity
    var className = this.options.className + "-path"

    var path = '<path class="' + className + '" d="' + pathDescription +
      '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
      '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>'

    return path
  },

  _createSVG: function () {
    // const { fillColor, strokeColor, strokeOpacity, iconPath } = this.options
    var path = this._createPath()
    var circle = this._createCircle()
    var text = this._createText()
    var fill = this.options.fillColor
    var stroke = this.options.strokeColor
    var strokeWidth = this.options.strokeWidth
    var opacity = this.options.strokeOpacity
    var className = this.options.className + "-svg"
    let iconPath = null
    switch (this.options.iconPath) {
      case 'centroid':
        // iconPath = "<path d='M4.3,10.4c0,1.9,0.4,4.2,0.8,5.8c0.5,0.4,1.4,1.1,2.1,1.1c0.8,0,1.7-0.8,2.4-1.3c0.8,0.6,1.7,1.3,2.4,1.3c0.8,0,1.7-0.8,2.4-1.3c0.8,0.6,1.7,1.3,2.4,1.3c0.7,0,1.6-0.7,2.1-1.1c0.3-1.6,0.8-3.9,0.8-5.8c0,0-1.1-0.5-2.4-1V5.9c0-0.2-0.2-0.4-0.4-0.4h-1.2v-2c0-0.2-0.2-0.4-0.4-0.4H8.7C8.5,3,8.3,3.2,8.3,3.4v2H7.1c-0.2,0-0.4,0.2-0.4,0.4v2.8C7.8,8.2,8.8,8,10,7.8c2.3-0.3,4.1,0,5.2,0.7c0.1,0.1,0.2,0.2,0.2,0.3c-1.1-0.3-2.2-0.4-3.3-0.4C8.5,8.3,4.3,10.4,4.3,10.4z M10.4,13.6H7.1V12c0-0.2,0.2-0.4,0.4-0.4s0.4,0.2,0.4,0.4v0.8h1.6V12c0-0.2,0.2-0.4,0.4-0.4s0.4,0.2,0.4,0.4V13.6z M13.6,12c0-0.2,0.2-0.4,0.4-0.4s0.4,0.2,0.4,0.4v0.8h1.6V12c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4v1.6h-3.3V12z'/><path d='M21.8,18.1c-1,0-2-0.8-2.4-1.1c-0.4,0.3-1.4,1.1-2.4,1.1c-1,0-2-0.8-2.4-1.1c-0.4,0.3-1.4,1.1-2.4,1.1c-1,0-2-0.8-2.4-1.1c-0.4,0.3-1.4,1.1-2.4,1.1c-1,0-2-0.8-2.4-1.1c-0.4,0.3-1.4,1.1-2.4,1.1c-0.4,0-0.9-0.2-1.2-0.3v1.7c0.4,0.1,0.8,0.2,1.2,0.2c1,0,1.9-0.4,2.4-0.8c0.5,0.3,1.5,0.8,2.4,0.8s1.9-0.4,2.4-0.8c0.5,0.3,1.5,0.8,2.4,0.8s1.9-0.4,2.4-0.8c0.5,0.3,1.5,0.8,2.4,0.8c1,0,1.9-0.4,2.4-0.8c0.5,0.3,1.5,0.8,2.4,0.8c0.4,0,0.8-0.1,1.2-0.2v-1.7C22.6,18,22.2,18.1,21.8,18.1z'/>"
        iconPath = "<circle cx='11' cy='11' r='7' />"
        break
      case 'spuisluis':
        iconPath = "<rect x='6.4' y='11.3' width='11.3' height='3.4'/><rect x='6.4' y='3.4' width='11.3' height='2.6'/><path d='M21.6,10.5l-0.4,2.2c0,0.1-0.1,0.1-0.1,0.1V7.1c0-0.2-0.2-0.4-0.4-0.4H3.4C3.2,6.8,3,6.9,3,7.1v5.6c0,0-0.1,0-0.1-0.1l-0.4-2.2H0.4v7.1C0.8,17.7,1.2,18,1.7,18c0.9,0,1.8-0.7,2.6-1.1c0.5,0.3,0.9,0.6,1.3,0.8v-7.1h12.8v7.1c0.5-0.2,0.9-0.5,1.3-0.8c0.7,0.5,1.7,1.1,2.6,1.1c0.5,0,1-0.2,1.3-0.4v-7.1H21.6z'/><path d='M19.7,17.8c-0.7,0.5-1.6,1-2.6,1c-0.9,0-1.9-0.5-2.6-1c-0.7,0.5-1.6,1-2.6,1c-0.9,0-1.8-0.5-2.6-1c-0.7,0.5-1.6,1-2.6,1c-0.9,0-1.9-0.5-2.6-1c-0.7,0.5-1.6,1-2.6,1c-0.5,0-0.9-0.1-1.3-0.3V20c0.4,0.1,0.9,0.2,1.3,0.2c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7s2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c0.5,0,0.9-0.1,1.3-0.2v-1.6c-0.4,0.2-0.9,0.3-1.3,0.3C21.3,18.8,20.4,18.3,19.7,17.8z'/>"
        break
      case 'sluis':
        iconPath = "<path d='M6.6,16.7c0,1.6,0.3,3.5,0.6,4.7c0.5-0.2,1-0.4,1.1-0.5l0.9-0.6l0.9,0.6c0.3,0.2,1.2,0.6,1.9,0.6c0.8,0,1.7-0.5,1.9-0.6l0.9-0.6l0.9,0.6c0.2,0.1,0.6,0.3,1.1,0.5c0.2-1.1,0.6-3.1,0.6-4.7c0,0-0.7-0.3-1.6-0.7v-2.6c0-0.1-0.1-0.2-0.2-0.2h-1v-1.4c0-0.1-0.1-0.2-0.2-0.2H9.6c-0.1,0-0.2,0.1-0.2,0.2v1.4h-1c-0.1,0-0.2,0.1-0.2,0.2V15c0.7-0.2,1.5-0.4,2.5-0.4c1.7-0.1,2.8,0.4,3.6,0.8c0.1,0.1,0.1,0.1,0.1,0.2c-0.8-0.2-1.6-0.4-2.4-0.4C9.5,15.2,6.6,16.7,6.6,16.7zM11,19.2H8.2V18c0-0.2,0.2-0.4,0.4-0.4C8.8,17.6,9,17.8,9,18v0.4h1.2V18c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4V19.2zM13,18c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4v0.4H15V18c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4v1.2H13V18z'/><rectx='5.8'y='4'width='12.4'height='6'/><path d='M21.8,13.2v-10H23V0H1v3.2h1.2v10H0.6v8.3c0.1,0,0.1,0,0.2,0c0.8,0,1.7-0.5,1.9-0.6l0.9-0.6l0.9,0.6C4.6,20.9,4.8,21,5,21.1V3.2h14v17.9c0.2-0.1,0.4-0.2,0.5-0.3l0.9-0.6l0.9,0.6c0.3,0.2,1.2,0.6,1.9,0.6c0.1,0,0.1,0,0.2,0v-8.3H21.8z'/><path d='M20.8,21.7l-0.4-0.3L20,21.7c0,0-1.2,0.8-2.4,0.8c-1.1,0-2.4-0.8-2.4-0.8l-0.4-0.3l-0.4,0.3c0,0-1.2,0.8-2.4,0.8c-1.1,0-2.4-0.8-2.4-0.8l-0.4-0.3l-0.4,0.3c0,0-1.2,0.8-2.4,0.8c-1.1,0-2.4-0.8-2.4-0.8l-0.4-0.3l-0.4,0.3c0,0-1.2,0.8-2.4,0.8c-0.1,0-0.1,0-0.2,0V24c0.1,0,0.1,0,0.2,0c1.1,0,2.2-0.5,2.8-0.8C4.2,23.5,5.3,24,6.4,24s2.2-0.5,2.8-0.8C9.8,23.5,10.9,24,12,24s2.2-0.5,2.8-0.8c0.6,0.3,1.7,0.8,2.8,0.8s2.2-0.5,2.8-0.8c0.6,0.3,1.7,0.8,2.8,0.8c0.1,0,0.1,0,0.2,0v-1.6c-0.1,0-0.1,0-0.2,0C22.1,22.4,20.8,21.7,20.8,21.7z'/>"
        break
      case 'gemaal':
        iconPath = "<path d='M11.4,4.2l4.5,4.9c0.5,0.6,1.2,0.9,2,0.9h1.5V8.5h-1.5c-0.3,0-0.6-0.1-0.9-0.4l-4.5-4.9c-0.5-0.6-1.2-0.9-2-0.9H5.8v1.5h4.7C10.9,3.9,11.2,4,11.4,4.2z'/><path d='M3.3,7.4c0.6,0.3,1.6,0.8,2.7,0.8c0.4,0,0.8-0.1,1.2-0.2C6.8,7.6,6.6,7.1,6.5,6.5c-0.2,0-0.4,0.1-0.5,0.1c-1.1,0-2.2-0.7-2.2-0.7L3.3,5.6L2.8,5.9c0,0-1.2,0.7-2.2,0.7c-0.2,0-0.4,0-0.6-0.1v1.5c0.2,0,0.4,0,0.6,0C1.7,8.1,2.7,7.7,3.3,7.4z'/><path d='M23.4,12.4c-1.1,0-2.2-0.7-2.2-0.7l-0.4-0.3l-0.4,0.3c0,0-1.2,0.7-2.2,0.7c-0.3,0-0.7-0.1-1-0.2l0.1,0.1c0.4,0.4,0.6,0.9,0.6,1.4c0,0.1,0,0.1,0,0.2c0.1,0,0.3,0,0.4,0c1.1,0,2.1-0.5,2.7-0.8c0.6,0.3,1.6,0.8,2.7,0.8c0.2,0,0.4,0,0.6,0v-1.5C23.8,12.4,23.6,12.4,23.4,12.4z'/><path d='M13,16.2l-4.5-4.9c-0.5-0.5-1.2-0.8-1.9-0.8H0v11.2h24v-5H14C13.6,16.6,13.2,16.5,13,16.2z'/><path d='M9.1,10.4c0.2,0.1,0.5,0,0.8-0.1c0,0.9,0.4,1.6,0.8,1.7c0.2,0.1,0.5,0,0.8-0.1c0,0.9,0.4,1.6,0.8,1.7c0.2,0.1,0.5,0,0.8-0.1c0,0.9,0.4,1.6,0.8,1.7c0.3,0.1,0.8-0.1,1.2-0.5c0.5,0.3,1.1,0.3,1.5-0.1c0.5-0.5,0.5-1.2,0-1.6L15.7,12c-0.2,0.3-0.4,0.6-0.6,0.9c-0.1,0-0.2,0-0.1-0.2c0-0.1,0.2-0.6,0.3-1.2l0,0c0.1-0.7,0.3-1.5,0-1.7c-0.4-0.4-1.2,0.4-1.8,1.5c-0.1,0-0.2,0-0.1-0.2c0-0.2,0.7-2.6,0.3-2.9c-0.4-0.4-1.2,0.4-1.8,1.5c-0.1,0-0.2,0-0.1-0.2c0-0.2,0.7-2.6,0.3-2.9c-0.4-0.4-1.2,0.4-1.8,1.5c-0.1,0-0.2,0-0.1-0.2c0-0.2,0.7-2.6,0.3-2.9c-0.3-0.3-0.8,0-1.2,0.6C8.8,5.4,7.8,5.1,7.4,5.4C7,5.9,7.5,7.1,7.9,7.6L8.3,8C8.2,9.2,8.5,10.2,9.1,10.4z'/>"
        break
      case 'energiecentrale':
        iconPath = "<path d='M22.2,21.2c-1,0-2.1-0.8-2.6-1.2c-0.4,0.3-1.5,1.2-2.6,1.2c-1,0-2.1-0.8-2.6-1.2c-0.4,0.3-1.5,1.2-2.6,1.2c-1,0-2.1-0.8-2.6-1.2C9,20.3,8,21.2,6.9,21.2c-1,0-2.1-0.8-2.6-1.2c-0.4,0.3-1.5,1.2-2.6,1.2c-0.4,0-0.9-0.2-1.3-0.4v1.8c0.4,0.1,0.8,0.2,1.3,0.2c1,0,2-0.5,2.6-0.8c0.6,0.3,1.5,0.8,2.6,0.8c1,0,2-0.5,2.6-0.8c0.6,0.3,1.5,0.8,2.6,0.8c1,0,2-0.5,2.6-0.8c0.6,0.3,1.5,0.8,2.6,0.8c1,0,2-0.5,2.6-0.8c0.6,0.3,1.5,0.8,2.6,0.8c0.4,0,0.9-0.1,1.3-0.2v-1.8C23.1,21,22.7,21.2,22.2,21.2z'/><path d='M8.2,19.8c0.1-0.1,0.2-0.2,0.4-0.2c0.1-0.1,0.2-0.1,0.3-0.2l0.6-0.5l0.6,0.5c0.4,0.3,1.2,0.9,1.9,0.9c0.7,0,1.5-0.6,1.9-0.9l0.6-0.5l0.6,0.5c0.4,0.3,1.2,0.9,1.9,0.9c0.7,0,1.5-0.6,1.9-0.9l0.6-0.5l0.6,0.5c0.4,0.3,1.2,0.9,1.9,0.9c0.1,0,0.2,0,0.4-0.1L21.8,2c0-0.5-1-0.9-2.1-0.9c-1.2,0-2.1,0.4-2.1,0.9l-0.4,8.6c0.9,0.9,2,1.9,2,2c0.1,0.1,0,0.2,0,0.2L12.6,9c-0.3-0.2-0.6,0-0.6,0.4v2.1L7.5,9c-0.3-0.2-0.6,0-0.6,0.4v2.1l0,0L2.4,9C2.1,8.9,1.8,9.1,1.8,9.4v1.2v1v8.7c0,0,0,0,0,0c0.7,0,1.5-0.6,1.9-0.9l0.6-0.5L5,19.3c0.2,0.1,0.4,0.3,0.6,0.4c0.1,0.1,0.5,0.5,1.3,0.5C7.6,20.3,8.1,19.9,8.2,19.8z'/>"
        break
      case 'stuw':
        iconPath = "<path d='M1.1,7.6h1.1v11.2c0.8-0.2,1.4-0.6,2-1.1l0.6,0.4c0,0,2.6-2.7,7.1-2.7c4.5,0,7.1,2.7,7.1,2.7l0.6-0.4c0.7,0.5,1.2,0.8,2,1.1V7.6h1.1c0.2,0,0.4-0.2,0.4-0.4V3.4c0-0.2-0.2-0.4-0.4-0.4H18c-0.2,0-0.4,0.2-0.4,0.4v3.8c0,0.2,0.2,0.4,0.4,0.4h1.1v3.9c1,0.9,1.6,2.3,1.9,3.5c0,0.1,0,0.1-0.1,0.1c-1.3-2.8-4.8-4.9-8.9-4.9c-4.1,0-7.6,2.1-8.9,4.9c0,0-0.1,0-0.1-0.2c0.3-1.2,0.9-2.5,1.9-3.4V7.6H6c0.2,0,0.4-0.2,0.4-0.4V3.4C6.3,3.2,6.2,3,6,3H1.1C0.9,3,0.7,3.2,0.7,3.4v3.8C0.7,7.4,0.9,7.6,1.1,7.6z'/><path d='M22.3,19.6c-1,0-2.2-0.7-2.2-0.7l-0.4-0.3l-0.4,0.3c0,0-1.1,0.7-2.2,0.7c-1,0-2.2-0.7-2.2-0.7l-0.4-0.3l-0.4,0.3c0,0-1.1,0.7-2.2,0.7s-2.2-0.7-2.2-0.7l-0.4-0.3L9,18.9c0,0-1.1,0.7-2.2,0.7c-1,0-2.2-0.7-2.2-0.7l-0.4-0.3l-0.4,0.3c0,0-1.1,0.7-2.2,0.7c-0.5,0-1-0.1-1.3-0.3v1.6c0.4,0.1,0.9,0.2,1.3,0.2c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7s2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c1,0,2-0.4,2.6-0.7c0.5,0.3,1.5,0.7,2.6,0.7c0.5,0,0.9-0.1,1.3-0.2v-1.6C23.2,19.5,22.7,19.6,22.3,19.6z'/>"
        break
      case 'riool':
        iconPath = "<path d='M12,1.7c1.4,0,2.7,0.3,4,0.8c1.2,0.5,2.3,1.3,3.3,2.2c0.9,0.9,1.7,2,2.2,3.3c0.5,1.3,0.8,2.6,0.8,4s-0.3,2.7-0.8,4c-0.5,1.2-1.3,2.3-2.2,3.3c-0.9,0.9-2,1.7-3.3,2.2c-1.3,0.5-2.6,0.8-4,0.8S9.3,22,8,21.5c-1.2-0.5-2.3-1.3-3.3-2.2c-0.9-0.9-1.7-2-2.2-3.3c-0.5-1.3-0.8-2.6-0.8-4S2,9.3,2.5,8C3,6.8,3.8,5.7,4.7,4.7S6.8,3,8,2.5C9.3,2,10.6,1.7,12,1.7 M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0L12,0z'/><path d='M20.2,9.6c-0.4-1-0.8,0.7-2.1,0.7c-1.6,0-1.6-0.7-2.2-0.7c-0.6,0-0.6,0.8-1.9,0.8c-1.3,0-1.6-0.8-2-0.8s-0.7,0.8-2,0.8c-1.3,0-1.3-0.8-1.9-0.8c-0.6,0-0.6,0.7-2.2,0.7c-1.4,0-1.7-1.7-2.1-0.7C2.2,13.6,5.2,20.8,12,20.8S21.8,13.6,20.2,9.6z'/>"
        break
      case 'molen':
        iconPath = "<path d='M13.9,11.3l0-0.3l0-1.1c0,0-0.2-0.7-0.7-1.2l0.9-1l1.3,1.4l6.5-7.1l-1.5-1.3c0.2-0.2,0-0.4,0-0.4h-0.2l-7.4,8.1c-0.3-0.1-0.6-0.2-1-0.2v0c0,0,0,0,0,0c0,0,0,0,0,0v0c-0.7,0-1.1,0.3-1.5,0.6L9.6,8.1l1.4-1.3L3.9,0.3L2.5,1.8c-0.2-0.2-0.4,0-0.4,0V2l7.8,7.1C9.7,9.6,9.6,9.9,9.6,9.9l0,1.1l0,0.6l-0.3,0.3l-1.3-1.4l-6.5,7.1L2.9,19c-0.2,0.2,0,0.4,0,0.4h0.2l6.3-6.9l0,0.2L8.1,22.8H5.5v1h6.2h0h6.2v-1h-2.6L14.3,15l5.9,5.4l1.3-1.5c0.2,0.2,0.4,0,0.4,0v-0.2L13.9,11.3z M12.4,17.3h-0.6h0h-0.6v-2.2h0.6h0h0.6V17.3z M14,13l0-0.3l0-0.6l0.5,0.5L14,13z'/>"
        break
      case 'rwzi':
        iconPath = ""
        break
      case 'onttrekking':
        iconPath = "<path d='M13.6,19.8c-0.4,1.9,1.4,3.5,3.3,3.5s3.7-1.6,3.3-3.5c-0.3-1.8-2-2.8-2.9-5.2c-0.1-0.3-0.3-0.3-0.4-0.3c-0.2,0-0.3,0-0.4,0.3C15.7,16.9,13.9,18,13.6,19.8z M17.1,21.8c0.4-0.2,0.9-1,0.9-1.7c0-0.8-0.4-1.9-0.8-3.2l0,0c0.2,0.5,0.5,0.8,0.8,1.2c0.5,0.8,1,1.4,1.1,2c0.1,0.3,0,0.7-0.3,1C18.4,21.6,17.7,21.9,17.1,21.8C17.1,21.9,17,21.9,17.1,21.8z'/><path d='M2.6,6.4v3.7h3.1C5.9,10.8,6.6,12,9,12c3.2,0,3.4-2.3,3.4-2.3h1.5c0.7,0,1.5,0.8,1.5,1.5v1.9h3v-1.9c0-2.3-2.2-4.5-4.5-4.5h-1.5V6.3c0-1-1.2-1.5-2.3-1.5V3l2.3,0.2c0.6,0.1,1.1-0.4,1.1-1l0,0c0-0.6-0.5-1.1-1.1-1L10,1.4C9.8,1,9.4,0.7,9,0.7S8.2,1,8,1.4L5.6,1.3C5,1.2,4.5,1.7,4.5,2.3l0,0c0,0.6,0.5,1.1,1.1,1l2.3-0.2v1.8c-1.1,0-2.3,0.5-2.3,1.5V9c0,0-0.1,0-0.1-0.1L5,6.4H2.6z'/>"
        break
      case 'inlaat':
        iconPath = "<path d='M7.5,14.6c-0.1-0.3-0.2-0.3-0.4-0.3c-0.1,0-0.3,0-0.4,0.3c-0.9,2.4-2.6,3.4-2.9,5.2c-0.4,1.9,1.4,3.5,3.3,3.5c1.9,0,3.7-1.6,3.3-3.5C10.1,18,8.3,16.9,7.5,14.6z M6.9,21.9c-0.6,0-1.3-0.3-1.7-0.8c-0.3-0.3-0.4-0.7-0.3-1c0.1-0.6,0.6-1.2,1.1-2c0.3-0.4,0.6-0.7,0.8-1.2c0,0,0,0,0,0c-0.4,1.3-0.8,2.4-0.8,3.2c0,0.7,0.5,1.5,0.9,1.7C7,21.9,6.9,21.9,6.9,21.9z'/><path d='M19,6.4l-0.5,2.5C18.5,9,18.4,9,18.4,9V6.4c0-1-1.2-1.5-2.3-1.5V3.1l2.3,0.2c0.6,0.1,1.1-0.4,1.1-1v0c0-0.6-0.5-1.1-1.1-1L16,1.4c-0.2-0.4-0.6-0.7-1-0.7S14.2,1,14,1.4l-2.4-0.2c-0.6-0.1-1.1,0.4-1.1,1v0c0,0.6,0.5,1.1,1.1,1l2.3-0.2v1.8c-1.1,0-2.3,0.5-2.3,1.5v0.4h-1.5c-2.3,0-4.5,2.2-4.5,4.5v1.9h3v-1.9c0-0.7,0.8-1.5,1.5-1.5h1.5c0,0,0.2,2.3,3.4,2.3c2.4,0,3.1-1.2,3.3-1.9h3.1V6.4H19z'/>"
        break
      default:
        iconPath = "<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/><path d='M0 0h24v24H0z' stroke='none' fill='none'/>"
        break;
    }
    var iconSize = this.options.iconSize
    var style = `width: ${iconSize.x}px; height: ${iconSize.y}px;`
    // var style = "width:" + this.options.iconSize.x + "px; height:" + this.options.iconSize.y + "px;"
    
    // var svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="${fill}" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}" class="${className}" style="${style}" viewBox="0 0 24 24">${iconPath}</svg>`
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="${fill}" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}" class="${className}" viewBox="0 0 24 24">${iconPath}</svg>`
    return svg
  },

  _createText: function () {
    var fontSize = this.options.fontSize + "px"
    var lineHeight = Number(this.options.fontSize)

    var x = Number(this.options.iconSize.x) / 2
    var y = x + (lineHeight * 0.35) //35% was found experimentally 
    var circleText = this.options.circleText
    var textColor = this.options.fontColor.replace("rgb(", "rgba(").replace(")", "," + this.options.fontOpacity + ")")

    var text = `<text text-anchor="middle" x="${x}" y="${y}" style="font-size:${fontSize}" fill="${textColor}">${circleText}</text>`
    // var text = '<text text-anchor="middle" x="' + x + '" y="' + y + '" style="font-size: ' + fontSize + '" fill="' + textColor + '">' + circleText + '</text>'

    return text
  }
})

L.divIcon.svgIcon = function (options) {
  return new L.DivIcon.SVGIcon(options)
}

L.Marker.SVGMarker = L.Marker.extend({
  options: {
    //   "iconFactory": L.divIcon.svgIcon,
    "iconOptions": {}
  },
  initialize: function (latlng, options) {
    options = L.Util.setOptions(this, options)
    //   options.icon = options.iconFactory(options.iconOptions)
    this._latlng = latlng
  },
  onAdd: function (map) {
    L.Marker.prototype.onAdd.call(this, map)
  },
  setStyle: function (style) {
    if (this._icon) {
      // var iconBody = this._icon.children[0].children[0]
      var iconBody = this._icon.children[0]

      if (style.color && !style.iconOptions) {
        var fill = style.color.replace("rgb", "rgba").replace(")", "," + this.options.icon.options.fillOpacity + ")")
        iconBody && iconBody.setAttribute("fill", fill)
        this.options.icon.fillColor = fill
      }
      if (style.opacity) {
        this.setOpacity(style.opacity)
      }
      if (style.iconOptions) {
        if (style.color) { style.iconOptions.color = style.color }
        var iconOptions = L.Util.setOptions(this.options.icon, style.iconOptions)
        this.setIcon(L.divIcon.svgIcon(iconOptions))
      }
    }
  }
})

L.marker.svgMarker = function (latlng, options) {
  return new L.Marker.SVGMarker(latlng, options)
}
