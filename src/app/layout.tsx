import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import './favicon.ico'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'Milwaukee Forecast',
  description: 'Local weather dashboard for Milwaukee with hourly and weekly outlooks.',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="en">
<body className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
        <nav className='shell-nav'>
          <div className='topbar-left'>
            <p className='brand-pill'>LAKEFRONT WEATHER</p>
          </div>
          <div className='topbar-center'>
            <p className='brand-name'>Milwaukee Forecast</p>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
