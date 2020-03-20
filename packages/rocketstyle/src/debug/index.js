export default ({ __DEBUG__, attributes, keys, theme }) => {
  if (__DEBUG__ === 'basic' || __DEBUG__ === 'verbose') {
    debugGeneralInfo('General info', {
      'Component name': CONFIG.name,
      State: attributes.state,
      Size: attributes.size,
      Variant: attributes.variant,
      Multiples: attributes.multiple.length > 0 ? attributes.multiple : undefined
    })
  }

  if (__DEBUG__ === 'states' || __DEBUG__ === 'verbose') {
    debugProperty('State ❤️🧡💛💚💙💜🖤', keys.state, attributes.state, theme.state)
  }

  if (__DEBUG__ === 'sizes' || __DEBUG__ === 'verbose') {
    debugProperty(
      'Sizes 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟',
      keys.size,
      attributes.size,
      theme.size
    )
  }

  if (__DEBUG__ === 'variants' || __DEBUG__ === 'verbose') {
    debugProperty(
      'Variants 🍺🍻🥂🍷🥃🍸🍹🍾',
      keys.variant,
      attributes.variant,
      theme.variant
    )
  }

  if (__DEBUG__ === 'multiple' || __DEBUG__ === 'verbose') {
    debugProperty(
      'Multiple 🍏🍎🍐🍊🍋🍌🍉🍇🍓',
      keys.multiple,
      attributes.multiple,
      theme.multiple
    )
  }
}
