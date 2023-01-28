import attrs, { Attrs } from '~/init'
import isAttrsComponent, { IsAttrsComponent } from '~/isAttrsComponent'
import type { ConfigAttrs, AttrsComponentType } from '~/types/config'
import type { TObj, ElementType, MergeTypes, ExtractProps } from '~/types/utils'
import type { AttrsCb } from '~/types/attrs'
import type { GenericHoc, ComposeParam } from '~/types/hoc'
import type { DefaultProps } from '~/types/configuration'
import type { AttrsComponent } from '~/types/AttrsComponent'

export type {
  AttrsComponent,
  Attrs,
  AttrsComponentType,
  TObj,
  ElementType,
  MergeTypes,
  ExtractProps,
  ConfigAttrs,
  AttrsCb,
  GenericHoc,
  ComposeParam,
  DefaultProps,
}

export { attrs, isAttrsComponent }
export default attrs

export type { IsAttrsComponent }
