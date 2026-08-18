import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Item {
  label: string
  href: string
  index: string
}

const BASE_ITEMS = [
  { label: "Work", hash: "#work", index: "01" },
  { label: "About", hash: "#about", index: "02" },
  { label: "Lab", hash: "#lab", index: "03" },
  { label: "Contact", hash: "#contact", index: "04" },
] as const

/** Accessible mobile navigation using a shadcn-style Base UI Dialog primitive. */
export default function MobileNav({ onHome = false }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false)
  const items: Item[] = BASE_ITEMS.map((item) => ({
    ...item,
    href: onHome ? item.hash : `/${item.hash}`,
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group flex items-center gap-2 md:hidden">
        <span className="label !text-ink">Menu</span>
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink" />
        </span>
      </DialogTrigger>

      <DialogContent>
        <div className="flex min-h-[100dvh] flex-col">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <DialogTitle className="label">Index / Navigation</DialogTitle>
            <DialogClose className="label !text-ink">Close ✕</DialogClose>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-5" aria-label="Mobile primary">
            <ul>
              {items.map((item) => (
                <li key={item.href} className="border-b border-hairline">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-16 items-baseline justify-between py-5"
                  >
                    <span className="font-display text-[2.75rem] leading-none tracking-tight text-ink">
                      {item.label}
                    </span>
                    <span className="mono text-graphite-2">{item.index}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-between gap-4 px-5 py-6">
            <span className="label">Los Baños · Applied Math</span>
            <span className="mono flex items-center gap-2 text-accent-ink">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Building things
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
