import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./layouts/Main";
import Profile from "./pages/Profile";
import Aboutus from "./pages/Aboutus";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<Aboutus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
