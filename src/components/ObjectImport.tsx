import { isMetaNode } from "@/utils/helper"
import React, { useMemo, useState } from "react"
import { PipelineItem } from "./common/PipelineItem"
import { MetaNodeItem } from "./common/MetaNodeItem"
import clsx from "classnames"
import useStore from "@/store/useStore"
import { IconParkOutlineInstall, MaterialSymbolsUploadRounded } from "./common/icons"
import { Popup } from "./common/Popup"
import { toast } from "./common/Toast"

export function ObjectImport(props: { onClose?: () => void }) {
  const installMetaNode = useStore((state) => state.installMetaNode)
  const installPipeline = useStore((state) => state.installPipeline)
  const [jsonObject, setJsonObject] = useState<any | null>(null)
  const [file, setFile] = useState<any>(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    setFile(file)
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const result = e.target?.result
      if (typeof result !== "string") {
        return
      }
      try {
        setJsonObject(JSON.parse(result))
      } catch (err) {
        console.log("[Parse]", err)
        alert("Can not parse the file which includes invalid content.")
      }
    }
    fileReader.readAsText(file)
  }
  const objects = useMemo(() => {
    if (jsonObject) {
      if (Array.isArray(jsonObject)) {
        return jsonObject
      } else {
        return [jsonObject]
      }
    }
    return []
  }, [jsonObject])
  const installAll = () => {
    objects.forEach((item) => {
      if (isMetaNode(item)) {
        installMetaNode(item)
      } else {
        installPipeline(item)
      }
    })
  }
  return (
    <div
      className={clsx(
        "flex flex-col space-y-4 min-w-[480px] max-h-[80vh]",
        !!file && "h-[600px] space-y-2"
      )}
    >
      <label
        htmlFor="dropzone-file"
        className={clsx(
          "flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
          !!file && "hidden"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <MaterialSymbolsUploadRounded className="text-4xl" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to import</span>
          </p>
        </div>
      </label>
      <div className={clsx("flex items-center space-x-4", !file && "hidden")}>
        <input
          id="dropzone-file"
          type="file"
          className={clsx("file-input file-input-bordered w-full max-w-sm")}
          accept=".json"
          onChange={handleChange}
        />
      </div>
      {objects.length > 0 && (
        <div
          className={clsx([
            "flex-1 overflow-y-auto relative first:mt-0",
            objects.length > 1 &&
              "before:sticky before:block before:top-0 before:left-0 before:w-full before:h-4 before:bg-gradient-to-b from-base-100/100 to-base-100/0 before:z-10",
            objects.length > 1 &&
              "after:sticky after:block after:bottom-0 after:left-0 after:w-full after:h-4 after:bg-gradient-to-t from-base-100/100 to-base-100/0 after:z-10",
          ])}
        >
          {objects.map((item, index) =>
            isMetaNode(item) ? (
              <MetaNodeItem key={index} value={item} className={index === 0 ? "mt-0" : ""} />
            ) : (
              <PipelineItem key={index} value={item} className={index === 0 ? "mt-0" : ""} />
            )
          )}
        </div>
      )}
      <div className="flex justify-end space-x-4">
        <button className="btn" onClick={props.onClose}>
          Close
        </button>
        {objects.length > 1 && (
          <button
            className={clsx("btn btn-primary")}
            onClick={() => {
              installAll()
              toast({ message: "Success", type: "success" })
              props.onClose?.()
            }}
          >
            Install All
          </button>
        )}
      </div>
    </div>
  )
}

export function ObjectImportButton() {
  const [popupVisible, setPopupVisible] = useState(false)
  return (
    <>
      <button
        className="btn btn-sm btn-primary btn-outline gap-2"
        onClick={() => setPopupVisible(true)}
      >
        <IconParkOutlineInstall /> Import
      </button>
      <Popup open={popupVisible}>
        <ObjectImport
          onClose={() => {
            setPopupVisible(false)
          }}
        />
      </Popup>
    </>
  )
}
