import { Pipelines } from "@/components/PipelinePanel"
import { plugins, setupTerminal } from "@/plugins"
import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "../../index.css"

setupTerminal(plugins)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <Pipelines></Pipelines>
  </HashRouter>
)
