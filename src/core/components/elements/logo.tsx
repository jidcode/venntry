import { Box } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-1.5 uppercase text-xl text-neutral font-semibold tracking-tighter">
        <Box className="bg-secondary text-primary rounded-full h-6 w-6 p-1" />
        <span>VENNTRY</span>
      </div>
    </Link>
  );
}

export function LogoLight() {
  return (
    <Link href="/">
      <div className="flex items-center gap-1.5 uppercase text-xl font-semibold tracking-tighter">
        <Box className="bg-secondary text-primary rounded-full h-6 w-6 p-1" />
        <span>VENNTRY</span>
      </div>
    </Link>
  );
}

export function LogoIcon() {
  return (
    <Link href="/">
      <div className="flex items-center gap-1.5 uppercase text-xl font-semibold tracking-tighter">
        <Box className="bg-secondary text-primary rounded-full h-6 w-6 p-1" />
      </div>
    </Link>
  );
}
