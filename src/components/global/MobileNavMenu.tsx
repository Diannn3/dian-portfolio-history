import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MobileNavMenuProps {
  links: Array<{ href: string; label: string }>;
  currentPath: string;
}

export function MobileNavMenu({ links, currentPath }: MobileNavMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-hairline bg-canvas text-ink hover:bg-accent-soft transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-sm bg-canvas p-0 border-l border-hairline">
          <div className="flex h-full flex-col justify-between p-8">
            <div>
              <p className="mono-label mb-8">Navigation</p>
              <nav aria-label="Mobile navigation">
                <ul className="space-y-6">
                  {links.map((link, index) => (
                    <li key={link.href}>
                      <SheetClose asChild>
                        <a
                          href={link.href}
                          className={`block font-display text-4xl font-semibold tracking-tight transition-colors ${
                            currentPath === link.href ? 'text-accent' : 'text-ink hover:text-accent'
                          }`}
                          aria-current={currentPath === link.href ? 'page' : undefined}
                        >
                          <span className="mr-2 font-mono text-sm text-graphite">0{index + 1}</span>
                          {link.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="border-t border-hairline pt-6">
              <p className="mono-label mb-2">Status</p>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
                <span className="font-mono text-xs uppercase tracking-widest">Building things</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavMenu;
