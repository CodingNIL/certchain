import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Blockchain from "./pages/Blockchain";
import Merkle from "./pages/Merkle";
import Scanner from "./pages/Scanner";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Navbar from "./components/Navbar";

function App() {

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    setIsAuth(!!token);

  }, []);

  return (
    <BrowserRouter>

      {isAuth && <Navbar setIsAuth={setIsAuth} />}

      <Routes>

        {/* LANDING */}
        <Route
          path="/"
          element={<Login setIsAuth={setIsAuth} />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login setIsAuth={setIsAuth} />}
        />

        <Route
          path="/register"
          element={<Register setIsAuth={setIsAuth} />}
        />

        {/* PROTECTED */}
        <Route
          path="/upload"
          element={
            isAuth
              ? <Upload />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/verify"
          element={
            isAuth
              ? <Verify />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/blockchain"
          element={
            isAuth
              ? <Blockchain />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/merkle"
          element={
            isAuth
              ? <Merkle />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/scanner"
          element={
            isAuth
              ? <Scanner />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
