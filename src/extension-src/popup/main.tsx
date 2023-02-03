import {
  MaterialSymbolsAdd,
  MaterialSymbolsHomeRounded,
  MaterialSymbolsUploadRounded,
} from "@/components/common/icons"
import { Pipelines } from "@/components/Pipelines"
import { PANEL } from "@/constants/page"
import { plugins, setupTerminal } from "@/plugins"
import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "../../index.css"

setupTerminal(plugins)

function App() {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="flex-1">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => chrome.tabs.create({ url: `options.html#/${PANEL.PIPELINE}/editor` })}
          >
            <MaterialSymbolsAdd />
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => chrome.tabs.create({ url: `options.html#/${PANEL.IMPORT}` })}
          >
            <MaterialSymbolsUploadRounded />
          </button>
        </div>
        <div className="flex">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => chrome.tabs.create({ url: `options.html` })}
          >
            <MaterialSymbolsHomeRounded />
          </button>
        </div>
      </div>
      <Pipelines
        navigate={(path) => chrome.tabs.create({ url: "options.html#" + path })}
      ></Pipelines>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <App />
  </HashRouter>
)
