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
            className={clsx(
              "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-lg p-4 rounded max-w-4xl",
              props.className
            )}
          >
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
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  )
}
