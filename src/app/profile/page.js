'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import useCheckAuth from '@/src/hooks/useCheckAuth'
import React from 'react'

function page() {
  useCheckAuth('/')
  return (
    <PlaceholderPage />
  )
}

export default page