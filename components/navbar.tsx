"use client";

import { Button } from "./ui/button";
import { GitIcon } from "./icons";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="p-2 flex flex-row gap-2 justify-between">
      <Link href="https://github.com/sunggyeol/VTCourseCopilot">
        <Button variant="outline">
          <GitIcon /> View Source Code
        </Button>
      </Link>

      <Link href="https://vt.collegescheduler.com/s">
        <Button>
          Course Registration
        </Button>
      </Link>
    </div>
  );
};
