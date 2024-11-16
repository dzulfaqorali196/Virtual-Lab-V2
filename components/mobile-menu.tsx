"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Settings, LogOut } from "lucide-react"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"

interface MobileMenuProps {
  routes: Array<{ href: string; label: string }>
  session: Session | null
}

export function MobileMenu({ routes, session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    document.body.style.overflow = !isOpen ? "hidden" : "auto"
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-40 pt-16 pb-6 bg-background/95 backdrop-blur-sm border-b"
          >
            <nav className="container px-4">
              <ul className="space-y-4">
                {routes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={closeMenu}
                      className={`block py-2 text-lg ${
                        pathname === route.href
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}

                {session ? (
                  <>
                    <li className="pt-4 border-t">
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center py-2 text-lg text-muted-foreground"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        onClick={closeMenu}
                        className="flex items-center py-2 text-lg text-muted-foreground"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          closeMenu()
                          signOut()
                        }}
                        className="flex items-center py-2 text-lg text-muted-foreground w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="pt-4">
                    <Link
                      href="/auth/signin"
                      onClick={closeMenu}
                      className="block w-full"
                    >
                      <Button variant="default" size="lg" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}