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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url
  const shareTitle = title
  const shareDescription = description || title

  return (
    <div className="my-6">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Share this post:
        </span>
        
        <div className="flex items-center space-x-1">
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag={hashtags.length > 0 ? hashtags[0] : undefined}
            className="inline-flex items-center justify-center p-2 mx-1 rounded-full bg-gray-100 dark:bg-gray-700 border-none cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#1877f2] focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FacebookIcon size={32} round className="transition-transform duration-200 ease-in-out" />
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={hashtags}
            className="inline-flex items-center justify-center p-2 mx-1 rounded-full bg-gray-100 dark:bg-gray-700 border-none cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#1da1f2] focus:outline-none focus:ring-2 focus:ring-[#1da1f2] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <TwitterIcon size={32} round className="transition-transform duration-200 ease-in-out" />
          </TwitterShareButton>

          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareDescription}
            className="inline-flex items-center justify-center p-2 mx-1 rounded-full bg-gray-100 dark:bg-gray-700 border-none cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#0077b5] focus:outline-none focus:ring-2 focus:ring-[#0077b5] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <LinkedinIcon size={32} round className="transition-transform duration-200 ease-in-out" />
          </LinkedinShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            className="inline-flex items-center justify-center p-2 mx-1 rounded-full bg-gray-100 dark:bg-gray-700 border-none cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#25d366] focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <WhatsappIcon size={32} round className="transition-transform duration-200 ease-in-out" />
          </WhatsappShareButton>

          <TelegramShareButton
            url={shareUrl}
            title={shareTitle}
            className="inline-flex items-center justify-center p-2 mx-1 rounded-full bg-gray-100 dark:bg-gray-700 border-none cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#0088cc] focus:outline-none focus:ring-2 focus:ring-[#0088cc] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <TelegramIcon size={32} round className="transition-transform duration-200 ease-in-out" />
          </TelegramShareButton>
        </div>
      </div>
    </div>
  )
}
