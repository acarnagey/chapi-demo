import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as credentialHandlerPolyfill from "credential-handler-polyfill";

import HomePage from "./HomePage";
import WalletGetPage from "./WalletGetPage";
import WalletStorePage from "./WalletStorePage";
import WalletWorkerPage from "./WalletWorkerPage";

const App = () => {
  useEffect(() => {
    if (!window.__chapi__run__once) {
      (async () => {
        await credentialHandlerPolyfill.loadOnce();
        console.log("Ready to work with credentials!");
      })();
    }
    window.__chapi__run__once = true;
  }, []);
  return (
    <>
      {/* {window.__chapi__run__once && ( */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="wallet.html" element={<WalletWorkerPage />} /> */}
          <Route path="wallet-get" element={<WalletGetPage />} />
          <Route path="wallet-store" element={<WalletStorePage />} />
        </Routes>
      </BrowserRouter>
      {/* )} */}
    </>
  );
};

export default App;
