"use client";

import type { Message } from "ai";
import { motion } from "framer-motion";

import { SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { cn } from "@/lib/utils";
import { Weather } from "./weather";
import { CourseInformation } from "./course_information";

const SAMPLE_COURSE_INFO = {
  course_info: [
    {
      "Academic Year": "2024",
      Term: "Fall",
      Subject: "CS",
      "Course No.": "101",
      "Course Title": "Introduction to Computer Science",
      Instructor: "John Doe",
      GPA: 3.5,
      "A (%)": 30,
      "A- (%)": 20,
      "B+ (%)": 15,
      "B (%)": 10,
      "B- (%)": 5,
      "C+ (%)": 5,
      "C (%)": 5,
      "C- (%)": 3,
      "D+ (%)": 2,
      "D (%)": 2,
      "D- (%)": 1,
      "F (%)": 2,
      Withdraws: 1,
      "Graded Enrollment": 100,
      CRN: 12345,
      Credits: 3,
    },
  ],
  professor_info: [
    {
      name: "John Doe",
      department: "Computer Science",
      school: "Engineering",
      rating: 4.5,
      difficulty: 3.0,
      num_ratings: 50,
      would_take_again: 90,
    },
  ],
};

export const PreviewMessage = ({
  message,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
        )}
      >
        {message.role === "assistant" && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
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

                  return (
                    <div key={toolCallId}>
                      {toolName === "get_current_weather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === "get_course_info" ? (
                        <CourseInformation
                          courseInfo={
                            result?.course_info && result?.professor_info
                              ? result
                              : { course_info: result?.course_info || result || [], professor_info: result?.professor_info || [] }
                          }
                        />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
                if (state === "call") {
                  return (
                    <div key={toolCallId} className="text-muted-foreground relative">
                      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                        Looking for University DataCommons...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5, duration: 0.5 }}
                      >
                        Looking for Rate My Professor...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 10, duration: 0.5 }}
                        className="mt-4"
                      >
                        Combining information...
                      </motion.div>
                    </div>
                  );
                }
                return (
                  <div
                    key={toolCallId}
                    className={cn({
                      skeleton: ["get_current_weather", "get_course_info"].includes(toolName),
                    })}
                  >
                    {toolName === "get_current_weather" ? <Weather /> : null}
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
          Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
