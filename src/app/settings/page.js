'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import checkAuth from '@/src/hooks/useCheckAuth'
import React from 'react'

function page() {
  checkAuth('/')
  return (
    <PlaceholderPage />
  )
}

export default page