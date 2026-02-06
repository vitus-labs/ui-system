import type { Attrs } from '~/init'
import attrs from '~/init'
import type { IsAttrsComponent } from '~/isAttrsComponent'
import isAttrsComponent from '~/isAttrsComponent'
import type { AttrsComponent } from '~/types/AttrsComponent'
import type { AttrsCb } from '~/types/attrs'
import type { AttrsComponentType, ConfigAttrs } from '~/types/config'
import type { ComposeParam, GenericHoc } from '~/types/hoc'
import type { ElementType, TObj } from '~/types/utils'

export type {
  AttrsComponent,
  Attrs,
  AttrsComponentType,
  TObj,
  ElementType,
  ConfigAttrs,
  AttrsCb,
  GenericHoc,
  ComposeParam,
  IsAttrsComponent,
}

export { attrs, isAttrsComponent }
export default attrs
