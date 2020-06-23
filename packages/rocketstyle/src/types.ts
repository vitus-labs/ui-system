export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends React.ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps

export type DisplayName = string

export type DimensionConfiguration = {
  multi?: boolean
}

export type Dimensions = Record<
  string,
  string | [string, DimensionConfiguration | undefined]
>

export type Configuration = {
  name: string
  component: React.ComponentType<any>
}
