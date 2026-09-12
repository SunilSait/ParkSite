import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Custom styles
import './App.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
