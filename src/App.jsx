import { Route, Routes, BrowserRouter } from 'react-router-dom';
import "./App.css";
import Main from "./layouts/Main";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import ListeClients from "./pages/Clients/ListeClients";
import ArchivedClients from "./pages/Clients/ArchivedClients";
import ActifClients from "./pages/Clients/ActifClients";
import ListeFactures from "./pages/Factures/ListeFactures";
import ArchivedFactures from "./pages/Factures/ArchivedFactures";
import ActifFactures from "./pages/Factures/ActifFactures";
import ListeEncaissements from "./pages/Encaissements/ListeEncaissements";
import AllContracts from "./pages/Contrats/AllContracts";
import ValidateFacture from "./pages/Factures/ValidateFacture";
import { isAuthenticated } from "./utils/auth";
import { AuthProvider } from './context/AuthContext';
import EntrepParamHistorique from './pages/EntrepParam/EntrepParamHistorique';
import EntrepParamActuel from './pages/EntrepParam/EntrepParamActuel';


function App() {
  return (
    <BrowserRouter>
          <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
       
        <Route path="/" element={<Main />}>
        {isAuthenticated() && (
            <>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
 
              <Route path="clients" element={<ListeClients />} />
              <Route path="clients/archive" element={<ArchivedClients />} />
              <Route path="clients/actif" element={<ActifClients />} />
              <Route path="factures" element={<ListeFactures />} />
              <Route path="factures/actif" element={<ActifFactures />} />
              <Route path="factures/archive" element={<ArchivedFactures />} />
              <Route path="factures/valider/:param" element={<ValidateFacture />} />
              <Route path="encaissements" element={<ListeEncaissements />} />
              <Route path="contrats" element={<AllContracts />} />
              <Route path="parametres/actuels" element={<EntrepParamActuel />} />
              <Route path="parametres/historique" element={<EntrepParamHistorique />} />

            </>
          )}
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
