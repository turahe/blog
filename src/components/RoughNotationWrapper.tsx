'use client'

import { annotate } from 'rough-notation'
import { ReactNode, useEffect, useRef } from 'react'

interface RoughNotationWrapperProps {
  children: ReactNode
  type?: string
  brackets?: string[]
  show?: boolean
  color?: string
  animationDelay?: number
  animationDuration?: number
  strokeWidth?: number
  multiline?: boolean
  animate?: boolean
  customElement?: string
}

export default function RoughNotationWrapper({
  children,
  type = 'underline',
  brackets = ['left', 'right'],
  show = true,
  color = '#FF0000',
  animationDelay = 300,
  animationDuration = 3000,
  strokeWidth = 1,
  multiline = false,
  animate,
  customElement,
}: RoughNotationWrapperProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<ReturnType<typeof annotate> | null>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = customElement
      ? (elementRef.current.querySelector(customElement) as HTMLElement)
      : elementRef.current

    if (!element) return

    annotationRef.current = annotate(element, {
      type: type as
        | 'underline'
        | 'box'
        | 'circle'
        | 'highlight'
        | 'strike-through'
        | 'crossed-off'
        | 'bracket',
      brackets: brackets as ['left' | 'right', 'left' | 'right'],
      color,
      strokeWidth,
      multiline,
      animate: animate ?? true,
      animationDuration,
    })

    if (show) {
      const timeoutId = setTimeout(() => {
        annotationRef.current?.show()
      }, animationDelay)

      return () => {
        clearTimeout(timeoutId)
        annotationRef.current?.hide()
        annotationRef.current?.remove()
      }
    }

    return () => {
      annotationRef.current?.hide()
      annotationRef.current?.remove()
    }
  }, [
    type,
    brackets,
    show,
    color,
    animationDelay,
    animationDuration,
    strokeWidth,
    multiline,
    animate,
    customElement,
  ])

  return <span ref={elementRef}>{children}</span>
}
