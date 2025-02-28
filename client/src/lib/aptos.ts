import { AptosClient, Types, AptosAccount, CoinClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<Types.HexEncodedBytes>;
  account(): Promise<Types.AccountData>;
}

export async function getConnectedWallet(): Promise<WalletAdapter | null> {
  // Check if Petra wallet exists
  if ("petra" in window) {
    return (window as any).petra;
  }
  
  // Check if Martian wallet exists  
  if ("martian" in window) {
    return (window as any).martian;
  }

  return null;
}

export async function mintCarbonCredits(wallet: WalletAdapter, amount: number) {
  const payload = {
    type: "entry_function_payload",
    function: "carbon_credits::mint",
    type_arguments: [],
    arguments: [amount]
  };

  return wallet.signAndSubmitTransaction(payload);
}

export async function listCarbonCredits(wallet: WalletAdapter, tokenId: string, price: number) {
  const payload = {
    type: "entry_function_payload", 
    function: "carbon_credits::list",
    type_arguments: [],
    arguments: [tokenId, price]
  };

  return wallet.signAndSubmitTransaction(payload);
}

export async function buyCarbonCredits(wallet: WalletAdapter, tokenId: string) {
  const payload = {
    type: "entry_function_payload",
    function: "carbon_credits::buy",
    type_arguments: [],
    arguments: [tokenId]
  };

  return wallet.signAndSubmitTransaction(payload);
}
