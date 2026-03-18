import "../src/styles/index.css";
import "./demo.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// When deployed to GitHub Pages under /OnyxUI/, webpack sets publicPath
// and injects __webpack_public_path__. Detect it from <base> or fallback to '/'.
const basename = document.querySelector("base")?.getAttribute("href")?.replace(/\/$/, "") || "";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
);
