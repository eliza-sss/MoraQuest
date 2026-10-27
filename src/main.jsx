import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from "./Root.jsx";
//import Auth from "./Auth.jsx";
//import App from './App.jsx'
//import SupabaseTest from "./SupabaseTest.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
