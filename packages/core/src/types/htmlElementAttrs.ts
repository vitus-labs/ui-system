import * as React from 'react'

export type HTMLElementProps = {
  a: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >

  area: React.DetailedHTMLProps<
    React.AreaHTMLAttributes<HTMLAreaElement>,
    HTMLAreaElement
  >

  audio: React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >

  base: React.DetailedHTMLProps<
    React.BaseHTMLAttributes<HTMLBaseElement>,
    HTMLBaseElement
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

  data: React.DetailedHTMLProps<
    React.DataHTMLAttributes<HTMLDataElement>,
    HTMLDataElement
  >

  datalist: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDataListElement>,
    HTMLDataListElement
  >

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

  element: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >

  embed: React.DetailedHTMLProps<
    React.EmbedHTMLAttributes<HTMLEmbedElement>,
    HTMLEmbedElement
  >

  fieldset: React.DetailedHTMLProps<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  >

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

  head: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadElement>,
    HTMLHeadElement
  >

  hr: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHRElement>,
    HTMLHRElement
  >

  html: React.DetailedHTMLProps<
    React.HtmlHTMLAttributes<HTMLHtmlElement>,
    HTMLHtmlElement
  >

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

  del: React.DetailedHTMLProps<
    React.DelHTMLAttributes<HTMLModElement>,
    HTMLModElement
  >

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

  link: React.DetailedHTMLProps<
    React.LinkHTMLAttributes<HTMLLinkElement>,
    HTMLLinkElement
  >

  map: React.DetailedHTMLProps<
    React.MapHTMLAttributes<HTMLMapElement>,
    HTMLMapElement
  >

  meta: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >

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

  P: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >

  param: React.DetailedHTMLProps<
    React.ParamHTMLAttributes<HTMLParamElement>,
    HTMLParamElement
  >

  pre: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  >

  progress: React.DetailedHTMLProps<
    React.ProgressHTMLAttributes<HTMLProgressElement>,
    HTMLProgressElement
  >

  blockquote: React.DetailedHTMLProps<
    React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  q: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  cite: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >

  slot: React.DetailedHTMLProps<
    React.SlotHTMLAttributes<HTMLSlotElement>,
    HTMLSlotElement
  >

  script: React.DetailedHTMLProps<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    HTMLScriptElement
  >

  noscript: React.DetailedHTMLProps<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    HTMLScriptElement
  >

  select: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >

  source: React.DetailedHTMLProps<
    React.SourceHTMLAttributes<HTMLSourceElement>,
    HTMLSourceElement
  >

  span: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >

  style: React.DetailedHTMLProps<
    React.StyleHTMLAttributes<HTMLStyleElement>,
    HTMLStyleElement
  >

  svg: React.SVGProps<SVGSVGElement>

  table: React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >

  col: React.DetailedHTMLProps<
    React.ColHTMLAttributes<HTMLTableColElement>,
    HTMLTableColElement
  >

  colgroup: React.DetailedHTMLProps<
    React.ColgroupHTMLAttributes<HTMLTableColElement>,
    HTMLTableColElement
  >

  td: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >

  th: React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >

  tr: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >

  thead: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  tbody: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  tfoot: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >

  template: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTemplateElement>,
    HTMLTemplateElement
  >

  textarea: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >

  title: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTitleElement>,
    HTMLTitleElement
  >

  track: React.DetailedHTMLProps<
    React.TrackHTMLAttributes<HTMLTrackElement>,
    HTMLTrackElement
  >

  ul: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >

  video: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >

  webview: React.DetailedHTMLProps<
    React.WebViewHTMLAttributes<HTMLWebViewElement>,
    HTMLWebViewElement
  >
}
