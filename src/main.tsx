import React from "react"
import ReactDOM from "react-dom/client"
import { Root } from "./components/App"
import "./index.css"
import { ToastRoot } from "./components/common/Toast"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <Root />
    <ToastRoot />
  </>
)
