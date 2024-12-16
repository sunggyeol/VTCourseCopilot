import { motion } from "framer-motion";
import Link from "next/link";

import { MessageIcon } from "./icons";
import { LogoPython } from "@/app/icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <MessageIcon size={32} />
        </p>
        <p>
          Welcome to <span className="font-medium">VT Course Copilot</span> - your intelligent assistant for finding
          the best professors at{" "}
          <Link
            className="font-medium"
            href="https://vt.edu/"
            target="_blank"
          >
            Virginia Tech
          </Link>
          . It gathers information from{" "}
          <Link
            className="font-medium"
            href="https://udc.vt.edu/irdata/data/courses/grades"
            target="_blank"
          >
            University Data Commons
          </Link>{" "}
          and{" "}
          <Link
            className="font-medium"
            href="https://www.ratemyprofessors.com/"
            target="_blank"
          >
            Rate My Professors
          </Link>{" "}
          to help students make informed decisions about their courses. Future
          updates will integrate the{" "}
          <Link
            className="font-medium"
            href="https://www.reddit.com/"
            target="_blank"
          >
            Reddit
          </Link>{" "}
          to provide even more comprehensive insights.
        </p>
        <p className="text-sm text-gray-500 italic">
          This tool is not officially affiliated with or endorsed by Virginia Tech.
        </p>
        <p>
          This project was created by{" "}
          <Link
            className="font-medium"
            href="https://sunggyeol.com/about"
            target="_blank"
          >
            Sung Oh
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
