"use client";

import type { Message } from "ai";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { SparklesIcon, CheckIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { cn } from "@/lib/utils";
import { CourseInformation } from "./course_information";

const SAMPLE_COURSE_INFO = {
  course_info: [
    {
      "Academic Year": "2023-24",
      Term: "Spring",
      Subject: "CS",
      "Course No.": 2506,
      "Course Title": "Intro to Computer Organization",
      Instructor: "Nikolopoulos",
      GPA: 3.18,
      "A (%)": 26.4,
      "A- (%)": 13.5,
      "B+ (%)": 16.9,
      "B (%)": 15.5,
      "B- (%)": 12.2,
      "C+ (%)": 7.4,
      "C (%)": 2.7,
      "C- (%)": 2.0,
      "D+ (%)": 0.7,
      "D (%)": 0.0,
      "D- (%)": 0.7,
      "F (%)": 2.0,
      Withdraws: 5,
      "Graded Enrollment": 148,
      CRN: 13321,
      Credits: 3
    }
  ],
  professor_info: [
    {
      name: "Dimitrios Nikolopoulos",
      department: "Computer Science",
      school: "Virginia Tech",
      rating: 3.6,
      difficulty: 3.8,
      num_ratings: 10,
      would_take_again: 60  // Can be null in real data
    }
  ]
};

export const PreviewMessage = ({
  message,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) => {
  const [steps, setSteps] = useState([false, false, false, false]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (message.content || message.toolInvocations) {
      scrollToBottom();
    }
  }, [message.content, message.toolInvocations]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setSteps(prev => [true, prev[1], prev[2], prev[3]]), 3000),
      setTimeout(() => setSteps(prev => [prev[0], true, prev[2], prev[3]]), 8000),
      setTimeout(() => setSteps(prev => [prev[0], prev[1], true, prev[3]]), 13000),
      setTimeout(() => setSteps(prev => [prev[0], prev[1], prev[2], true]), 18000)
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const showSparklesIcon = (
    message.role === "assistant" &&
    (
      (message.content && message.content.trim().length > 0) ||
      message.toolInvocations?.some((invocation) => {
        if (invocation.state === "call") {
          return true;
        }
        if (invocation.toolName === "get_course_info" && invocation.state === "result") {
          const { result } = invocation;
          const data = typeof result === 'string' ? JSON.parse(result) : result;
          return data?.course_info?.length > 0;
        }
        return false;
      })
    )
  );

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message mb-8"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
        )}
      >
        {showSparklesIcon && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full overflow-x-hidden">
          {message.content && (
            <div className="flex flex-col gap-4">
              <Markdown>{message.content as string}</Markdown>
            </div>
          )}

          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;
                  console.log("Tool result:", result); // Add logging to debug

                  return (
                    <div key={toolCallId}>
                      {toolName === "get_course_info" ? (
                        <div className="overflow-x-auto">
                          {typeof result === 'string' 
                            ? (JSON.parse(result)?.course_info?.length > 0 && 
                               <CourseInformation courseInfo={JSON.parse(result)} />)
                            : (result?.course_info?.length > 0 && 
                               <CourseInformation courseInfo={result} />)}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap break-words overflow-x-hidden">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                }
                if (state === "call") {
                  return (
                    <div key={toolCallId} className="text-muted-foreground relative">
                      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        Initiating Data Analyst Agent...
                        {steps[0] && <CheckIcon className="text-green-500" size={16} />}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5, duration: 0.5 }}
                        className="flex items-center gap-2"
                      >
                          Analyzing University DataCommons...
                        {steps[1] && <CheckIcon className="text-green-500" size={16} />}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 8, duration: 0.5 }}
                        className="flex items-center gap-2"
                      >
                        Analyzing Rate My Professor...
                        {steps[2] && <CheckIcon className="text-green-500" size={16} />}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 13, duration: 0.5 }}
                        className="flex items-center gap-2"
                      >
                        Combining information...
                        {steps[3] && <CheckIcon className="text-green-500" size={16} />}
                      </motion.div>
                    </div>
                  );
                }
                return (
                  <div
                    key={toolCallId}
                    className={cn({
                      skeleton: ["get_course_info"].includes(toolName),
                    })}
                  >
                    {toolName === "get_course_info" ? <CourseInformation courseInfo={SAMPLE_COURSE_INFO} /> : null}
                  </div>
                );
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} /> {/* Add this at the end of the content */}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
          Reasoning...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
