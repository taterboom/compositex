import {
  MESSAGE_INSTALL_FROM_WEBSITE,
  MESSAGE_INSTALL_FROM_WEBSITE_REQUEST,
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
})

export {}
