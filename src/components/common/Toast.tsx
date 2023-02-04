import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { create } from "zustand"
import { Portal } from "./Portal"

const DEFAULT_DURATION = 2500

type Options = null | {
  message: string
  duration?: number
  className?: string
}

const useToast = create<{ options: Options; setOptions: (options: Options) => void }>((set) => ({
  options: null,
  setOptions(options: Options) {
    set({ options })
  },
}))

export function toast(options: Options) {
  useToast.setState({ options })
}

export function ToastRoot() {
  const options = useToast((state) => state.options)
  const setOptions = useToast((state) => state.setOptions)
  useEffect(() => {
    if (options) {
      const id = setTimeout(() => {
        setOptions(null)
      }, options.duration || DEFAULT_DURATION)
      return () => {
        clearTimeout(id)
      }
    }
  }, [options])
  return (
    <AnimatePresence>
      {options ? (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="toast toast-top toast-center"
          >
            <div>
              <div className={"alert py-1 px-2 rounded-lg " + (options.className || "alert-info")}>
                <div>
                  <span>{options.message}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Portal>
      ) : null}
    </AnimatePresence>
  )
}
