import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/index.css';
import Data from "./backend/Data";
import Auth from "./backend/Auth";

Auth.init();
Data.init();

ReactDOM.createRoot(document.getElementById('root')!).render(<App/>)
