import React from "react";
import { ChainId, DAppProvider } from "@usedapp/core";
import Minter from "./components/Minter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]:
      "https://rinkeby.infura.io/v3/d014af161a4b4ffbaa358366e232e2c8",
  },
  supportedChains: [ChainId.Rinkeby],
};

const App = () => {
  return (
    <DAppProvider config={config}>
      <ToastContainer toastStyle={{ backgroundColor: "#34274a" }} />
      <Minter />
    </DAppProvider>
  );
};

export default App;
