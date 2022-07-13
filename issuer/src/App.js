import { Button, Card, Link, Typography } from "@mui/material";
import * as credentialHandlerPolyfill from "credential-handler-polyfill";
import { useEffect, useState } from "react";

import presentation from "./presentation1.json";

const App = () => {
  // const handleGet = async () => {
  //   const credentialQuery = { web: {} }; // TODO: Update to something more useful
  //   const webCredential = await navigator.credentials.get(credentialQuery);

  //   if (!webCredential) {
  //     console.log("no credentials received");
  //   }
  // };
  const [isLoading, setIsLoading] = useState(false);
  const [storeResults, setStoreResults] = useState("");

  const handleStore = async () => {
    const webCredential = new global.WebCredential(
      presentation.type,
      presentation
    );
    setIsLoading(true);
    const result = await navigator.credentials.store(webCredential);
    console.log("Result of receiving via store() request:", result);
    setStoreResults(JSON.stringify(result, null, 2));
    setIsLoading(false);
    // if (!result) {
    //   console.log("store credential operation did not succeed");
    // }
  };

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
    <div className="App">
      <Card>
        <Typography variant="h5">
          Credential Handler API (CHAPI) Demo Issuer
        </Typography>
        <Typography>
          If you have not yet picked a wallet and registered it with your
          browser, try out the
        </Typography>
        <Link href="#">Demo Wallet</Link>
        <Typography>
          This is a minimal credential Issuer application that demonstrates how
          a user would ask for a credential to be issued (using CHAPI's{" "}
          <code>store()</code> under the hood).
        </Typography>
        <Typography>
          When you click the Receive button, a Verifiable Credential will be
          issued and sent to your digital wallet for storage.
        </Typography>
        <Button onClick={handleStore}>Receive a Credential</Button>
      </Card>
      <Card>
        <Typography variant="h6">Result of store() operation:</Typography>
        <pre>
          <code id="storeResults">
            {isLoading && "Storing credential..."}
            {!isLoading && storeResults}
          </code>
        </pre>
      </Card>
      {/* <Button onClick={handleStore}>
        Issuer, Recieve a Credential, Store()
      </Button>
      <Button onClick={handleGet}>Verifier, Present a Credential, Get()</Button> */}
    </div>
  );
};

export default App;
