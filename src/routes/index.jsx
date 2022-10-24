import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import Funcionarios from "../pages/Funcionarios";
import Login from '../pages/Login';
import Home from '../pages/Home';
import Sinteticas from '../pages/Sinteticas';
import CentrosCustos from '../pages/CentrosCustos';
import Analiticas from '../pages/Analiticas';
import Lancamentos from '../pages/Lancamentos';
import PlanosContas from '../pages/PlanosContas';

import UnsupportedMobile from '../pages/UnsupportedMobile';

import { AuthContext } from '../contexts/AuthContext';

export default function() {
  const { authenticated, handleLogout } = React.useContext(AuthContext);
  const [screenWidth, setScreenWidth] = React.useState(screen.width);

  return (
    <main>
      <Routes>
        {screenWidth < 830 ? (
          <Route path="*" element={<UnsupportedMobile />} />
        ) : (
          <>
            <Route path="/" element={authenticated ? <Home /> : <Navigate replace to="/auth" />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/funcionarios" element={authenticated ? <Funcionarios /> : <Navigate replace to="/auth" />} />
            <Route path="/sinteticas" element={authenticated ? <Sinteticas /> : <Navigate replace to="/auth" />} />
            <Route path="/analiticas" element={authenticated ? <Analiticas /> : <Navigate replace to="/auth" />} />
            <Route path="/lancamentos-englobados" element={authenticated ? <Lancamentos /> : <Navigate replace to="/auth" />} />
            <Route path="/centros-custos" element={authenticated ? <CentrosCustos /> : <Navigate replace to="/auth" />} />
            <Route path="/relatorios" element={authenticated ? <Funcionarios /> : <Navigate replace to="/auth" />} />
            <Route path="/planos-contas" element={authenticated ? <PlanosContas /> : <Navigate replace to="/auth" />} />
            <Route path="*" element={authenticated ? <Navigate replace to="/"/> : <Navigate replace to="/auth" /> } />
          </>
        )}
      </Routes>
    </main>
  );
}
