'use client'

import type React from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { sheet } from '@vitus-labs/styler'

/**
 * SSR registry for @vitus-labs/styler in Next.js App Router.
 * Resets the sheet's inline-style tracking between server renders
 * so that each request gets its own set of inline <style> tags.
 */
export default function StylerRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  useServerInsertedHTML(() => {
    const styles = sheet.getStyles()
    sheet.reset()
    if (!styles) return null
    return <style data-vl="" dangerouslySetInnerHTML={{ __html: styles }} />
  })

  return <>{children}</>
}
