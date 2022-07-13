import { Button, Card, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
// import * as credentialHandlerPolyfill from "credential-handler-polyfill";
import * as WebCredentialHandler from "web-credential-handler";

// import { WALLET_LOCATION } from "./config";

const WalletGetPage = () => {
  const [username, setUsername] = useState(Cookies.get("username") || "");
  const [walletContents, setWalletContents] = useState(loadWalletContents());
  const [storeEvent, setStoreEvent] = useState(null);
  const vp =
    storeEvent && storeEvent.credentialRequestOptions
      ? storeEvent.credentialRequestOptions.web.VerifiablePresentation
      : null;
  let vc = null;
  // if (vp) {
  //   vc = Array.isArray(vp.verifiableCredential)
  //     ? vp.verifiableCredential[0]
  //     : vp.verifiableCredential;
  // }
  let query = null;
  if (vp) {
    query = Array.isArray(vp.query) ? vp.query[0] : vp.query;
    if (!query.type === "QueryByExample") {
      throw new Error(
        "Only QueryByExample requests are supported in demo wallet."
      );
    }
  }
  function loadWalletContents() {
    const walletContents = Cookies.get("walletContents");
    if (!walletContents) {
      return null;
    }
    return JSON.parse(atob(walletContents));
  }
  const login = () => {
    Cookies.set("username", "JohnDoe", {
      path: "",
      secure: true,
      sameSite: "None",
    });
    setUsername("JohnDoe");
  };
  const handleShare = async (vp) => {
    console.log("wrapping and returning vc:", vp);
    // button.sourceEvent.respondWith(
    //   Promise.resolve({ dataType: "VerifiablePresentation", data: vp })
    // );
    return await storeEvent.respondWith(
      Promise.resolve({ dataType: "VerifiablePresentation", data: vp })
    );
  };
  function getCredentialType(vc) {
    if(!vc) {
      return 'Credential'
    };
    const types = Array.isArray(vc.type) ? vc.type : [vc.type];
    return types.length > 1 ? types.slice(1).join('/') : types[0];
  }

  useEffect(() => {
    (async () => {
      const event = await WebCredentialHandler.receiveCredentialEvent();
      console.log("Wallet processing get() event:", event);
      setStoreEvent(event);
    })();

    // if (!window.__chapi__run__once) {
    //   (async () => {
    //     await credentialHandlerPolyfill.loadOnce();
    //     console.log("Ready to work with credentials!");
    //   })();
    // }
    // window.__chapi__run__once = true;
    // console.log('worker.html: Activating handler, WALLET_LOCATION:', WALLET_LOCATION);
    // WebCredentialHandler.activateHandler({
    //   // mediatorOrigin: MEDIATOR,
    //   async get(event) {
    //     console.log('WCH: Received get() event:', event);
    //     return {type: 'redirect', url: WALLET_LOCATION + 'wallet-ui-get.html'};
    //   },
    //   async store(event) {
    //     console.log('WCH: Received store() event:', event);
    //     return {type: 'redirect', url: WALLET_LOCATION + 'wallet-ui-store.html'};
    //   }
    // })
  }, []);
  return (
    <Container>
      {storeEvent && (
        <Card>
          <Typography variant="h5">Wallet get() event</Typography>
          <Box>
            <Typography>
              Origin {storeEvent.credentialRequestOrigin} is requesting
              information:
            </Typography>
            <Typography>{query.credentialQuery.reason}</Typography>
          </Box>
          <Box>
            <Typography>Logged in:</Typography>
            <Button>Reset and Logout</Button>
            <Typography variant="h6">Wallet Contents:</Typography>
            <ol id="walletContents">
              {walletContents === null && "none"}
              {walletContents &&
                Object.entries(walletContents).map(([key, value]) => {
                  const vc = Array.isArray(value.verifiableCredential)
                    ? value.verifiableCredential[0]
                    : value.verifiableCredential;
                  debugger;
                  return (
                    <li key={key}>
                      <Button onClick={(e) => handleShare(value)}>Share</Button>
                      {`${getCredentialType(vc)} from ${vc.issuer}`}
                    </li>
                  );
                })}
            </ol>
          </Box>
        </Card>
      )}
      {!username && (
        <Card>
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
        </Card>
      )}
    </Container>
  );
};

export default WalletGetPage;
