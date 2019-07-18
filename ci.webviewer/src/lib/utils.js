import { saveAs } from 'file-saver'

export function cmToM(value) {
  return value / 100
}

export function dotToComma(value) {
  const vSplit = value.toString().split('.', 2)
  const newVal = `${vSplit[0]},${vSplit[1]}`

  return newVal
}

export function localDateTime(locale, datetime) {
  const now = new Date()
  now.setTime(datetime)

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  return now.toLocaleDateString(locale, options)
}

export function convertDateTime(locale, datetime) {
  // const day = datetime.getDate()
  // const hours = datetime.getHours()
  // const minutes = datetime.getMinutes()
  // const seconds = datetime.getSeconds()
  const year = datetime.getFullYear()
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
  const day = ("0" + datetime.getDate()).slice(-2)
  const hours = ("0" + datetime.getHours()).slice(-2)
  const minutes = ("0" + datetime.getMinutes()).slice(-2)
  const seconds = ("0" + datetime.getSeconds()).slice(-2)
  const milliseconds = datetime.getMilliseconds()

  const newDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
  return newDate
}

export function localDate(locale, datetime) {
  const now = new Date()

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return now.toLocaleDateString(locale, options)
}

export function localDateTimeLong(locale, datetime) {
  const now = new Date()

  now.setTime(datetime)

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  return now.toLocaleDateString(locale, options)
}

export function HMSToHM(t, offset) {
  const tSplit = t.split(':', 2)
  const newTime = `${Number(tSplit[0]) + offset}:${tSplit[1]}`

  return newTime
}

export function msToTime(t) {
  var cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    d = Math.floor(t / cd),
    h = Math.floor((t - d * cd) / ch),
    m = Math.round((t - d * cd - h * ch) / 60000),
    pad = function (n) {
      return n < 10 ? '0' + n : n;
    };
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return `${d}d ${pad(h)}h ${pad(m)}m`
}

export function roundFailure(f, nd) {
  if (f != -99999) {
    const a = f * 100
    if (a < 1) {
      return a.toFixed(nd)
    } else {
      return a.toFixed(0)
    }
  } else {
    return f
  }
}

export function roundValue(f, nd) {
  if (f != -99999) {
    return Number.parseFloat(f).toFixed(nd)
  }
}

export function mToKm(m) {
  const km = m / 1000
  return km.toFixed(1)
}

export function fetchGeoJson(url) {
  return fetch(url)
    .then(response => response.json())
}

/**
 * Export a json array to csv
 *
 * @export
 * @param {*} json 
 * @param {*} filename
 */
export function exportJsonToCSV(json, filename) {
  if (json) {
    let CSV = ''
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in json[0]) {
      //Now convert each value to string and comma-seprated
      const upper = index.replace(/^\w/, c => c.toUpperCase());
      row += upper + ',';
    }

    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + '\r\n';

    for (var i = 0; i < json.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in json[i]) {
        if (index === 'datetime') {
          row += '"' + localDateTime(json[i][index]) + '",';
        } else if (index === 'periodlength') {
          row += '"' + msToTime(json[i][index]) + '",';
        } else {
          row += '"' + json[i][index] + '",';
        }
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    var blob = new Blob([CSV], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename);
  }
}

