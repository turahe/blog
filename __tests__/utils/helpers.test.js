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

// Utility functions for testing
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

describe('Utility Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBe('January 15, 2024')
    })

    test('handles string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toBe('January 15, 2024')
    })

    test('handles different date formats', () => {
      const date1 = formatDate('2024-12-25')
      const date2 = formatDate('2024-03-08')
      
      expect(date1).toBe('December 25, 2024')
      expect(date2).toBe('March 8, 2024')
    })
  })

  describe('truncateText', () => {
    test('truncates long text', () => {
      const longText = 'This is a very long text that needs to be truncated'
      const truncated = truncateText(longText, 20)
      expect(truncated).toBe('This is a very long ...')
    })

    test('does not truncate short text', () => {
      const shortText = 'Short text'
      const result = truncateText(shortText, 20)
      expect(result).toBe('Short text')
    })

    test('handles exact length', () => {
      const text = 'Exactly twelve'
      const result = truncateText(text, 12)
      expect(result).toBe('Exactly twel...')
    })

    test('handles empty string', () => {
      const result = truncateText('', 10)
      expect(result).toBe('')
    })
  })

  describe('slugify', () => {
    test('creates valid slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test Article 123')).toBe('test-article-123')
      expect(slugify('Special@Characters!')).toBe('specialcharacters')
    })

    test('handles multiple spaces', () => {
      expect(slugify('Multiple    Spaces')).toBe('multiple-spaces')
    })

    test('handles special characters', () => {
      expect(slugify('Article with & symbols')).toBe('article-with-symbols')
      expect(slugify('Test (with) brackets')).toBe('test-with-brackets')
    })

    test('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('isValidEmail', () => {
    test('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@example.org')).toBe(true)
    })

    test('rejects invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    test('handles edge cases', () => {
      expect(isValidEmail('test@example')).toBe(false)
      expect(isValidEmail('test.example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    test('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://sub.domain.co.uk/path')).toBe(true)
      expect(isValidUrl('https://example.com?param=value')).toBe(true)
    })

    test('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })

    test('handles edge cases', () => {
      expect(isValidUrl('https://')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
    })
  })
})

describe('Data Validation Helpers', () => {
  test('validates required fields', () => {
    const validateRequired = (obj, fields) => {
      return fields.every(field => obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined)
    }

    const validObj = { name: 'Test', email: 'test@example.com' }
    const invalidObj = { name: 'Test' }

    expect(validateRequired(validObj, ['name', 'email'])).toBe(true)
    expect(validateRequired(invalidObj, ['name', 'email'])).toBe(false)
  })

  test('validates string length', () => {
    const validateLength = (str, min, max) => {
      return str.length >= min && str.length <= max
    }

    expect(validateLength('test', 1, 10)).toBe(true)
    expect(validateLength('', 1, 10)).toBe(false)
    expect(validateLength('very long string', 1, 5)).toBe(false)
  })

  test('validates array structure', () => {
    const validateArray = (arr, validator) => {
      return Array.isArray(arr) && arr.every(validator)
    }

    const numbers = [1, 2, 3, 4, 5]
    const mixed = [1, 'string', 3]

    expect(validateArray(numbers, n => typeof n === 'number')).toBe(true)
    expect(validateArray(mixed, n => typeof n === 'number')).toBe(false)
  })
}) 