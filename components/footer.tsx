import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram } from 'lucide-react'
import { useSession } from "next-auth/react"

export function Footer() {
  const { data: session } = useSession()

  // Links yang membutuhkan autentikasi
  const authenticatedLinks = [
    { href: "/simulation", label: "Simulation" },
    { href: "/analytics", label: "Analytics" },
    { href: "/api-docs", label: "API Docs" },
  ]

  // Links yang dapat diakses publik
  const publicLinks = [
    { href: "/about", label: "About" },
    { href: "/", label: "Home" },
  ]

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="text-center md:text-left space-y-4">
            <h3 className="font-semibold text-lg">Virtual Physics Lab</h3>
            <p className="text-sm text-muted-foreground">
              Interactive physics learning platform for virtual pendulum experiments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              {/* Public Links */}
              {publicLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Authenticated Links */}
              {session?.user ? (
                authenticatedLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                authenticatedLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={`/auth/signin?callbackUrl=${link.href}`}
                    className="text-muted-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label} (Login required)
                  </Link>
                ))
              )}
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link
                href="https://github.com/dzulfaqorali196"
                target="_blank"
                className="rounded-full bg-muted p-2 hover:bg-primary/10 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/dzulfaqor-ali-dipangegara-85bb241a1"
                target="_blank"
                className="rounded-full bg-muted p-2 hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:dzulfaqor2003@gmail.com"
                className="rounded-full bg-muted p-2 hover:bg-primary/10 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href="https://instagram.com/dzzulfaqorr"
                target="_blank"
                className="rounded-full bg-muted p-2 hover:bg-primary/10 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-muted-foreground">
          <p>
            © 2024 Virtual Physics Lab. All rights reserved.
          </p>
          <p>
            Built by{" "}
            <Link
              href="https://github.com/dzulfaqorali196"
              target="_blank"
              className="font-medium hover:text-primary transition-colors"
            >
              Dzulfaqor Ali
            </Link>
          </p>
          <p>
            <Link
              href="https://github.com/dzulfaqorali196/Virtual-Lab-V2"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Source Code
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
} 