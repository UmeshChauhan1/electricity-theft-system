import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Electricity Theft Detection System - PSPCL',
  description: 'Real-time monitoring and detection of electricity theft',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
