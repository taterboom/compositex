import { generatePanelLink, PANEL } from "@/constants/page"
import clsx from "classnames"
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom"
import { ExplorePannel } from "./ExplorePannel"
import { ImportPanel } from "./ImportPanel"
import { MetaNodePanel } from "./MetaNodePanel"
import { PipelinePanel } from "./PipelinePanel"

export function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const checkPanelActive = (panel: string) => location.pathname.startsWith(`/${panel}`)

  return (
    <div className="flex min-h-screen">
      <ul className="menu bg-base-200 w-32 rounded-box">
        <li
          className={clsx(checkPanelActive(PANEL.PIPELINE) && "border-r-4")}
          onClick={() => navigate(generatePanelLink(PANEL.PIPELINE))}
        >
          <a>Pipeline</a>
        </li>
        <li
          className={clsx(checkPanelActive(PANEL.NODE) && "border-r-4")}
          onClick={() => navigate(generatePanelLink(PANEL.NODE))}
        >
          <a>Node</a>
        </li>
        <li
          className={clsx(checkPanelActive(PANEL.EXPLORE) && "border-r-4")}
          onClick={() => navigate(generatePanelLink(PANEL.EXPLORE))}
        >
          <a>Explore</a>
        </li>
        <li
          className={clsx(checkPanelActive(PANEL.IMPORT) && "border-r-4")}
          onClick={() => navigate(generatePanelLink(PANEL.IMPORT))}
        >
          <a>Import</a>
        </li>
      </ul>
      <div>
        <Routes>
          <Route path={`${PANEL.PIPELINE}/*`} element={<PipelinePanel />}></Route>
          <Route path={`${PANEL.NODE}/*`} element={<MetaNodePanel />}></Route>
          <Route path={`${PANEL.EXPLORE}/*`} element={<ExplorePannel />}></Route>
          <Route path={`${PANEL.IMPORT}/*`} element={<ImportPanel />}></Route>
          <Route path="*" element={<Navigate to={`${PANEL.PIPELINE}`} replace />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
