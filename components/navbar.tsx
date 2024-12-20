"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import sunggyeol_logo from "../public/sunggyeol_logo.svg";

export const Navbar = () => {
  return (
    <div className="p-2 flex flex-row gap-2 justify-between">
      <Link href="https://www.sunggyeol.com/about" target="_blank" rel="noopener noreferrer">
        <Button variant="outline">
          <Image src={sunggyeol_logo} alt="Logo" width={24} height={24} /> sunggyeol.com
        </Button>
      </Link>

      <Link href="https://vt.collegescheduler.com/s" target="_blank" rel="noopener noreferrer">
      <Button variant="outline">
        Course Registration
      </Button>
      </Link>
    </div>
  );
};
