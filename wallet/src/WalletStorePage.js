import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/system";
import { Button, Card, Typography } from "@mui/material";
import * as WebCredentialHandler from "web-credential-handler";
import Cookies from "js-cookie";

// import { WALLET_LOCATION } from "./config";
// let storeEvent = {};
const WalletStorePage = () => {
  const [username, setUsername] = useState(Cookies.get("username") || "");
  const [storeEvent, setStoreEvent] = useState({});
  const [walletContents, setWalletContents] = useState(loadWalletContents());
  const [isConfirming, setIsConfirming] = useState(true);
  // console.log("event", storeEvent);

  function loadWalletContents() {
    const walletContents = Cookies.get("walletContents");
    if (!walletContents) {
      return null;
    }
    return JSON.parse(atob(walletContents));
  }
  let vp =
    storeEvent && storeEvent.credential && storeEvent.credential.data
      ? storeEvent.credential.data
      : {};
  // debugger;
  let vc = {};
  if (vp && vp.verifiableCredential) {
    vc = Array.isArray(vp.verifiableCredential)
      ? vp.verifiableCredential[0]
      : vp.verifiableCredential;
  }
  // console.log(vc);
  useEffect(() => {
    (async () => {
      const newEvent = await WebCredentialHandler.receiveCredentialEvent();
      //   console.log("Store Credential Event:", newEvent.type, newEvent);
      //   // setStoreEvent(newEvent);
      setStoreEvent(newEvent);
    })();
  }, []);

  // function returnToUser(storeEvent, data) {
  //   console.log(storeEvent);
  //   storeEvent.respondWith(
  //     new Promise((resolve) => {
  //       return data
  //         ? resolve({ dataType: "VerifiablePresentation", data })
  //         : resolve(null);
  //     })
  //   );
  // }

  const handleConfirm = () => {
    setIsConfirming(false);
    storeInWallet();
  };

  const handleCancel = () => {
    storeEvent.respondWith(
      new Promise((resolve) => {
        return resolve(null);
      })
    ); // Do nothing, close the CHAPI window
  };

  const handleDone = () => {
    storeEvent.respondWith(
      new Promise((resolve) => {
        return storeEvent.credential.data
          ? resolve({
              dataType: "VerifiablePresentation",
              data: storeEvent.credential.data,
            })
          : resolve(null);
      })
    );
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

  const getCredentialId = (vp) => {
    const vc = Array.isArray(vp.verifiableCredential)
      ? vp.verifiableCredential[0]
      : vp.verifiableCredential;
    return vc.id;
  };

  const storeInWallet = () => {
    const walletContents = loadWalletContents() || {};
    const id = getCredentialId(vp);
    walletContents[id] = vp;

    // base64 encode the serialized contents (verifiable presentations)
    const serialized = btoa(JSON.stringify(walletContents));
    Cookies.set("walletContents", serialized, {
      path: "",
      secure: true,
      sameSite: "None",
    });
    setWalletContents(loadWalletContents());
  };

  return (
    <Container>
      <Typography variant="h5">Wallet store() event</Typography>
      <Card>
        {username && (
          <>
            {isConfirming && (
              <Box>
                <Typography>Do you wish to store this credential?</Typography>
                <Typography>type: {vc.type}</Typography>
                <Typography>issuer: {vc.issuer}</Typography>
                <Button onClick={handleConfirm}>Confirm</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Box>
            )}
            {!isConfirming && (
              <Box>
                <Typography>Loggin in: {username}</Typography>
                <Button onClick={logout}>Reset and Logout</Button>
                <Typography>Creadential stored!</Typography>
                <Typography variant="h6">Wallet Contents:</Typography>
                <ol id="walletContents">
                  {walletContents === null && "none"}
                  {walletContents &&
                    Object.entries(walletContents).map(([key, value]) => (
                      <li key={key}>{key}</li>
                    ))}
                </ol>
                <Button onClick={handleDone}>Done</Button>
              </Box>
            )}
          </>
        )}

        {!username && (
          <Box>
            <Typography>In order to store a credential:</Typography>
            <ol>
              <li>
                Register a wallet with your browser (for example, the{" "}
                <a href="/#">Demo Wallet</a>
                ).
              </li>
              <li>
                Click the <strong>Login</strong> button.
              </li>
            </ol>
            <Button onClick={login}>Login</Button>
          </Box>
        )}
      </Card>
      <pre>{JSON.stringify(storeEvent, null, 2)}</pre>
    </Container>
  );
};

export default WalletStorePage;
