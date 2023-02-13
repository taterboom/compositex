import { MESSAGE_INSTALL_IN_WEBSITE } from "@/constants/message"

// @ts-ignore
window.__compositex_proxy__ = {
  install(objects: any) {
    window.postMessage({
      type: MESSAGE_INSTALL_IN_WEBSITE,
      data: objects,
    })
  },
}

export {}
