import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCarbonCreditSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ListPlus } from "lucide-react";

export default function ListCredit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertCarbonCreditSchema),
    defaultValues: {
      amount: 0,
      price: 0,
      description: "",
      tokenId: "",
      owner: "default", 
      listed: true
    }
  });

  const listMutation = useMutation({
    mutationFn: async (values: any) => {
      await apiRequest("POST", "/api/credits", {
        ...values,
        listed: true
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully listed carbon credits"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      setLocation("/list");
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ListPlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            List Carbon Credits
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glow"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => listMutation.mutate(data))} className="space-y-6 backdrop-blur-xl bg-background/80 p-8 rounded-lg border border-primary/20 shadow-xl">
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Token ID</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter unique token ID" 
                        className="bg-background/90 border-primary/20 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Amount (tons)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                        className="bg-background/90 border-primary/20 focus:border-primary"
                        min="0"
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Price (APT)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                        className="bg-background/90 border-primary/20 focus:border-primary"
                        min="0"
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your carbon credits" 
                        className="bg-background/90 border-primary/20 focus:border-primary min-h-[100px] resize-none" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-primary-foreground font-semibold text-lg py-6" 
                disabled={listMutation.isPending}
              >
                {listMutation.isPending ? "Processing..." : "List Carbon Credits"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );
}