import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getConnectedWallet, type WalletAdapter } from "@/lib/aptos";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

export default function WalletConnect() {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    const wallet = await getConnectedWallet();
    if (wallet) {
      try {
        const account = await wallet.account();
        setWallet(wallet);
        setAddress(account.address);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function connect() {
    try {
      const wallet = await getConnectedWallet();
      if (!wallet) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Petra or Martian wallet",
          variant: "destructive"
        });
        return;
      }

      await wallet.connect();
      const account = await wallet.account();
      setWallet(wallet);
      setAddress(account.address);
    } catch (e) {
      console.error(e);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    }
  }

  async function disconnect() {
    if (!wallet) return;
    
    try {
      await wallet.disconnect();
      setWallet(null);
      setAddress("");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {address ? (
        <>
          <span className="text-sm text-muted-foreground">
            {address.slice(0,6)}...{address.slice(-4)}
          </span>
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
