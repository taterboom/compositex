import {
  checkMessageValid,
  generateMessageSender,
  generateMessageType,
  sendBackMessage,
  StatusMessage,
} from "@/utils/sandboxMessage"
import { Plugin } from "../type"
import { OSSUpload } from "./alioss.js"

const NAME = "ShanbayOss"
const MESSAGE_TYPE_SEND = generateMessageType(NAME, "SEND")
const MESSAGE_TYPE_RES = generateMessageType(NAME, "RES")

function initShanbayOssTerminal() {
  window.addEventListener("message", (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE_SEND) {
      const uploader = new OSSUpload({
        service: event.data.payload.service,
      })
      uploader
        .run(event.data.payload.file)
        .then((res) => {
          const resultPayload: StatusMessage = {
            ok: true,
            data: {
              url: res.url,
            },
          }
          sendBackMessage(event, MESSAGE_TYPE_RES, resultPayload)
        })
        .catch((error) => {
          const resultPayload: StatusMessage = {
            ok: false,
            data: error,
          }
          sendBackMessage(event, MESSAGE_TYPE_RES, resultPayload)
        })
    }
  })
}

const ShanbayOssPlugin: Plugin = {
  name: NAME,
  terminal: initShanbayOssTerminal,
  context: (payload: { file: File; service: string }) =>
    generateMessageSender(window.parent)(MESSAGE_TYPE_SEND, payload, { echo: true }),
  contextType: {
    context: `(payload: { file: File; service: string }) => Promise<string>`,
  },
  metaNodeRaw: String.raw`(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
    config: {
      name: "ShanbayOss",
      desc: "Shanbay Oss uploader",
      input: { type: "string" },
      output: { type: "string" },
      options: [{ name: "service", type: "string", default: "cms_comment_image" }],
    },
    run(input, options, context) {
      return context
        .fetch(input)
        .then((res) => {
          const immetype = res.data.type
          const ext = immetype.split('/')[1]
          return new File([res], "compositex-shanbay-oss." + ext, { type: immetype })
        })
        .then((file) => context.${NAME}({ file, service: options.service }))
    },
  }
  return nodeConfig
})()`,
}

export default ShanbayOssPlugin
