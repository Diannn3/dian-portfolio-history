import { Menu } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Props { links: Array<{ href: string; label: string }>; currentPath: string; }

export default function MobileNavMenu({ links, currentPath }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-grid size-10 place-items-center border border-white/30 text-white" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(90vw,28rem)] border-l border-hairline bg-canvas p-0 text-ink">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Navigate to portfolio sections.</SheetDescription>
        <div className="flex h-full flex-col justify-between p-8 pt-20">
          <nav aria-label="Mobile navigation">
            <ol className="space-y-3">
              {links.map((link, index) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <a href={link.href} className="group flex items-baseline gap-4 border-b border-hairline py-4">
                      <span className="font-mono text-xs text-graphite">0{index + 1}</span>
                      <span className="font-display text-4xl font-semibold tracking-[-0.04em] transition-transform group-hover:translate-x-1">{link.label}</span>
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ol>
          </nav>
          <div className="border-t border-hairline pt-5 font-mono text-xs uppercase tracking-widest text-graphite">System / active</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
