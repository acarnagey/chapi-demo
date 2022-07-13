import { Paper, Typography, Card, Button } from "@mui/material";
import * as credentialHandlerPolyfill from "credential-handler-polyfill";
import * as WebCredentialHandler from "web-credential-handler";
import { useEffect, useState } from "react";

// import presentation from "./presentation.json";
import { MEDIATOR, WALLET_LOCATION } from "./config";
import { Box } from "@mui/system";
import Cookies from "js-cookie";

const HomePage = () => {
  const [username, setUsername] = useState(Cookies.get("username") || "");
  const [walletContents, setWalletContents] = useState(loadWalletContents());

  function loadWalletContents() {
    const walletContents = Cookies.get("walletContents");
    if (!walletContents) {
      return null;
    }
    return JSON.parse(atob(walletContents));
  }

  // const handleGet = async () => {
  //   const credentialQuery = { web: {} }; // TODO: Update to something more useful
  //   const webCredential = await navigator.credentials.get(credentialQuery);

  //   if (!webCredential) {
  //     console.log("no credentials received");
  //   }
  // };

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

  // Registers this demo wallet with the current user's browser
  const installWallet = async () => {
    console.log("Registering wallet...");
    try {
      // cors issue
      // await credentialHandlerPolyfill.loadOnce(MEDIATOR);
      await credentialHandlerPolyfill.loadOnce();
    } catch (e) {
      console.error("Error in loadOnce:", e);
    }
    console.log("Polyfill loaded.");
    const workerUrl = `${WALLET_LOCATION}/wallet-worker`;
    console.log("Installing wallet worker handler at:", workerUrl);

    try {
      await WebCredentialHandler.installHandler();
      console.log("Wallet installed.");
    } catch (e) {
      console.error("Wallet installation failed", e);
    }
    // const registration = await WebCredentialHandler.installHandler({
    //   url: workerUrl,
    // });
    // await registration.credentialManager.hints.set("test", {
    //   name: "TestUser",
    //   enabledTypes: [
    //     "VerifiablePresentation",
    //     "VerifiableCredential",
    //     "UniversityDegreeCredential",
    //   ],
    // });
    // console.log("Wallet registered.");
  };

  const login = () => {
    Cookies.set("username", "JohnDoe", {
      path: "",
      secure: true,
      sameSite: "None",
    });
    setUsername("JohnDoe");
  };

  const logout = () => {
    Cookies.remove("username", { path: "" });
    setUsername("");
    Cookies.remove("walletContents", { path: "" });
    setWalletContents(null);
  };

  useEffect(() => {
    if (!window.__chapi__run__once) {
      (async () => {
        await installWallet();
      })();
    }
    window.__chapi__run__once = true;
  }, []);

  return (
    <div className="App">
      <Paper>
        <Typography variant="h5">Demo Wallet</Typography>
        <Typography>
          By clicking 'Accept' on page load, you have registered this page with
          your browser, and now it can act as a test wallet.{" "}
        </Typography>

        {username && (
          <Card>
            <Box>
              <Typography>Logged in: {username}</Typography>
              <Typography variant="h6">Wallet Contents:</Typography>
              <ol id="walletContents">
                {walletContents === null && "none"}
                {walletContents &&
                  Object.entries(walletContents).map(([key, value]) => (
                    <li key={key}>{key}</li>
                  ))}
              </ol>
            </Box>
            <Button onClick={logout}>Reset and Logout</Button>
          </Card>
        )}
        {!username && (
          <Card>
            <Box>
              <Typography>
                To start using the wallet, click the Login button.
              </Typography>
              <Typography>
                For purposes of this demo, we will skip Registration and just
                use a test account.
              </Typography>
              <Button onClick={login}>Login</Button>
            </Box>
          </Card>
        )}
      </Paper>
    </div>
  );
};

export default HomePage;
