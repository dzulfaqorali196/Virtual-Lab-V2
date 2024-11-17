import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram } from 'lucide-react'
import { useSession } from "next-auth/react"

export function Footer() {
  const { data: session } = useSession()

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Logo & Brand */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start">
              <span className="self-center text-2xl font-semibold">Virtual Physics Lab</span>
            </Link>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Navigation */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Navigation</h2>
              <ul className="text-muted-foreground font-medium">
                <li className="mb-4">
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                {session?.user && (
                  <>
                    <li className="mb-4">
                      <Link href="/simulation" className="hover:text-primary">
                        Simulation
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link href="/analytics" className="hover:text-primary">
                        Analytics
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="hover:text-primary">
                        Settings
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Follow Me */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Follow Me</h2>
              <ul className="text-muted-foreground font-medium">
                <li className="mb-4">
                  <Link 
                    href="https://github.com/dzulfaqorali196" 
                    className="hover:text-primary"
                    target="_blank"
                  >
                    Github
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://www.linkedin.com/in/dzulfaqor-ali-dipangegara-85bb241a1" 
                    className="hover:text-primary"
                    target="_blank"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>

            {/* Github */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Github</h2>
              <ul className="text-muted-foreground font-medium">
                <li className="mb-4">
                  <Link 
                    href="https://github.com/dzulfaqorali196/Virtual-Lab-V2" 
                    className="hover:text-primary"
                    target="_blank"
                  >
                    Source Code
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://github.com/dzulfaqorali196/Virtual-Lab-V2/issues" 
                    className="hover:text-primary"
                    target="_blank"
                  >
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-border/40 sm:mx-auto lg:my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <span className="text-sm text-muted-foreground text-center mb-4 sm:mb-0">
            © 2024 Virtual Physics Lab. All Rights Reserved.
          </span>

          {/* Social Icons */}
          <div className="flex justify-center space-x-5">
            <Link 
              href="https://github.com/dzulfaqorali196"
              target="_blank" 
              className="text-muted-foreground hover:text-primary"
            >
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/in/dzulfaqor-ali-dipangegara-85bb241a1"
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link 
              href="mailto:dzulfaqor2003@gmail.com"
              className="text-muted-foreground hover:text-primary"
            >
              <Mail className="w-4 h-4" />
              <span className="sr-only">Email</span>
            </Link>
            <Link 
              href="https://instagram.com/dzzulfaqorr"
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 