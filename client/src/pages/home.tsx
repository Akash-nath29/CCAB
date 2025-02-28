import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WalletConnect from "@/components/WalletConnect";
import { ArrowRight, Shield, Leaf, BarChart3, Globe2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted dark:from-background dark:via-background/50 dark:to-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
              Carbon Credit Trading
              <br />
              Reimagined on Blockchain
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12">
              Trade carbon credits securely and transparently using blockchain technology.
              Join the future of environmental sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WalletConnect />
              <Link href="/list">
                <Button size="lg" variant="outline">
                  View Market
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/30 backdrop-blur-xl border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Trading",
                description: "Advanced blockchain security ensures safe transactions"
              },
              {
                icon: Leaf,
                title: "Eco-Friendly",
                description: "Support verified environmental sustainability projects"
              },
              {
                icon: BarChart3,
                title: "Real-Time Market",
                description: "Live trading and transparent price discovery"
              },
              {
                icon: Globe2,
                title: "Global Impact",
                description: "Connect with environmental initiatives worldwide"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-background/30 backdrop-blur border-primary/10">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter & Footer */}
      <footer className="border-t border-border bg-muted/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest updates on carbon credit trading and sustainability initiatives.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="max-w-xs" />
                <Button>Subscribe</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:gap-16">
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><Link href="/list"><a className="text-muted-foreground hover:text-foreground">Market</a></Link></li>
                  <li><Link href="/mint"><a className="text-muted-foreground hover:text-foreground">Mint Credits</a></Link></li>
                  <li><Link href="/list-credit"><a className="text-muted-foreground hover:text-foreground">List Credits</a></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Discord</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}