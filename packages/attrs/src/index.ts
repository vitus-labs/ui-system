import attrs, { Attrs } from '~/init'
import isAttrsComponent, { IsAttrsComponent } from '~/isAttrsComponent'
import type { ConfigAttrs, AttrsComponentType } from '~/types/config'
import type { TObj, ElementType } from '~/types/utils'
import type { AttrsCb } from '~/types/attrs'
import type { GenericHoc, ComposeParam } from '~/types/hoc'
import type { AttrsComponent } from '~/types/AttrsComponent'

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
}

export { attrs, isAttrsComponent }
export default attrs

export type { IsAttrsComponent }
