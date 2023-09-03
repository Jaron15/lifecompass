'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import React from 'react'
import Notebook from '../../components/THE/hobbyComponents/Notebook'

function page() {
  return (
    <div 
      className="w-full flex justify-center items-center border border-white"
      style={{
        height: `calc(100vh - 68px)`,
        '@media (min-width: 1024px)': {
          height: `calc(100vh - 0px)`,
        },
      }}
    >
        <Notebook />
    </div>
  )
}

export default page