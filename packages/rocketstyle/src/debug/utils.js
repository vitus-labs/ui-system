const logHeading = name => {
  const style1 = [
    'display: block',
    'color: #828282',
    'font-weight: 700',
    'padding: 5px',
    'background-color: #F2F2F2',
  ].join(';')

  console.log(`%c ${name}`, style1)
}

const logPropertyName = (property, value) => {
  console.log(`%c ${property}: %c ${value || ''}`, 'font-weight: 600;', 'color: #828282;')
}

const logListItem = (index, value) => {
  console.log(`%c ${index}:  ${value}`, 'margin-left: 20px; color: #828282;')
}

export const debugGeneralInfo = (name, properties) => {
  logHeading(name)

  Object.keys(properties).forEach(key => {
    const value = properties[key]
    logPropertyName(key, value || '-')
  })
}

export const debugProperty = (name, data, state, theme) => {
  logHeading(name)
  logPropertyName('Current value', state || '-')
  logPropertyName('Available values', !data || data.length <= 0 ? '-' : '')

  if (data.length > 0) {
    const newData = [...data]
    const filtered = newData.filter(value => value !== 'default')
    filtered.sort()
    filtered.forEach((item, i) => {
      logListItem(i, item)
    })
  }

  if (theme) {
    logPropertyName('Theme')
    console.log(theme)
  }
}
