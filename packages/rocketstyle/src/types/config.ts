import type { ElementType, TObj } from './utils'
import type { TDKP, DimensionBooleanAttrs } from './dimensions'
import type { PseudoState } from './pseudo'

// --------------------------------------------------------
// CONFIG
// --------------------------------------------------------
export type RocketComponentType = ElementType & {
  IS_ROCKETSTYLE: true
  $$rocketstyle: Record<string, unknown>
}

export type RocketProviderState<
  T extends RocketComponentType | TObj | unknown = unknown
> = T extends RocketComponentType
  ? Partial<T['$$rocketstyle']> & { pseudo: PseudoState }
  : T

export type ConsumerCtxCBValue<T extends RocketComponentType, DKP> = (
  attrs: RocketProviderState<T>
) => DKP extends TDKP
  ? Partial<T['$$rocketstyle'] & { pseudo: PseudoState }>
  : TObj

export type ConsumerCtxCb<DKP> = <T extends RocketComponentType>(
  attrs: ConsumerCtxCBValue<T, DKP>
) => ReturnType<ConsumerCtxCBValue<T, DKP>>

export type ConsumerCb<DKP = TDKP> = (
  ctx: ConsumerCtxCb<DKP>
) => ReturnType<ConsumerCtxCb<DKP>>

export type ConfigAttrs<
  C extends ElementType | unknown,
  DKP extends TDKP,
  UB extends boolean
> = Partial<{
  name: string
  component: C
  provider: boolean
  consumer: ConsumerCb<DKP>
  DEBUG: boolean
  inversed: boolean
  passProps: UB extends true ? Array<keyof DimensionBooleanAttrs<DKP>> : never
  styled: boolean
}>
