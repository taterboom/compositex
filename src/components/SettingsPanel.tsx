import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Panel } from "./common/Panel"
import clsx from "classnames"
import { PANEL } from "@/constants/page"
import useStore from "@/store/useStore"

function Backup() {
  const exportAll = useStore((state) => state.export)
  return (
    <div className="space-x-2">
      <button className="btn btn-sm" onClick={() => exportAll()}>
        Backup
      </button>
      <Link to={`/${PANEL.IMPORT}`}>
        <button className="btn btn-sm">Restore</button>
      </Link>
    </div>
  )
}

function Sync() {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="space-y-2">
        <div className="text-lg font-semibold">Local Backup</div>
        <Backup />
      </div>
    </div>
  )
}

export function SettingsPanel() {
  const location = useLocation()
  const checkPanelActive = (panel: string) =>
    location.pathname.startsWith(`/${PANEL.SETTINGS}/${panel}`)

  return (
    <Panel className="flex">
      <ul className="menu w-36 p-2 rounded-box">
        <li>
          <a className={clsx("py-2 px-4", checkPanelActive("sync") && "active")}>sync</a>
        </li>
      </ul>
      <div className="py-2 px-4">
        <Routes>
          <Route path={"sync/*"} element={<Sync />} />
          <Route path="*" element={<Navigate to="sync" replace />}></Route>
        </Routes>
      </div>
    </Panel>
  )
}
