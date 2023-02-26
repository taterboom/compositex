import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Panel } from "./common/Panel"
import clsx from "classnames"
import { PANEL } from "@/constants/page"
import useStore from "@/store/useStore"
import { ObjectImportButton } from "./ObjectImport"
import { ClarityBackupLine, ClarityBackupRestoreLine } from "./common/icons"

function Backup() {
  const exportAll = useStore((state) => state.export)
  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">Local Backup</div>
      <div className="flex gap-4 items-center">
        <button
          className="btn btn-sm btn-outline border-base-content/30 gap-2"
          onClick={() => exportAll()}
        >
          <ClarityBackupLine />
          Backup
        </button>
        <ObjectImportButton>
          <ClarityBackupRestoreLine />
          Restore
        </ObjectImportButton>
      </div>
    </div>
  )
}

export function SettingsPanel() {
  return (
    <Panel className="flex">
      <Backup />
    </Panel>
  )
}
