import { Button, Card, Link, Typography } from "@mui/material";
import { Container } from "@mui/system";
import * as credentialHandlerPolyfill from "credential-handler-polyfill";
import { useEffect, useState } from "react";

// import presentation from "./presentation.json";
import credentialQuery from "./credentialQuery.json";

const App = () => {
  const [presentation, setPresentation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGet = async () => {
    console.log("Requesting credential...");
    setIsLoading(true);
    // const credentialQuery = { web: {} }; // TODO: Update to something more useful
    const webCredential = await navigator.credentials.get(credentialQuery);
    setPresentation(webCredential);
    setIsLoading(false);
    if (!webCredential) {
      console.log("no credentials received");
    }
  };

  // const handleStore = async () => {
  //   const webCredential = new global.WebCredential(
  //     presentation.type,
  //     presentation
  //   );
  //   const result = await navigator.credentials.store(webCredential);
  //   if (!result) {
  //     console.log("store credential operation did not succeed");
  //   }
  // };

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
      <Container>
        <Card>
          <Typography variant="h5">
            Credential Handler API (CHAPI) Demo Verifier
          </Typography>
          <Typography>
            If you have not yet picked a wallet and registered it with your
            browser, try out the
          </Typography>
          <Link href="#">Demo Wallet</Link>
          <Typography>
            This is a minimal credential Verifier application that demonstrates
            how an app would ask the user for a credential (using CHAPI's{" "}
            <code>get()</code> under the hood).
          </Typography>
          <Typography>
            When you click the Request button, a Verifiable Credential will be
            requested from your digital wallet.
          </Typography>
          <Button onClick={handleGet}>Present a Credential</Button>
        </Card>
        {(presentation || isLoading) && (
          <Card>
            <Typography variant="h6">Result of get() operation:</Typography>
            <pre>
              {isLoading && (
                <code id="getResults">Requesting credential...</code>
              )}
              {presentation && (
                <code id="getResults">
                  {JSON.stringify(presentation, null, 2)}
                </code>
              )}
            </pre>
          </Card>
        )}
      </Container>
      {/* <Button onClick={handleStore}>
        Issuer, Recieve a Credential, Store()
      </Button>
      <Button onClick={handleGet}>Verifier, Present a Credential, Get()</Button> */}
    </div>
  );
};

export default App;
