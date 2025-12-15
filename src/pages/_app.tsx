import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StoreProvider from '../shared/store/Provider'
import { Toaster } from 'react-hot-toast'
import Navbar from '../shared/components/Navbar'
import DemoBanner from '../shared/components/DemoBanner'
import { checkAndInitializeDemo } from '../shared/data/demoHelper'
import { HiArrowNarrowUp } from 'react-icons/hi'
import '../index.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [showArrow, setShowArrow] = useState(false)

  // 🎭 Initialize demo mode if enabled
  useEffect(() => {
    checkAndInitializeDemo()
  }, [])

  // Scroll to the top of the page when the route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [router.asPath])

  // Go upward arrow - show, unshow
  const handleArrow = () => {
    if (typeof window !== 'undefined' && window.scrollY > 500) {
      setShowArrow(true)
    } else {
      setShowArrow(false)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('scroll', handleArrow)
    return () => {
      window.removeEventListener('scroll', handleArrow)
    }
  }, [showArrow])

  return (
    <StoreProvider>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />
        <Toaster />

        {/* go upward arrow */}
        <button
          onClick={() => typeof window !== 'undefined' && window.scrollTo(0, 0)}
          className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
            showArrow ? 'bottom-6' : '-bottom-24'
          }`}
        >
          <HiArrowNarrowUp />
        </button>

        <Component {...pageProps} />

        {/* Demo Mode Banner */}
        <DemoBanner />
      </div>
    </StoreProvider>
  )
}

