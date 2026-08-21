import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@/App";
import "@/index.css";

/**
 * basename — подпуть публикации (на GitHub Pages это «/kazmys/»).
 * В деве BASE_URL равен «/», поэтому одно и то же значение работает везде.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
