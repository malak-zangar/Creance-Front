import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./layouts/Main";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ListeClients from "./pages/Clients/ListeClients";
import ArchivedClients from "./pages/Clients/ArchivedClients";
import ActifClients from "./pages/Clients/ActifClients";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route  path="login" element={<Login/>} />

        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="allClients" element={<ListeClients />} />
          <Route path="ArchivedClients" element={<ArchivedClients/>}/>
          <Route path="ActifClients" element={<ActifClients/>}/>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
