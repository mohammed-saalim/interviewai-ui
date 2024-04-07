import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { AppProvider } from './AppContext.tsx'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AppProvider>
                <App />
            </AppProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
