import React, { useState, useRef } from 'react'
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Box
} from '@mui/material'
import {
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Pause
} from '@mui/icons-material'

const AudioPlayer = ({ 
  text, 
  pronunciation, 
  language = 'ja-JP',
  size = 'medium',
  sx = {},
  showPlayButton = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)
  const utteranceRef = useRef(null)

  const speak = async () => {
    if (!text && !pronunciation) return

    try {
      setIsLoading(true)
      setIsPlaying(true)

      // Sử dụng Web Speech API
      if ('speechSynthesis' in window) {
        // Dừng phát âm hiện tại nếu có
        if (utteranceRef.current) {
          window.speechSynthesis.cancel()
        }

        const utterance = new SpeechSynthesisUtterance()
        utterance.text = text || pronunciation
        utterance.lang = language
        utterance.rate = 0.8 // Tốc độ chậm hơn một chút
        utterance.pitch = 1.0
        utterance.volume = isMuted ? 0 : 1

        utterance.onend = () => {
          setIsPlaying(false)
          setIsLoading(false)
        }

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setIsPlaying(false)
          setIsLoading(false)
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
      } else {
        // Fallback: Sử dụng Audio API nếu có file audio
        if (audioRef.current) {
          audioRef.current.play()
        } else {
          throw new Error('Speech synthesis not supported')
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setIsLoading(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : 1
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      stopSpeaking()
    } else {
      speak()
    }
  }

  const getIcon = () => {
    if (isLoading) {
      return <CircularProgress size={size === 'small' ? 16 : 20} />
    }
    if (showPlayButton) {
      return isPlaying ? <Pause /> : <PlayArrow />
    }
    return isMuted ? <VolumeOff /> : <VolumeUp />
  }

  const getTooltipText = () => {
    if (isLoading) return 'Đang phát âm...'
    if (isPlaying) return 'Dừng phát âm'
    if (isMuted) return 'Bật âm thanh'
    return 'Phát âm'
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ...sx }}>
      <Tooltip title={getTooltipText()}>
        <IconButton
          onClick={handleClick}
          disabled={!text && !pronunciation}
          size={size}
          sx={{
            color: isPlaying ? 'primary.main' : 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: 'primary.light',
            },
            ...sx
          }}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
      
      {/* Hidden audio element for fallback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </Box>
  )
}

export default AudioPlayer 