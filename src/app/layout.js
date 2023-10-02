'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../redux/provider'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import { useState } from 'react'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <Head>
      <meta name='theme-color' content='#24303F' />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <body className={inter.className}>
       <Providers>
       <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden ">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden lg:hide-scrollbar">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <div  className=''>
        {children}
        </div>
         {/* <!-- ===== Main Content End ===== --> */}
         </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
        </Providers>
      </body>
    </html>
  )
}
