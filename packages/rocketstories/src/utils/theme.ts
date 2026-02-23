let theme: Record<string, unknown> = {}

const getTheme = () => theme

export const setTheme = (value: Record<string, unknown>) => {
  theme = value
}

export default getTheme
