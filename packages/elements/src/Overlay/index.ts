import component, { type Props } from './component'
import OverlayProvider from './context'
import useOverlay, { type UseOverlayProps } from './useOverlay'

export type { Props, UseOverlayProps }

export { useOverlay, OverlayProvider }

export default component
