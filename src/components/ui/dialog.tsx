import type { ComponentProps } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils/cn"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogClose = DialogPrimitive.Close

/**
 * Site-owned shadcn-style Dialog primitive. Base UI owns focus trapping,
 * Escape handling, scroll locking, outside interaction and focus restoration;
 * Vector Atlas owns every visual decision.
 */
export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-[149] bg-ink/20" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-[150] md:hidden">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn("coord-paper min-h-[100dvh] w-full bg-paper text-ink outline-none", className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  )
}
