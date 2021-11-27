import { omit } from '@vitus-labs/core'
import { CONTEXT_KEYS } from '~/constants'

type BoolFunc = (value: any) => boolean

export const isNumber: BoolFunc = (value) => Number.isFinite(value)
export const hasValue: BoolFunc = (value) => isNumber(value) && value > 0
export const isVisible: BoolFunc = (value) =>
  (isNumber(value) && value !== 0) || value === undefined

type HasWidth = (size: any, columns: any) => boolean
export const hasWidth: HasWidth = (size, columns) =>
  !!(hasValue(size) && hasValue(columns))

type OmitCtxKeys = (props?: Record<string, any>) => ReturnType<typeof omit>
export const omitCtxKeys: OmitCtxKeys = (props) => omit(props, CONTEXT_KEYS)
