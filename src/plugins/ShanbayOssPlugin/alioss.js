const apiv3Prefix = "https://apiv3.shanbay.com"

const PART_SIZE = 1024 * 1024

export class OSSUpload {
  constructor(options = {}) {
    const { service = "op_pub_image" } = options
    this.service = service
    this.ossStore = null
  }

  async setup(file) {
    if (!this.service) {
      throw new Error("setup failed：service is wrong")
    }
    const { type } = file
    let ext = type.split("/")[1]
    if (ext === "svg+xml") {
      ext = "svg"
    }
    try {
      const { data: token } = await fetch(
        `${apiv3Prefix}/media/token?code=${this.service}&green_check=true&media_type=${ext}`
      ).then((res) => res.json())
      if (token.size_limit && file.size > token.size_limit * 1024) {
        throw new Error(`setup failed：exceed file size limit`)
      }
      this.ossStore = new OSS({
        secure: true,
        bucket: token.bucket_name,
        accessKeyId: token.Credentials && token.Credentials.AccessKeyId,
        accessKeySecret: token.Credentials && token.Credentials.AccessKeySecret,
        stsToken: token.Credentials && token.Credentials.SecurityToken,
      })
      const callback = {
        callbackUrl: token.callback_url,
        callbackBody: token.callback_body,
        callbackBodyType: "application/json",
      }
      const ossOptions = {
        partSize: PART_SIZE,
        headers: {
          "x-oss-callback": btoa(JSON.stringify(callback)),
          "x-oss-callback-var": btoa(JSON.stringify(token.callback_vars)),
        },
      }
      return {
        token,
        ossOptions,
      }
    } catch (err) {
      throw new Error(`setup failed：${err.message}`)
    }
  }

  async upload({ file, token, ossOptions }) {
    const ossRes = await this.ossStore.multipartUpload(token.key, file, ossOptions)
    const callbackRes = ossRes.data
    return {
      url:
        callbackRes.data && callbackRes.data.url
          ? callbackRes.data.url
          : `https://${token.bucket_name}.baydn.com/${token.key}`,
      name: ossRes.name,
    }
  }

  async run(file) {
    const { token, ossOptions } = await this.setup(file)
    const result = await this.upload({
      file,
      token,
      ossOptions,
    })
    return result
  }

  async cancel() {
    if (this.ossStore) {
      this.ossStore.cancel()
    }
  }
}
