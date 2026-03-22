import Navbar from './Navbar'
import Footer from './Footer'
import ProgressBar from './ProgressBar'

interface SiteShellProps {
  children: React.ReactNode
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <ProgressBar />
      <Navbar />
      <main className="wrap">
        {children}
      </main>
      <Footer />
    </>
  )
}
