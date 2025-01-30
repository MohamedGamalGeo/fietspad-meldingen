import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from React DOM
import "./index.css";
import App from "./App";

const container = document.getElementById("root"); // Get the root container
const root = createRoot(container); // Create the root using createRoot API

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
