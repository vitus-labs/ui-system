import type * as React from 'react'

type Base = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export interface HTMLElementAttrs {
  a: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >

  abbr: Base

  address: Base

  area: React.DetailedHTMLProps<
    React.AreaHTMLAttributes<HTMLAreaElement>,
    HTMLAreaElement
  >

  article: Base

  aside: Base

  audio: React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >

  b: Base

  bdi: Base

  bdo: Base

  big: Base

  blockquote: React.DetailedHTMLProps<
    React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  body: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLBodyElement>,
    HTMLBodyElement
  >

  br: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLBRElement>,
    HTMLBRElement
  >

  button: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >

  canvas: React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >

  caption: Base

  cite: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  code: Base

  col: React.DetailedHTMLProps<
    React.ColHTMLAttributes<HTMLTableColElement>,
    HTMLTableColElement
  >

  colgroup: React.DetailedHTMLProps<
    React.ColgroupHTMLAttributes<HTMLTableColElement>,
    HTMLTableColElement
  >

  data: React.DetailedHTMLProps<
    React.DataHTMLAttributes<HTMLDataElement>,
    HTMLDataElement
  >

  datalist: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDataListElement>,
    HTMLDataListElement
  >

  dd: Base

  del: React.DetailedHTMLProps<
    React.DelHTMLAttributes<HTMLModElement>,
    HTMLModElement
  >

  details: Base

  dfn: Base

  dialog: React.DetailedHTMLProps<
    React.DialogHTMLAttributes<HTMLDialogElement>,
    HTMLDialogElement
  >

  div: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >

  dl: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  >

  dt: Base

  em: Base

  embed: React.DetailedHTMLProps<
    React.EmbedHTMLAttributes<HTMLEmbedElement>,
    HTMLEmbedElement
  >

  fieldset: React.DetailedHTMLProps<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  >

  figcaption: Base

  figure: Base

  footer: Base

  form: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >

  h1: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  h2: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  h3: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  h4: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  h5: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  h6: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >

  header: Base

  hr: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHRElement>,
    HTMLHRElement
  >

  html: React.DetailedHTMLProps<
    React.HtmlHTMLAttributes<HTMLHtmlElement>,
    HTMLHtmlElement
  >

  i: Base

  iframe: React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  >

  img: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >

  input: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

  ins: React.DetailedHTMLProps<
    React.InsHTMLAttributes<HTMLModElement>,
    HTMLModElement
  >

  kbd: Base

  label: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >

  legend: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLLegendElement>,
    HTMLLegendElement
  >

  li: React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  >

  main: Base

  map: React.DetailedHTMLProps<
    React.MapHTMLAttributes<HTMLMapElement>,
    HTMLMapElement
  >

  mark: Base

  meter: Base

  nav: Base

  object: React.DetailedHTMLProps<
    React.ObjectHTMLAttributes<HTMLObjectElement>,
    HTMLObjectElement
  >

  ol: React.DetailedHTMLProps<
    React.OlHTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  >

  optgroup: React.DetailedHTMLProps<
    React.OptgroupHTMLAttributes<HTMLOptGroupElement>,
    HTMLOptGroupElement
  >

  option: React.DetailedHTMLProps<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  >

  output: Base

  p: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >

  picture: Base

  pre: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  >

  progress: React.DetailedHTMLProps<
    React.ProgressHTMLAttributes<HTMLProgressElement>,
    HTMLProgressElement
  >

  q: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  rp: Base

  rt: Base

  ruby: Base

  s: Base

  samp: Base

  section: Base

  select: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >

  small: Base

  source: React.DetailedHTMLProps<
    React.SourceHTMLAttributes<HTMLSourceElement>,
    HTMLSourceElement
  >

  span: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >

  strong: Base

  sub: Base

  summary: Base

  sup: Base

  svg: React.SVGProps<SVGSVGElement>

  table: React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >

  tbody: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  td: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >

  template: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTemplateElement>,
    HTMLTemplateElement
  >

  textarea: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >

  tfoot: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  th: React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >

  thead: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  time: Base

  tr: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >

  track: React.DetailedHTMLProps<
    React.TrackHTMLAttributes<HTMLTrackElement>,
    HTMLTrackElement
  >

  u: Base

  ul: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >

  var: Base

  video: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >

  wbr: Base
}
