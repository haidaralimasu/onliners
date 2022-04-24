import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { useEthers } from "@usedapp/core";
import logo from "./logo.png";
import axios from "axios";
import { ethers } from "ethers";
import { address } from "../contracts";
import nftabi from "../contracts/NFT.json";
import { connectionError, mintError, mintSuccess } from "../helper";
import {
  useTotalSupply,
  useMaxSupply,
  useNftPerAddressLimit,
  useMaxMintAmount,
  useCost,
  useWeiCost,
  useOnlyWhitelisted,
  useAddressMintedBalance,
} from "../hooks";

const Minter = () => {
  const { account, activateBrowserWallet } = useEthers();
  const [amount, setAmount] = useState(1);
  const [minting, setMinting] = useState(false);
  const totalSupply = useTotalSupply();
  const maxSupply = useMaxSupply();
  const maxMintAmount = useMaxMintAmount();
  const isOnlyWhitelisted = useOnlyWhitelisted();
  const limit = useNftPerAddressLimit();
  // eslint-disable-next-line
  const isWhitelistedUser = false;
  const balance = useAddressMintedBalance(account);
  const weiCost = useWeiCost();
  const [error, setError] = useState("");
  const cost = useCost();
  const [hexProof, setHexProof] = useState([]);
  const nftInterface = new ethers.utils.Interface(nftabi);

  useEffect(() => {
    loadProof();
  });

  const onError = () => {
    connectionError();
  };

  const increaseAmount = () => {
    if (amount < maxMintAmount) {
      setAmount(amount + 1);
    }
  };
  const decreaseAmount = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };

  const proof = async () => {
    const res = await axios.get(`http://localhost:8000/get-proof/${account}`);
    return res;
  };

  console.log(hexProof.data);

  const loadProof = () => {
    proof()
      .then((data) => {
        if (data.error) {
          setError(error);
          // console.log(error);
        } else {
          setHexProof(data);
        }
      })
      .catch((error) => console.log(error));
  };

  async function handleWhitelistMint() {
    try {
      setMinting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let nftcontract = new ethers.Contract(address, nftInterface, signer);
      const txCost = Number(weiCost) * amount;
      let transaction = await nftcontract.whiteListedMint(
        hexProof.data,
        amount,
        {
          value: txCost.toString(),
          // gasLimit: "25000",
        }
      );
      await transaction.wait();
      setMinting(false);
      mintSuccess();
    } catch (error) {
      mintError(error.message);
      setMinting(false);
    }
  }

  async function handleMint() {
    try {
      setMinting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const txCost = Number(weiCost) * amount;
      /* next, create the item */
      let nftcontract = new ethers.Contract(address, nftInterface, signer);
      let transaction = await nftcontract.mint(amount, {
        value: txCost.toString(),
      });
      await transaction.wait();
      setAmount(1);
      setMinting(false);
      mintSuccess();
    } catch (error) {
      mintError(error.message);
      console.log(error);
      setAmount(1);
      setMinting(false);
    }
  }

  return (
    <div>
      <div className="container">
        <div className="logo">
          <img style={{ marginBottom: "30px" }} src={logo} alt="logo" />
        </div>
        <h1 style={{ marginBottom: "20px" }}>
          {totalSupply}/{maxSupply}
        </h1>
        {account ? (
          <>
            {isOnlyWhitelisted ? (
              <div>
                {minting ? (
                  <Button buttonSize="btn--wide" buttonColor="blue">
                    Please Wait
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => decreaseAmount()}
                      className="margin-btn"
                      buttonSize="btn--medium"
                      buttonColor="blue"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => handleWhitelistMint()}
                      buttonSize="btn--wide"
                      buttonColor="blue"
                    >
                      Mint {amount} Onliners
                    </Button>
                    <Button
                      onClick={() => increaseAmount()}
                      className="margin-btn"
                      buttonSize="btn--medium"
                      buttonColor="blue"
                    >
                      +
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div>
                {minting ? (
                  <Button buttonSize="btn--wide" buttonColor="blue">
                    Please Wait
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => decreaseAmount()}
                      className="margin-btn"
                      buttonSize="btn--medium"
                      buttonColor="blue"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => handleMint()}
                      buttonSize="btn--wide"
                      buttonColor="blue"
                    >
                      Mint {amount} Onliners
                    </Button>
                    <Button
                      onClick={() => increaseAmount()}
                      className="margin-btn"
                      buttonSize="btn--medium"
                      buttonColor="blue"
                    >
                      +
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <Button
            onClick={() => activateBrowserWallet(onError)}
            buttonSize="btn--wide"
            buttonColor="blue"
          >
            Connect
          </Button>
        )}
        <div style={{ textAlign: "center" }}>
          <p style={{ marginTop: "20px" }}>
            Price: {cost} {ethers.constants.EtherSymbol}
          </p>
          {isOnlyWhitelisted ? (
            <p style={{ marginTop: "10px" }}>Status: Presale</p>
          ) : (
            <p style={{ marginTop: "10px" }}>Status: Publicsale</p>
          )}
          <p style={{ marginTop: "10px" }}>
            Your Mint: {balance}/{limit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Minter;
