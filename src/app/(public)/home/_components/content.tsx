import {
  CheckCircle2,
  BarChart2,
  Package,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import Link from "next/link";

const features = [
  {
    name: "Real-time Tracking",
    description:
      "Monitor inventory levels across multiple locations in real-time.",
    icon: BarChart2,
  },
  {
    name: "Automated Alerts",
    description:
      "Get notified when stock levels are low or items are nearing expiration.",
    icon: Zap,
  },
  {
    name: "Barcode Scanning",
    description:
      "Quickly add or remove items with our mobile barcode scanning.",
    icon: Package,
  },
  {
    name: "Multi-user Access",
    description: "Collaborate with your team with role-based permissions.",
    icon: Users,
  },
  {
    name: "Advanced Reporting",
    description:
      "Generate detailed reports to analyze sales and inventory trends.",
    icon: Settings,
  },
  {
    name: "Supplier Management",
    description:
      "Keep track of your suppliers and purchase orders in one place.",
    icon: CheckCircle2,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Manager, Retail Chain",
    quote:
      "We reduced our inventory discrepancies by 90% in the first month of using this platform.",
  },
  {
    name: "Michael Chen",
    role: "Warehouse Director, E-commerce",
    quote:
      "The real-time tracking has transformed how we manage our fulfillment centers.",
  },
  {
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    quote:
      "Finally an inventory system that's powerful yet simple enough for my small team.",
  },
];

export default function ContentPage() {
  return (
    <div className="divide-y divide-border">
      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful features for your inventory
            </p>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Our platform provides all the tools you need to manage your
              inventory efficiently, whether you're a small business or a large
              enterprise.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <feature.icon
                      className="h-5 w-5 flex-none text-accent"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto text-foreground/70">
                      {feature.description}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32 pad bg-secondary/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by businesses worldwide
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Join thousands of companies who have transformed their inventory
              management.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col justify-between bg-background p-8 shadow-sm ring-1 ring-foreground/10 rounded-lg"
              >
                <div>
                  <p className="text-foreground/80 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 sm:py-32 pad">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl bg-accent/10 ring-1 ring-accent/20 p-8 sm:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your inventory management?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
              Join thousands of businesses who have streamlined their operations
              with our platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
