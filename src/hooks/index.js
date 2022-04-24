import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";
import nftabi from "../contracts/NFT.json";
import { address } from "../contracts";
import { formatUnits } from "ethers/lib/utils";

const nftInterface = new ethers.utils.Interface(nftabi);

export function useTotalSupply() {
  const [totalSupply] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "totalSupply",
      args: [],
    }) ?? [];
  const formatedTotoalSupply = totalSupply ? totalSupply.toNumber() : 0;
  return formatedTotoalSupply;
}

export function useMaxMintAmount() {
  const [maxMintAmount] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "maxMintAmount",
      args: [],
    }) ?? [];
  const formatedTotoalSupply = maxMintAmount ? maxMintAmount.toNumber() : 0;
  return formatedTotoalSupply;
}

export function useNftPerAddressLimit() {
  const [nftPerAddressLimit] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "nftPerAddressLimit",
      args: [],
    }) ?? [];
  const formatedNftPerAddressLimit = nftPerAddressLimit
    ? nftPerAddressLimit.toNumber()
    : 0;
  return formatedNftPerAddressLimit;
}

export function useMaxSupply() {
  const [maxSupply] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "maxSupply",
      args: [],
    }) ?? [];
  const formatedMaxSupply = maxSupply ? maxSupply.toNumber() : 0;
  return formatedMaxSupply;
}

export function useCost() {
  const [cost] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "cost",
      args: [],
    }) ?? [];
  const formattedCost = cost ? parseFloat(formatUnits(cost, 18)) : 0;
  return formattedCost;
}

export function useWeiCost() {
  const [cost] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "cost",
      args: [],
    }) ?? [];
  return cost;
}

export function useOnlyWhitelisted() {
  const [onlyWhitelisted] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "onlyWhitelisted",
      args: [],
    }) ?? [];
  return onlyWhitelisted;
}

export function useAddressMintedBalance(ownerAddress) {
  const [addressMintedBalance] =
    useContractCall({
      abi: nftInterface,
      address: address,
      method: "addressMintedBalance",
      args: [ownerAddress],
    }) ?? [];
  const formatedaddressMintedBalance = addressMintedBalance
    ? addressMintedBalance.toNumber()
    : 0;
  return formatedaddressMintedBalance;
}
