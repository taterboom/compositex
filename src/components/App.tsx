import { generatePanelLink, PANEL } from "@/constants/page"
import { plugins, setupTerminal } from "@/plugins"
import clsx from "classnames"
import { PropsWithChildren } from "react"
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom"
import { Logo, MENU } from "./common/icons"
import { ExplorePannel } from "./ExplorePannel"
import ExternalInstallPanel from "./ExternalInstallPanel"
import InspectPanel from "./InspectPanel"
import { router as MetaNodeRouter } from "./MetaNodePanel"
import { router as pipelineRouter } from "./PipelinePanel"
import { SettingsPanel } from "./SettingsPanel"

setupTerminal(plugins)

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {pipelineRouter}
      {MetaNodeRouter}
      <Route path={`${PANEL.EXPLORE}/*`} element={<ExplorePannel />}></Route>
      <Route path={`${PANEL.SETTINGS}/*`} element={<SettingsPanel />}></Route>
      <Route path={`${PANEL.INSPECT}/*`} element={<InspectPanel />}></Route>
      <Route path={`${PANEL.EXTERNAL_INSTALL}/*`} element={<ExternalInstallPanel />}></Route>
      <Route index element={<Navigate to={`${PANEL.PIPELINE}`} replace />}></Route>
    </Route>
  )
)

export const Root = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const checkPanelActive = (panel: string) => location.pathname.startsWith(`/${panel}`)

  return (
    <div className="flex min-h-screen">
      <div className="w-48 p-2 bg-base-100">
        <div className="flex flex-col items-center space-y-1 p-2">
          <Logo className="text-2xl" />
          <span className="text-lg">CompisteX</span>
        </div>
        <ul className="menu menu-compact space-y-1 p-2 rounded-box">
          <li>
            <a
              className={clsx(checkPanelActive(PANEL.PIPELINE) && "active")}
              onClick={() => navigate(generatePanelLink(PANEL.PIPELINE))}
            >
              <MENU.IconParkSolidConnectionPointTwo />
              <span>Pipeline</span>
            </a>
          </li>
          <li>
            <a
              className={clsx(checkPanelActive(PANEL.NODE) && "active")}
              onClick={() => navigate(generatePanelLink(PANEL.NODE))}
            >
              <MENU.FluentPipeline20Filled />
              <span>Node</span>
            </a>
          </li>
          <li>
            <a
              className={clsx(checkPanelActive(PANEL.EXPLORE) && "active")}
              onClick={() => navigate(generatePanelLink(PANEL.EXPLORE))}
            >
              <MENU.MaterialSymbolsExplore />
              <span>Explore</span>
            </a>
          </li>
          <li>
            <a
              className={clsx(checkPanelActive(PANEL.SETTINGS) && "active")}
              onClick={() => navigate(generatePanelLink(PANEL.SETTINGS))}
            >
              <MENU.MaterialSymbolsSettingsOutline />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default App
