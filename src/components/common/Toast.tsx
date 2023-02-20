import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { create } from "zustand"
import { Portal } from "./Portal"
import clsx from "classnames"

const DEFAULT_DURATION = 2500

type Options = null | {
  message: string
  duration?: number
  className?: string
  type?: "success" | "info" | "warning" | "error"
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

const CONFIG = {
  info: {
    className: "alert-info",
  },
  success: {
    className: "alert-success",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    className: "alert-warning",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  error: {
    className: "alert-error",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
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
  const type = options?.type || "info"
  const config = CONFIG[type]
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
              <div
                className={clsx("alert py-1 px-2 rounded-lg ", config.className, options.className)}
              >
                <div>
                  {/* @ts-ignore */}
                  {config?.icon}
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
