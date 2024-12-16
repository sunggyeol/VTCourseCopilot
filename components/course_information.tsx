import React from "react";

interface CourseInfo {
  "Academic Year": string;
  Term: string;
  Subject: string;
  "Course No.": string;
  "Course Title": string;
  Instructor: string;
  GPA: number;
  "A (%)": number;
  "A- (%)": number;
  "B+ (%)": number;
  "B (%)": number;
  "B- (%)": number;
  "C+ (%)": number;
  "C (%)": number;
  "C- (%)": number;
  "D+ (%)": number;
  "D (%)": number;
  "D- (%)": number;
  "F (%)": number;
  Withdraws: number;
  "Graded Enrollment": number;
  CRN: number;
  Credits: number;
}

interface ProfessorInfo {
  name: string;
  department: string;
  school: string;
  rating: number;
  difficulty: number;
  num_ratings: number;
  would_take_again: number;
}

interface CombinedInfo {
  course_info: CourseInfo[];
  professor_info: ProfessorInfo[];
}

export function CourseInformation({ courseInfo }: { courseInfo: CombinedInfo }) {
  if (!courseInfo || (!courseInfo.course_info && !courseInfo.professor_info)) {
    return <pre>No data available</pre>;
  }

  return (
    <pre className="whitespace-pre-wrap">
      {JSON.stringify(courseInfo, null, 2)}
    </pre>
  );
}
