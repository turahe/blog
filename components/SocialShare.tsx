/**
 * PROPRIETARY LICENSE
 *
 * Copyright (c) 2024 Nur Wachid. All rights reserved.
 *
 * This software and associated documentation files (the "Software") are the
 * proprietary and confidential information of Nur Wachid ("Licensor").
 * The Software is protected by copyright laws and international copyright
 * treaties, as well as other intellectual property laws and treaties.
 *
 * RESTRICTIONS:
 * - NO REDISTRIBUTION: You may not redistribute, sell, lease, rent,
 *   lend, or otherwise transfer the Software to any third party without
 *   the express written consent of Nur Wachid.
 * - NO MODIFICATION: You may not modify, adapt, alter, translate, or
 *   create derivative works based on the Software without the express
 *   written consent of Nur Wachid.
 * - NO REVERSE ENGINEERING: You may not reverse engineer, decompile,
 *   disassemble, or otherwise attempt to derive the source code of the
 *   Software.
 * - NO COMMERCIAL USE: You may not use the Software for any commercial
 *   purpose without the express written consent of Nur Wachid.
 * - PERSONAL USE ONLY: This Software is provided for personal,
 *   non-commercial use only.
 *
 * For licensing inquiries, commercial use, or other permissions, please
 * contact: Nur Wachid (wachid@outlook.com)
 *
 * @license PROPRIETARY
 * @author Nur Wachid <wachid@outlook.com>
 * @copyright 2024 Nur Wachid. All rights reserved.
 */

'use client'

import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton, 
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon
} from 'react-share'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
}

export default function SocialShare({ url, title, description, hashtags = [] }: SocialShareProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === 'dark' || resolvedTheme === 'dark'
  const shareUrl = typeof window !== 'undefined' ? window.location.href : url
  const shareTitle = title
  const shareDescription = description || title

  const iconSize = 32
  const iconStyle = {
    borderRadius: '50%',
    transition: 'transform 0.2s ease-in-out',
  }

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 4px',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-center space-x-2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Share this post:
        </span>
        
        <div className="flex items-center space-x-1">
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag={hashtags.length > 0 ? hashtags[0] : undefined}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#1877f2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6'
            }}
          >
            <FacebookIcon size={iconSize} round style={iconStyle} />
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={hashtags}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#1da1f2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6'
            }}
          >
            <TwitterIcon size={iconSize} round style={iconStyle} />
          </TwitterShareButton>

          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareDescription}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#0077b5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6'
            }}
          >
            <LinkedinIcon size={iconSize} round style={iconStyle} />
          </LinkedinShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#25d366'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6'
            }}
          >
            <WhatsappIcon size={iconSize} round style={iconStyle} />
          </WhatsappShareButton>

          <TelegramShareButton
            url={shareUrl}
            title={shareTitle}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#0088cc'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6'
            }}
          >
            <TelegramIcon size={iconSize} round style={iconStyle} />
          </TelegramShareButton>
        </div>
      </div>
    </div>
  )
}
