import {
  MESSAGE_INSTALL_FROM_WEBSITE,
  MESSAGE_INSTALL_IN_WEBSITE,
  MESSAGE_OPEN_FROM_WEBSITE,
  MESSAGE_OPEN_IN_WEBSITE,
} from "@/constants/message"

window.addEventListener("message", async (e) => {
  if (e.data?.type === MESSAGE_INSTALL_IN_WEBSITE) {
    chrome.runtime.sendMessage({
      type: MESSAGE_INSTALL_FROM_WEBSITE,
      data: e.data.data,
    })
  }
  if (e.data?.type === MESSAGE_OPEN_IN_WEBSITE) {
    chrome.runtime.sendMessage({
      type: MESSAGE_OPEN_FROM_WEBSITE,
      data: e.data.data,
    })
  }
})

const injectJsUrl = chrome.runtime.getURL("inject-global.global.js")
const script = document.createElement("script")
script.src = injectJsUrl
document.documentElement.appendChild(script)

export {}
