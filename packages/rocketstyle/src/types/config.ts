import type { ElementType, ExtractProps, TObj } from './utils'
import type { TDKP } from './dimensions'
import type { PseudoState } from './pseudo'
import type { DefaultProps } from './configuration'

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
  ? {
      [J in keyof T['$$rocketstyle']]: keyof T['$$rocketstyle'][J]
    } & { pseudo: PseudoState }
  : T

type ConsumerCtxCBValue<T extends RocketComponentType, DKP> = (
  props: RocketProviderState<T>
) => DKP extends TDKP
  ? Partial<
      {
        [J in keyof DKP]: keyof DKP[J]
      } &
        PseudoState & { pseudo: Partial<PseudoState> }
    >
  : TObj

type ConsumerCtxCb<DKP> = <T extends RocketComponentType>(
  attrs: ConsumerCtxCBValue<T, DKP>
) => ReturnType<ConsumerCtxCBValue<T, DKP>>

export type ConsumerCb<DKP = TDKP> = (
  ctx: ConsumerCtxCb<DKP>
) => ReturnType<ConsumerCtxCb<DKP>>

export type ConfigComponentAttrs<
  C extends ElementType,
  A extends TObj = DefaultProps
> = C extends ElementType ? ExtractProps<C> : A

export type ConfigAttrs<C, DKP> = Partial<{
  name: string
  component: C
  provider: boolean
  consumer: ConsumerCb<DKP>
  DEBUG: boolean
  inversed: boolean
  passProps: Array<string>
  styled: boolean
}>
