import React, { useEffect } from "react";
// import * as credentialHandlerPolyfill from "credential-handler-polyfill";
import * as WebCredentialHandler from "web-credential-handler";

import { WALLET_LOCATION } from "./config";

const WalletWorkerPage = () => {
  useEffect(() => {
    //   if (!window.__chapi__run__once) {
    //     (async () => {
    //       await credentialHandlerPolyfill.loadOnce();
    //       console.log("Ready to work with credentials!");
    //     })();
    //   }
    //   window.__chapi__run__once = true;
    if (window.__chapi__run__once) {
      console.log(
        "worker.html: Activating handler, WALLET_LOCATION:",
        WALLET_LOCATION
      );
      WebCredentialHandler.activateHandler({
        // mediatorOrigin: MEDIATOR,
        async get(event) {
          console.log("WCH: Received get() event:", event);
          return {
            type: "redirect",
            url: WALLET_LOCATION + "/wallet-get",
          };
        },
        async store(event) {
          console.log("WCH: Received store() event:", event);
          return {
            type: "redirect",
            url: WALLET_LOCATION + "/wallet-store",
          };
        },
      });
    }
  }, []);
  return <></>;
};

export default WalletWorkerPage;
