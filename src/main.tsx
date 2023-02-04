import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import { HashRouter } from "react-router-dom"
import "./index.css"
import { ToastRoot } from "./components/common/Toast"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <App />
    <ToastRoot />
  </HashRouter>
)
