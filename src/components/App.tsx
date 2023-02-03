import { generatePanelLink, PANEL } from "@/constants/page"
import { plugins, setupTerminal } from "@/plugins"
import clsx from "classnames"
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom"
import { ExplorePannel } from "./ExplorePannel"
import { ImportPanel } from "./ImportPanel"
import { MetaNodePanel } from "./MetaNodePanel"
import { PipelinePanel } from "./PipelinePanel"

setupTerminal(plugins)

export function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const checkPanelActive = (panel: string) => location.pathname.startsWith(`/${panel}`)

  return (
    <div className="flex min-h-screen">
      <ul className="menu bg-base-200 w-48 p-2 rounded-box">
        <li>
          <a
            className={clsx(checkPanelActive(PANEL.PIPELINE) && "active")}
            onClick={() => navigate(generatePanelLink(PANEL.PIPELINE))}
          >
            Pipeline
          </a>
        </li>
        <li>
          <a
            className={clsx(checkPanelActive(PANEL.NODE) && "active")}
            onClick={() => navigate(generatePanelLink(PANEL.NODE))}
          >
            Node
          </a>
        </li>
        <li>
          <a
            className={clsx(checkPanelActive(PANEL.EXPLORE) && "active")}
            onClick={() => navigate(generatePanelLink(PANEL.EXPLORE))}
          >
            Explore
          </a>
        </li>
        <li>
          <a
            className={clsx(checkPanelActive(PANEL.IMPORT) && "active")}
            onClick={() => navigate(generatePanelLink(PANEL.IMPORT))}
          >
            Import
          </a>
        </li>
      </ul>
      <div className="flex-1">
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
