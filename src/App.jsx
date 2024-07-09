import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./layouts/Main";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ListeClients from "./pages/Clients/ListeClients";
import ArchivedClients from "./pages/Clients/ArchivedClients";
import ActifClients from "./pages/Clients/ActifClients";
import ListeFactures from "./pages/Factures/ListeFactures";
import ArchivedFactures from "./pages/Factures/ArchivedFactures";
import ActifFactures from "./pages/Factures/ActifFactures";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route  path="login" element={<Login/>} />

        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="clients" element={<ListeClients />} />
          <Route path="clients/archive" element={<ArchivedClients/>}/>
          <Route path="clients/actif" element={<ActifClients/>}/>
          <Route path="factures" element={<ListeFactures/>}/>
          <Route path="factures/actif" element={<ActifFactures/>}/>
          <Route path="factures/archive" element={<ArchivedFactures/>}/>

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
