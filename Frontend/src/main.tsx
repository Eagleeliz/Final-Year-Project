import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Added this
import { PersistGate } from "redux-persist/integration/react"; // Added this
import { store, persister } from "./Features/store"; // Added this (adjust path if needed)
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 1. Connect the Redux Store */}
    <Provider store={store}>
      {/* 2. Connect the "Memory" loader */}
      <PersistGate loading={null} persistor={persister}>
        {/* 3. Connect the Navigation */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);