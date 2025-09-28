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

import { useEffect, useState, useRef } from 'react'
import { useTheme } from 'next-themes'

interface PlayMusicProps {
  musicFile: string
}

export default function PlayMusic({ musicFile }: PlayMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { theme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Configure audio
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'

    // Set up audio event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100
        setProgress(progressPercent)
        setCurrentTime(audio.currentTime)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      startProgressTracking()
    }

    const handlePause = () => {
      setIsPlaying(false)
      stopProgressTracking()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      stopProgressTracking()
    }

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    // Handle autoplay policy - browsers require user interaction
    const handleUserInteraction = () => {
      setHasUserInteracted(true)
      if (!isPlaying && audio.paused) {
        audio.play().catch(console.error)
      }
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      stopProgressTracking()
    }
  }, [isPlaying])

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current
      if (audio && isPlaying && audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100
        setProgress(progressPercent)
        setCurrentTime(audio.currentTime)
      }
    }, 100)
  }

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
  }

  const seekForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration)
  }

  const seekBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(audio.currentTime - 10, 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = (parseFloat(e.target.value) / 100) * audio.duration
    audio.currentTime = newTime
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!musicFile || !mounted) return null

  const isDark = theme === 'dark' || resolvedTheme === 'dark'

  return (
    <div className="mb-6">
      <audio ref={audioRef} preload="auto">
        <source src={`/static/sounds/${musicFile}`} type="audio/mpeg" />
        <source src={`/static/sounds/${musicFile}`} type="audio/mp3" />
        <track kind="captions" src="" srcLang="en" label="English" />
        Your browser does not support the audio element.
      </audio>

      {/* Media Player Controls */}
      <div
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} mx-auto max-w-md rounded-lg p-4 shadow-lg`}
      >
        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-2">
          {/* Seek Backward */}
          <button
            onClick={seekBackward}
            className={`p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
            title="Seek backward 10s"
            aria-label="Seek backward 10 seconds"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Seek Forward */}
          <button
            onClick={seekForward}
            className={`p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
            title="Seek forward 10s"
            aria-label="Seek forward 10 seconds"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={toggleMusic}
            className="rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600"
            title={isPlaying ? 'Pause music' : 'Play music'}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Progress Bar */}
          <div className="mx-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className={`slider h-2 flex-1 cursor-pointer appearance-none rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, ${isDark ? '#4b5563' : '#e5e7eb'} ${progress}%, ${isDark ? '#4b5563' : '#e5e7eb'} 100%)`,
                }}
              />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`p-2 transition-colors ${isMuted ? 'text-red-500 hover:text-red-600' : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
