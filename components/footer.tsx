import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/dzulfaqorali196"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              Dzulfaqor Ali
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/dzulfaqorali196/virtual-physics-lab"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="https://github.com/dzulfaqorali196"
            target="_blank"
            className="rounded-2xl bg-muted p-2.5 hover:bg-muted/80"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/dzulfaqor-ali-dipangegara-85bb241a1"
            target="_blank"
            className="rounded-2xl bg-muted p-2.5 hover:bg-muted/80"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="mailto:dzulfaqor2003@gmail.com"
            className="rounded-2xl bg-muted p-2.5 hover:bg-muted/80"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
          <Link
            href="https://instagram.com/dzzulfaqorr"
            target="_blank"
            className="rounded-2xl bg-muted p-2.5 hover:bg-muted/80"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 Virtual Physics Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 