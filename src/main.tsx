import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import App from "./App";
import {Toaster} from "react-hot-toast";

const isDark = localStorage.getItem('theme') === 'dark';
if (isDark) {
    document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
      <Toaster position="bottom-center" reverseOrder={false} />
  </StrictMode>,
)
