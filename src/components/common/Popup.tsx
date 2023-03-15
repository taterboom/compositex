import { motion, AnimatePresence } from "framer-motion"
import { PropsWithChildren } from "react"
import { Portal } from "./Portal"
import clsx from "classnames"
import { MaterialSymbolsCloseRounded } from "./icons"

export function Popup(
  props: PropsWithChildren<{
    open: boolean
    className?: string
    closeable?: boolean
    onClose?: () => void
  }>
) {
  return (
    <AnimatePresence>
      {props.open && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.1,
            }}
            className="fixed z-50 inset-0 bg-base-300/50 backdrop-blur"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.1,
            }}
            className={clsx("fixed inset-0 overflow-y-auto z-50 ", props.className)}
          >
            <div className="flex justify-center items-center min-h-screen p-8">
              <div className="relative bg-base-100 shadow-lg p-4 rounded max-w-4xl">
                {props.closeable && (
                  <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 ">
                    <button
                      className="btn btn-circle text-xl bg-base-100"
                      onClick={() => {
                        props.onClose?.()
                      }}
                    >
                      <MaterialSymbolsCloseRounded />
                    </button>
                  </div>
                )}
                {props.children}
              </div>
            </div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  )
}
