import { Provider } from '@vitus-labs/unistyle'
import type { Props as ElementProps } from '~/Element'
import Element, { withEqualSizeBeforeAfter } from '~/Element'
import type {
  ElementType,
  ExtendedProps,
  Props as IteratorProps,
  ObjectValue,
  PropsCallback,
} from '~/helpers/Iterator'
import type { Props as ListProps } from '~/List'
import List, { withActiveState } from '~/List'
import type { Props as OverlayProps, UseOverlayProps } from '~/Overlay'
import Overlay, { OverlayProvider, useOverlay } from '~/Overlay'
import type { Props as PortalProps } from '~/Portal'
import Portal from '~/Portal'
import type { Props as TextProps } from '~/Text'
import Text from '~/Text'
import type {
  AlignX,
  AlignY,
  Content,
  ContentBoolean,
  Direction,
  ExtendCss,
  InnerRef,
  Responsive,
  ResponsiveBoolType,
  VLStatic,
} from '~/types'
import type { Props as UtilProps } from '~/Util'
import Util from '~/Util'

export type {
  ElementProps,
  ListProps,
  OverlayProps,
  UseOverlayProps,
  PortalProps,
  TextProps,
  UtilProps,
  IteratorProps,
  // hidden element types
  AlignX,
  AlignY,
  Content,
  Direction,
  ResponsiveBoolType,
  ContentBoolean,
  Responsive,
  ExtendCss,
  InnerRef,
  VLStatic,
  // hidden iterator types
  PropsCallback,
  ObjectValue,
  ExtendedProps,
  ElementType,
}

export {
  Element,
  withEqualSizeBeforeAfter,
  withActiveState,
  List,
  Overlay,
  useOverlay,
  OverlayProvider,
  Portal,
  Text,
  Util,
  Provider,
}
