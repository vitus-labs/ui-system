const group = 'Overlay (Vitus-Labs)'

export default {
  refName: {
    type: 'text',
    value: 'ref',
    description:
      "Overlay component access **ref** to directly mutate styles when calculation position to prevent re-renders. It's being used for both `trigger`, and `children` element at the same time. Your components must accept refs with the same naming.",
    group,
  },
  triggerRefName: {
    type: 'text',
    description:
      'A key name how a **ref** should be passed to trigger component',
    group,
  },
  contentRefName: {
    type: 'text',
    description:
      'A key name how a **ref** should be passed to content component',
    group,
  },
  isOpen: {
    type: 'boolean',
    value: false,
    description: '',
    group,
  },
  openOn: {
    type: 'select',
    options: ['click', 'hover'],
    value: 'click',
    description: '',
    group,
  },
  closeOn: {
    type: 'select',
    options: ['click', 'triggerClick', 'hover', 'manual'],
    value: 'click',
    description: '',
    group,
  },
  type: {
    type: 'select',
    options: ['dropdown', 'tooltip', 'popover', 'modal'],
    value: 'dropdown',
    description: '',
    group,
  },
  align: {
    type: 'select',
    options: ['top', 'left', 'bottom', 'right'],
    value: 'bottom',
    description: '',
    group,
  },
  alignX: {
    type: 'select',
    options: ['left', 'center', 'right'],
    value: 'left',
    description: '',
    group,
  },
  alignY: {
    type: 'select',
    options: ['top', 'center', 'bottom'],
    value: 'bottom',
    description: '',
    group,
  },
  position: {
    type: 'select',
    options: ['fixed', 'absolute', 'relative', 'static'],
    value: 'fixed',
    description: '',
    group,
  },
  offsetX: {
    type: 'number',
    value: 0,
    description: '',
    group,
  },
  offsetY: {
    type: 'number',
    value: 0,
    description: '',
    group,
  },
  throttleDelay: {
    type: 'number',
    value: 200,
    description: '',
    group,
  },
  children: {
    description: 'A content to be rendered when Overlay is open',
  },
} as const
