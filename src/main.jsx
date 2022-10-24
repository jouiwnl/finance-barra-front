import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR'

import 'antd/dist/antd.css';
import './styles/styles.css';
import { CustomBrowserRouter } from './CustomBrowserRouter';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CustomBrowserRouter>
      <ConfigProvider locale={ptBR}>
        <App />
      </ConfigProvider>
    </CustomBrowserRouter>
  </AuthProvider>
)
