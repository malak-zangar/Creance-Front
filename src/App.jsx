import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import ArchivedEncaissements from "./pages/Encaissements/ArchivedEncaissements";
import ActifEncaissements from "./pages/Encaissements/ActifEncaissements";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route  path="login" element={<Login/>} />

        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<ListeClients />} />
          <Route path="clients/archive" element={<ArchivedClients/>}/>
          <Route path="clients/actif" element={<ActifClients/>}/>
          <Route path="factures" element={<ListeFactures/>}/>
          <Route path="factures/actif" element={<ActifFactures/>}/>
          <Route path="factures/archive" element={<ArchivedFactures/>}/>
          <Route path="encaissements" element={<ListeEncaissements/>}/>
          <Route path="encaissements/actif" element={<ActifEncaissements/>}/>
          <Route path="encaissements/archive" element={<ArchivedEncaissements/>}/>

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
