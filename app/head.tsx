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

export default function Head() {
  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
    </>
  )
}
