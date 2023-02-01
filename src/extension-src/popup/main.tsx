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
    <div>
      <div>
        <button
          className="btn"
          onClick={() => chrome.tabs.create({ url: `options.html#/${PANEL.PIPELINE}/editor` })}
        >
          +
        </button>
        <button className="btn" onClick={() => chrome.tabs.create({ url: `options.html` })}>
          Dashboard
        </button>
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
