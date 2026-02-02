import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemedToastContainer } from "./components/ThemedToastContainer";
import { store } from "./store";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <ThemedToastContainer />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
