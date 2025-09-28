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

import { useState, useEffect } from 'react'
import { Facebook, Twitter, Linkedin, Whatsapp, Telegram } from './social-icons/icons'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
}

export default function SocialShare({ url, title, description, hashtags = [] }: SocialShareProps) {
  const [mounted, setMounted] = useState(false)

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url
  const shareTitle = title
  const shareDescription = description || title

  const handleShare = (
    platform: string,
    shareData: { url: string; title: string; description?: string; hashtags?: string[] }
  ) => {
    const {
      url: shareUrl,
      title: shareTitle,
      description: shareDescription,
      hashtags: shareHashtags,
    } = shareData

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
          '_blank',
          'width=600,height=400'
        )
        break
      case 'twitter': {
        const twitterText = `${shareTitle}${shareHashtags?.length ? ` ${shareHashtags.map((tag) => `#${tag}`).join(' ')}` : ''}`
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(twitterText)}`,
          '_blank',
          'width=600,height=400'
        )
        break
      }
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription || '')}`,
          '_blank',
          'width=600,height=400'
        )
        break
      case 'whatsapp': {
        const whatsappText = `${shareTitle} - ${shareUrl}`
        window.open(
          `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
          '_blank',
          'width=600,height=400'
        )
        break
      }
      case 'telegram': {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
          '_blank',
          'width=600,height=400'
        )
        break
      }
    }
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Share this post:
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() =>
              handleShare('facebook', {
                url: shareUrl,
                title: shareTitle,
                description: shareDescription,
                hashtags,
              })
            }
            className="mx-1 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-2 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#1877f2] focus:ring-2 focus:ring-[#1877f2] focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5 text-gray-600 transition-colors duration-200 hover:text-white dark:text-gray-300" />
          </button>

          <button
            onClick={() =>
              handleShare('twitter', {
                url: shareUrl,
                title: shareTitle,
                description: shareDescription,
                hashtags,
              })
            }
            className="mx-1 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-2 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#1da1f2] focus:ring-2 focus:ring-[#1da1f2] focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-5 w-5 text-gray-600 transition-colors duration-200 hover:text-white dark:text-gray-300" />
          </button>

          <button
            onClick={() =>
              handleShare('linkedin', {
                url: shareUrl,
                title: shareTitle,
                description: shareDescription,
                hashtags,
              })
            }
            className="mx-1 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-2 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#0077b5] focus:ring-2 focus:ring-[#0077b5] focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5 text-gray-600 transition-colors duration-200 hover:text-white dark:text-gray-300" />
          </button>

          <button
            onClick={() =>
              handleShare('whatsapp', {
                url: shareUrl,
                title: shareTitle,
                description: shareDescription,
                hashtags,
              })
            }
            className="mx-1 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-2 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#25d366] focus:ring-2 focus:ring-[#25d366] focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <Whatsapp className="h-5 w-5 text-gray-600 transition-colors duration-200 hover:text-white dark:text-gray-300" />
          </button>

          <button
            onClick={() =>
              handleShare('telegram', {
                url: shareUrl,
                title: shareTitle,
                description: shareDescription,
                hashtags,
              })
            }
            className="mx-1 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-2 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#0088cc] focus:ring-2 focus:ring-[#0088cc] focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:focus:ring-offset-gray-800"
            title="Share on Telegram"
            aria-label="Share on Telegram"
          >
            <Telegram className="h-5 w-5 text-gray-600 transition-colors duration-200 hover:text-white dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
