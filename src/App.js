import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SongsProvider, { SongsContext } from "./context/SongsProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastComponent } from "./components";

import { Heading, Content } from "./layouts";
import { FirstEntry, WebSocket } from "./components";
import { AdminPage } from "./pages";

import "./App.css";
import axios from "axios";

const App = () => {
  //const { '34.116.238.114' } = useContext(SongsContext)

  const [dataFromLocalStorage, setDataFromLocalStorage] = useState(
    localStorage.getItem("key") || ""
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setDataFromLocalStorage(localStorage.getItem("key") || "");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  useEffect(() => {
    const handleLogout = async () => {
      const userId = localStorage.getItem("userId");
      try {
        await axios.post(
          `http://${"34.116.238.114"}/logout`,
          JSON.stringify(userId),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {}
    };

    const handleUnload = () => {
      // Wywołaj odpowiednią funkcję lub wykonaj inne operacje, kiedy strona jest odświeżana lub zamykana
      handleLogout();
      // Możesz umieścić tutaj kod, który chcesz uruchomić przed odświeżeniem lub zamknięciem strony
    };

    const handleBeforeUnload = () => {
      // Wywołaj funkcję handleLogout, ale nie przerywaj procesu wyjścia ze strony
      handleLogout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      // Usuń nasłuchiwanie zdarzenia po odmontowaniu komponentu
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      handleLogout();
    };
  }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const handleLogout = async () => {
      try {
        await axios.post(
          `http://${"34.116.238.114"}/logout`,
          JSON.stringify(userId),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {}
    };
    if (userId) {
      handleLogout();
    }
  }, []);

  const handleShowToast = () => {
    toast.success(<ToastComponent message="Identyfikacja powiodła się" />, {
      autoClose: 2000,
    });
  };

  const MainPage = () => (
    <>
      <div className="app">
        <div className="app__container">
          <Heading data={dataFromLocalStorage} />
          <Content data={dataFromLocalStorage} />
        </div>
        <FirstEntry handleShowToast={handleShowToast} />
      </div>
      <WebSocket />
      <ToastContainer />
    </>
  );

  const ErrorPage = () => (
    <div className="app__error">
      <h1>Nie znaleziono podanej strony</h1>
    </div>
  );

  return (
    <SongsProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </SongsProvider>
  );
};

export default App;
