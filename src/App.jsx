import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Main from "./layouts/Main";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Utilisateurs/Login";
import ListeClients from "./pages/Clients/ListeClients";
import ArchivedClients from "./pages/Clients/ArchivedClients";
import ArchivedFactures from "./pages/Factures/ArchivedFactures";
import ActifFactures from "./pages/Factures/ActifFactures";
import ListeEncaissements from "./pages/Encaissements/ListeEncaissements";
import ValidateFacture from "./pages/Factures/ValidateFacture";
import { isAuthenticated } from "./utils/auth";
import { AuthProvider } from "./context/AuthContext";
import EntrepParamHistorique from "./pages/EntrepParam/EntrepParamHistorique";
import EntrepParamActuel from "./pages/EntrepParam/EntrepParamActuel";
import AllExpiredContracts from "./pages/Contrats/ExpiredContracts";
import ActifContracts from "./pages/Contrats/ActifContracts";
import HistoriqueClientContrat from "./pages/Clients/HistoriqueClientContrat";
import HistoriqueClientFacture from "./pages/Clients/HistoriqueClientFacture";
import { ConfigProvider, FloatButton, theme } from "antd";
import React, { useState } from "react";
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import Profile from "./pages/Utilisateurs/Profile";
import ResetPassword from "./pages/Utilisateurs/ResetPassword";
import SaisirEmail from "./pages/Utilisateurs/SaisirEmail";
import Signup from "./pages/Utilisateurs/Signup";

function App() {
  const [themeCode, setThemeCode] = useState("light");
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2f54eb",
          colorInfo: "#2f54eb",
        },
        algorithm:
          themeCode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                    path="/resetPassword"
                    element={<ResetPassword />}
                  />
                    <Route
                    path="/sendEmail"
                    element={<SaisirEmail />}
                  />
            <Route path="/" element={<Main />}>
         
              {isAuthenticated() && (
                <>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  <Route path="clients" element={<ListeClients />} />
                  <Route path="clients/archive" element={<ArchivedClients />} />
                  <Route
                    path="clients/historique/contrat/:clientId"
                    element={<HistoriqueClientContrat />}
                  />
                  <Route
                    path="clients/historique/facture/:param"
                    element={<HistoriqueClientFacture />}
                  />
                  <Route path="factures/actif" element={<ActifFactures />} />
                  <Route
                    path="factures/archive"
                    element={<ArchivedFactures />}
                  />
                  <Route
                    path="factures/valider/:param"
                    element={<ValidateFacture />}
                  />
                  <Route
                    path="encaissements"
                    element={<ListeEncaissements />}
                  />
                  <Route path="contrats/actif" element={<ActifContracts />} />
                  <Route
                    path="contrats/archive"
                    element={<AllExpiredContracts />}
                  />

                  <Route
                    path="parametres/actuels"
                    element={<EntrepParamActuel />}
                  />
                  <Route
                    path="parametres/historique"
                    element={<EntrepParamHistorique />}
                  />
                  <Route
                    path="profile"
                    element={<Profile />}
                  />
                     
                </>
              )}
            </Route>
          </Routes>
          <FloatButton
            type="primary"
            icon={themeCode === "light" ? <BulbFilled /> : <BulbOutlined />}
            onClick={() => {
              console.log(themeCode === "light" ? "dark" : "light")
              setThemeCode(themeCode === "light" ? "dark" : "light");
            }}
            style={{
              position: 'fixed',
              bottom: '20px',      
              left: '20px',  
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
