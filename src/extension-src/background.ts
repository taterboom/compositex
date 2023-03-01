import {
  MESSAGE_INSTALL_FROM_WEBSITE,
  MESSAGE_INSTALL_FROM_WEBSITE_REQUEST,
  MESSAGE_OPEN_FROM_WEBSITE,
} from "@/constants/message"
import { PANEL } from "@/constants/page"

let toBeInstalled: any

chrome.runtime.onMessage.addListener(async (e, sender, sendResponse) => {
  if (e?.type === MESSAGE_INSTALL_FROM_WEBSITE) {
    toBeInstalled = e?.data
    chrome.tabs.create({ url: `options.html#/${PANEL.EXTERNAL_INSTALL}` })
  }
  if (e?.type === MESSAGE_INSTALL_FROM_WEBSITE_REQUEST) {
    sendResponse(toBeInstalled)
  }
  if (e?.type === MESSAGE_OPEN_FROM_WEBSITE) {
    chrome.tabs.create({ url: `options.html#${e.data.path}` })
  }
})

export {}
