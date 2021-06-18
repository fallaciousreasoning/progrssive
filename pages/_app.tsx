import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function ProgrssiveApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
