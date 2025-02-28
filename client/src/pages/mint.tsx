import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getConnectedWallet, mintCarbonCredits } from "@/lib/aptos";
import { apiRequest } from "@/lib/queryClient";
import { insertCarbonCreditSchema } from "@shared/schema";

export default function Mint() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertCarbonCreditSchema),
    defaultValues: {
      amount: 0,
      price: 0,
      description: "",
      tokenId: "",
      owner: "",
      listed: false
    }
  });

  const mintMutation = useMutation({
    mutationFn: async (values: any) => {
      const wallet = await getConnectedWallet();
      if (!wallet) throw new Error("Wallet not connected");
      
      const account = await wallet.account();
      const txHash = await mintCarbonCredits(wallet, values.amount);
      
      await apiRequest("POST", "/api/credits", {
        ...values,
        tokenId: txHash,
        owner: account.address
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully minted carbon credits"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Mint Carbon Credits</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mintMutation.mutate(data))} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (tons)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={mintMutation.isPending}>
            {mintMutation.isPending ? "Processing..." : "Mint Credits"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
