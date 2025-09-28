'use client'

import { RoughNotation } from '@turahe/react-rough-notation'
import { ReactNode } from 'react'

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
  return (
    <RoughNotation
      type={
        type as
          | 'underline'
          | 'box'
          | 'circle'
          | 'highlight'
          | 'strike-through'
          | 'crossed-off'
          | 'bracket'
      }
      brackets={brackets as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      show={show}
      color={color}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
      strokeWidth={strokeWidth}
      multiline={multiline}
      animate={animate}
      customElement={customElement}
    >
      {children}
    </RoughNotation>
  )
}
