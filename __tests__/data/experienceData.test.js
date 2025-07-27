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

import experienceData from '@/data/experienceData'

describe('Experience Data', () => {
  test('should be an array', () => {
    expect(Array.isArray(experienceData)).toBe(true)
  })

  test('each experience should have required properties', () => {
    experienceData.forEach((experience) => {
      expect(experience).toHaveProperty('title')
      expect(experience).toHaveProperty('company')
      expect(experience).toHaveProperty('location')
      expect(experience).toHaveProperty('range')
      expect(experience).toHaveProperty('url')
      expect(experience).toHaveProperty('text')
      
      expect(typeof experience.title).toBe('string')
      expect(typeof experience.company).toBe('string')
      expect(typeof experience.location).toBe('string')
      expect(typeof experience.range).toBe('string')
      expect(typeof experience.url === 'string' || experience.url === null || experience.url === undefined).toBe(true)
      expect(Array.isArray(experience.text)).toBe(true)
    })
  })

  test('experience titles should not be empty', () => {
    experienceData.forEach((experience) => {
      expect(experience.title.trim().length).toBeGreaterThan(0)
    })
  })

  test('company names should not be empty', () => {
    experienceData.forEach((experience) => {
      expect(experience.company.trim().length).toBeGreaterThan(0)
    })
  })

  test('locations should not be empty', () => {
    experienceData.forEach((experience) => {
      expect(experience.location.trim().length).toBeGreaterThan(0)
    })
  })

  test('date ranges should not be empty', () => {
    experienceData.forEach((experience) => {
      expect(experience.range.trim().length).toBeGreaterThan(0)
    })
  })

  test('company URLs should be valid', () => {
    const isValidUrl = (string) => {
      if (!string) return true // Allow null/undefined URLs
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    }

    experienceData.forEach((experience) => {
      expect(isValidUrl(experience.url)).toBe(true)
    })
  })

  test('experience descriptions should not be empty', () => {
    experienceData.forEach((experience) => {
      expect(experience.text.length).toBeGreaterThan(0)
      experience.text.forEach(text => {
        expect(text.trim().length).toBeGreaterThan(0)
      })
    })
  })

  test('should not have duplicate entries', () => {
    const entries = experienceData.map((exp) => `${exp.company}-${exp.title}-${exp.range}`)
    const uniqueEntries = [...new Set(entries)]
    expect(entries.length).toBe(uniqueEntries.length)
  })

  test('experience titles should be reasonable length', () => {
    experienceData.forEach((experience) => {
      expect(experience.title.length).toBeLessThanOrEqual(100)
      expect(experience.title.length).toBeGreaterThan(0)
    })
  })

  test('company names should be reasonable length', () => {
    experienceData.forEach((experience) => {
      expect(experience.company.length).toBeLessThanOrEqual(100)
      expect(experience.company.length).toBeGreaterThan(0)
    })
  })

  test('date ranges should follow expected format', () => {
    experienceData.forEach((experience) => {
      // Check if range contains year patterns (4 digits)
      expect(experience.range).toMatch(/\d{4}/)
    })
  })

  test('experience descriptions should be reasonable length', () => {
    experienceData.forEach((experience) => {
      expect(experience.text.length).toBeLessThanOrEqual(1000)
      expect(experience.text.length).toBeGreaterThan(0)
    })
  })
}) 