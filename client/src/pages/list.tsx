import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getConnectedWallet, buyCarbonCredits } from "@/lib/aptos";
import { apiRequest } from "@/lib/queryClient";
import type { CarbonCredit } from "@shared/schema";
import { motion } from "framer-motion";
import { Trash2, Leaf } from "lucide-react";
import { useState, useEffect } from "react";

export default function List() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentAddress, setCurrentAddress] = useState<string>("");

  useEffect(() => {
    async function checkWallet() {
      const wallet = await getConnectedWallet();
      if (wallet) {
        const account = await wallet.account();
        setCurrentAddress(account.address || "");
      }
    }
    checkWallet();
  }, []);

  const { data: credits, isLoading } = useQuery<CarbonCredit[]>({
    queryKey: ["/api/credits"]
  });

  const buyMutation = useMutation({
    mutationFn: async (credit: CarbonCredit) => {
      const wallet = await getConnectedWallet();
      if (!wallet) throw new Error("Please connect your wallet first");

      const account = await wallet.account();
      const buyerAddress = account.address;

      if (credit.owner === buyerAddress) {
        throw new Error("You cannot buy your own carbon credits");
      }

      try {
        await buyCarbonCredits(wallet, credit.tokenId);
        await apiRequest("PATCH", `/api/credits/${credit.id}`, {
          owner: buyerAddress,
          listed: false
        });
      } catch (error: any) {
        if (error.message.includes("carbon_credits::buy")) {
          throw new Error("Transaction failed. Please make sure you have enough APT tokens.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully purchased carbon credits"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (creditId: number) => {
      const wallet = await getConnectedWallet();
      if (!wallet) throw new Error("Please connect your wallet first");

      const account = await wallet.account();
      const credit = credits?.find(c => c.id === creditId);

      if (!credit) throw new Error("Credit not found");
      if (credit.owner !== account.address) {
        throw new Error("You can only delete your own listings");
      }

      await apiRequest("DELETE", `/api/credits/${creditId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully deleted carbon credit listing"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="animate-pulse backdrop-blur-lg bg-background/80 border-primary/20">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Carbon Credit Market
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {credits?.filter(c => c.listed).map((credit, index) => (
            <motion.div
              key={credit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glow hover-glow"
            >
              <Card className="backdrop-blur-lg bg-background/80 border-primary/20 overflow-hidden shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Carbon Credit #{credit.tokenId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="font-medium">{credit.amount} tons</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="font-medium">{credit.price} APT</span>
                    </div>
                    <div className="pt-2 border-t border-primary/10">
                      <span className="text-xs text-muted-foreground">Owner:</span>
                      <p className="text-xs font-mono truncate">{credit.owner}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:to-primary"
                    onClick={() => buyMutation.mutate(credit)}
                    disabled={buyMutation.isPending || deleteMutation.isPending || credit.owner === currentAddress}
                  >
                    {buyMutation.isPending ? "Processing..." : "Buy Now"}
                  </Button>
                  {credit.owner === currentAddress && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMutation.mutate(credit.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}