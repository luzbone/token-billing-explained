import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider, useI18n } from "./i18n";
import { setDefaultNumberLocale } from "./lib/format";

/** Keep module-level number formatters in sync during render (not after effect). */
function LocaleBridge({ children }: { children: ReactNode }) {
  const { numberLocale } = useI18n();
  setDefaultNumberLocale(numberLocale);
  return children;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <LocaleBridge>
        <App />
      </LocaleBridge>
    </I18nProvider>
  </StrictMode>,
);
