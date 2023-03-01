import { MESSAGE_INSTALL_IN_WEBSITE, MESSAGE_OPEN_IN_WEBSITE } from "@/constants/message"

// @ts-ignore
window.__compositex_proxy__ = {
  install(objects: any) {
    window.postMessage({
      type: MESSAGE_INSTALL_IN_WEBSITE,
      data: objects,
    })
  },
  open(path: string) {
    window.postMessage({
      type: MESSAGE_OPEN_IN_WEBSITE,
      data: {
        path,
      },
    })
  },
}

export {}
