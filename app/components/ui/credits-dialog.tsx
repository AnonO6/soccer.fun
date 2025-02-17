import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CREDITS } from "../../constants/credits" // Updated to use relative import

interface CreditsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreditsDialog({ isOpen, onOpenChange }: CreditsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Credits</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {CREDITS.map((credit, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-1">{credit.title}</h3>
              <p className="text-sm text-gray-300 break-all">{credit.url}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

