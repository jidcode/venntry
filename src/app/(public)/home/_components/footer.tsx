import Link from "next/link";
import Logo from "@/core/components/elements/logo";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Solutions", href: "#solutions" },
      { name: "Pricing", href: "#pricing" },
      { name: "Updates", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "News", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "#" },
      { name: "Help center", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Licenses", href: "#" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="pad py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Logo />
            <p className="text-sm leading-6 text-foreground/80">
              The modern inventory management platform for businesses of all
              sizes.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/60 hover:text-foreground"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6">
                  {footerLinks[0].title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks[0].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-foreground/80 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6">
                  {footerLinks[1].title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks[1].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-foreground/80 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6">
                  {footerLinks[2].title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks[2].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-foreground/80 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6">
                  {footerLinks[3].title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks[3].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-foreground/80 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t pt-8">
          <p className="text-xs leading-5 text-foreground/60">
            &copy; {new Date().getFullYear()} InventoryPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
