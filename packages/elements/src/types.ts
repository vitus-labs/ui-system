type isEmpty = null | undefined
type contentAlignX = 'left' | 'center' | 'right' | isEmpty
type contentAlignY = 'top' | 'center' | 'bottom' | isEmpty
type contentDirection = 'inline' | 'vertical' | isEmpty

export type Ref = HTMLElement

export type alignY =
  | contentAlignY
  | contentAlignY[]
  | Record<string, contentAlignY>

export type alignX =
  | contentAlignX
  | contentAlignX[]
  | Record<string, contentAlignX>

export type direction =
  | contentDirection
  | contentDirection[]
  | Record<string, contentDirection>

export type boltype = boolean | Array<boolean> | Record<string, boolean>
