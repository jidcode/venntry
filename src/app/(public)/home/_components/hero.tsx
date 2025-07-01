import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroPage() {
  return (
    <section className="relative pad overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 sm:pt-52 sm:pb-24 lg:px-8 lg:pt-32 lg:pb-40 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
          Inventory Management <br /> Made Simple
        </h1>

        <p className="mt-6 text-xl leading-8 text-foreground/80 max-w-3xl mx-auto">
          Streamline your operations with our intuitive inventory platform. Gain
          real-time visibility, reduce costs, and make smarter decisions for
          your business.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/register">
            <Button variant="secondary">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-foreground/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <img
              src="/dashboard-preview.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md shadow-2xl ring-1 ring-foreground/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
