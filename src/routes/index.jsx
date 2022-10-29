import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import Usuarios from "../pages/Usuarios";
import Login from '../pages/Login';
import Pessoas from '../pages/Pessoas';
import Sinteticas from '../pages/Sinteticas';
import CentrosCustos from '../pages/CentrosCustos';
import Analiticas from '../pages/Analiticas';
import PlanosContas from '../pages/PlanosContas';
import Impostos from '../pages/Impostos';

import UnsupportedMobile from '../pages/UnsupportedMobile';

import { AuthContext } from '../contexts/AuthContext';
import LancamentosEnglobados from '../pages/LancamentosEnglobados';
import Bancos from '../pages/Bancos';
import Lancamentos from '../pages/Lancamentos';

export default function() {
  const { authenticated } = React.useContext(AuthContext);
  const [screenWidth, setScreenWidth] = React.useState(screen.width);

  return (
    <main>
      <Routes>
        {screenWidth < 830 ? (
          <Route path="*" element={<UnsupportedMobile />} />
        ) : (
          <>
            <Route path="/" element={authenticated ? <LancamentosEnglobados /> : <Navigate replace to="/auth" />} />
            <Route path="/auth" element={authenticated ? <LancamentosEnglobados /> : <Login />} />
            <Route path="/usuarios" element={authenticated ? <Usuarios /> : <Navigate replace to="/auth" />} />
            <Route path="/sinteticas" element={authenticated ? <Sinteticas /> : <Navigate replace to="/auth" />} />
            <Route path="/analiticas" element={authenticated ? <Analiticas /> : <Navigate replace to="/auth" />} />
            <Route path="/impostos" element={authenticated ? <Impostos /> : <Navigate replace to="/auth" />} />
            <Route path="/lancamentos-englobados" element={authenticated ? <LancamentosEnglobados /> : <Navigate replace to="/auth" />} />
            <Route path="/lancamentos-englobados/:englobadosId/lancamentos" element={authenticated ? <Lancamentos  /> : <Navigate replace to="/auth" />}/>
            <Route path="/centros-custos" element={authenticated ? <CentrosCustos /> : <Navigate replace to="/auth" />} />
            <Route path="/planos-contas" element={authenticated ? <PlanosContas /> : <Navigate replace to="/auth" />} />
            <Route path="/bancos" element={authenticated ? <Bancos /> : <Navigate replace to="/auth" />} />
            <Route path="/pessoas" element={authenticated ? <Pessoas /> : <Navigate replace to="/auth" />} />
            <Route path="*" element={authenticated ? <Navigate replace to="/"/> : <Navigate replace to="/auth" /> } />
          </>
        )}
      </Routes>
    </main>
  );
}
