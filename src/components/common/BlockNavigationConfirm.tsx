import { useEffect, useState } from "react"
import { Popup } from "./Popup"
import { unstable_useBlocker as useBlocker } from "react-router-dom"

export function BlockNavigationConfirm({ isBlocked }: { isBlocked: boolean }) {
  const [open, setOpen] = useState(false)
  const blocker = useBlocker(isBlocked)

  // Reset the blocker if the user cleans the form
  useEffect(() => {
    if (blocker.state === "blocked" && !isBlocked) {
      blocker.reset()
    }
  }, [blocker, isBlocked])

  useEffect(() => {
    const listener = (e: Event) => {
      e.preventDefault()
      // @ts-ignore
      return (e.returnValue = "")
    }

    if (isBlocked) {
      window.addEventListener("beforeunload", listener)
    }
    return () => {
      window.removeEventListener("beforeunload", listener)
    }
  }, [isBlocked])

  useEffect(() => {
    setOpen(blocker.state === "blocked")
  }, [blocker])

  return (
    <Popup open={open}>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <h2 className="card-title">Leave the page?</h2>
          <p>Changes you made may not be saved.</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-sm"
              onClick={() => {
                blocker.reset?.()
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                blocker.proceed?.()
              }}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </Popup>
  )
}
