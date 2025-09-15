"use client";

import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  content: string
  className?: string
}

// Very small markdown renderer supporting paragraphs, unordered lists, and inline **bold**/*italic*/`code`.
// Does not render raw HTML to avoid XSS. For our use, it's sufficient for LLM replies per front-end spec.
export default function MarkdownContent({ content, className }: Props) {
  const blocks = React.useMemo(() => parseBlocks(content || ''), [content])
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 my-2">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="my-2 whitespace-pre-wrap">
            {renderInline(b.text)}
          </p>
        )
      })}
    </div>
  )
}

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

function parseBlocks(src: string): Block[] {
  const lines = src.split(/\r?\n/)
  const out: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.trim().startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      out.push({ type: 'ul', items })
      continue
    }
    // paragraph: gather until blank line
    const buf: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim().length > 0 && !lines[i].trim().startsWith('- ')) {
      buf.push(lines[i])
      i++
    }
    out.push({ type: 'p', text: buf.join('\n') })
  }
  return out
}

function renderInline(text: string): React.ReactNode[] {
  // Tokenize by **bold**, *italic*, and `code`
  const nodes: React.ReactNode[] = []
  let remaining = text
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/
  while (remaining.length) {
    const m = remaining.match(pattern)
    if (!m || m.index === undefined) {
      nodes.push(remaining)
      break
    }
    if (m.index > 0) nodes.push(remaining.slice(0, m.index))
    const token = m[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={nodes.length}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={nodes.length} className="font-mono bg-muted/60 px-1 py-0.5 rounded">{token.slice(1, -1)}</code>)
    } else {
      nodes.push(<em key={nodes.length}>{token.slice(1, -1)}</em>)
    }
    remaining = remaining.slice((m.index as number) + token.length)
  }
  return nodes
}

