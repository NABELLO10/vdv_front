import React, { lazy, Suspense } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import AuthLayout from "./layout/AuthLayout"
import RutaProtegida from "./layout/RutaProtegida"
import {AuthProvider} from './context/authProvider'
import {AdicionalesProvider} from './context/adicionalesProvider'
import Spinner from "./components/animaciones/Spinner";

const Login = lazy(() => import("./pages/auth/Login"));
const OlvidePassword = lazy(() => import("./pages/auth/OlvidePassword"));
const NuevoPassword = lazy(() => import("./pages/auth/NuevoPassword"));
const CambiarPassword = lazy(() => import("./pages/auth/CambiarPassword"));

const Inicio = lazy(() => import("./pages/Inicio"));

const Usuarios = lazy(() => import("./pages/mantenedores/Usuarios"));
const Perfiles = lazy(() => import("./pages/mantenedores/Perfiles"));


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdicionalesProvider>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              <Route
                path="olvide-password/:token"
                element={<NuevoPassword />}
              />
              <Route path="primer-ingreso/:token" element={<NuevoPassword />} />
            </Route>

            <Route path="/admin" element={<RutaProtegida />}>
              <Route index element={<Inicio />} />
              <Route path="actualizar-password" element={<CambiarPassword />} />

              <Route path="usuarios" element={<Usuarios />} />              
              <Route path="perfil" element={<Perfiles />} />

             
            </Route>
          </Routes>
          </Suspense>
        </AdicionalesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
