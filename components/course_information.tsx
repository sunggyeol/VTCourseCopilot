import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

interface CourseInfo {
  "Academic Year": string;
  Term: string;
  Subject: string;
  "Course No.": number;  // Changed from string to number
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
  would_take_again: number | null;  // Added null since this might not always be available
}

interface CombinedInfo {
  course_info: CourseInfo[];
  professor_info: ProfessorInfo[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function CourseInformation({ courseInfo }: { courseInfo: CombinedInfo }) {
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  if (!courseInfo || (!courseInfo.course_info && !courseInfo.professor_info)) {
    return <pre>No data available</pre>;
  }

  const courseTitle = courseInfo.course_info[0]?.['Course Title'] || 'Course Information';

  const getGraphData = (course: CourseInfo) => ({
    labels: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
    datasets: [{
      label: 'Grade Distribution (%)',
      data: [
        course['A (%)'],
        course['A- (%)'],
        course['B+ (%)'],
        course['B (%)'],
        course['B- (%)'],
        course['C+ (%)'],
        course['C (%)'],
        course['C- (%)'],
        course['D+ (%)'],
        course['D (%)'],
        course['D- (%)'],
        course['F (%)'],
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  });

  return (
    <div className="w-full min-h-[600px] relative">
      <h2 className="text-xl font-bold mb-4 text-white">Course GPA by Professors</h2>
      
      {selectedCourse && (
        <div className="w-full h-[300px] mb-4 bg-gray-900/90 p-4 rounded-lg shadow-lg">
          <Bar
            data={getGraphData(selectedCourse)}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    color: 'white'
                  }
                },
                title: {
                  display: true,
                  text: `Grade Distribution - ${selectedCourse['Academic Year']} ${selectedCourse.Term}`,
                  color: 'white'
                },
              },
              scales: {
                y: {
                  ticks: { color: 'white' }
                },
                x: {
                  ticks: { color: 'white' }
                }
              }
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto max-w-full rounded-lg">
        <div className="inline-block min-w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Term/Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courseInfo.course_info.map((course, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-800/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {`${course['Academic Year']} ${course.Term}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {course.Instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {course.GPA.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <button
                      onClick={() => setSelectedCourse(selectedCourse === course ? null : course)}
                      className="font-bold hover:text-gray-300 transition-colors duration-150"
                    >
                      {selectedCourse === course ? 'Hide' : 'Grade Distribution'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-bold my-4 text-white">Rate My Professor</h2>
      <div className="overflow-x-auto max-w-full rounded-lg">
        <div className="inline-block min-w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Professor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  # of Ratings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Would Take Again
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courseInfo.professor_info
                .filter(professor => professor.name && professor.name.trim() !== '')
                .map((professor, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {professor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {professor.rating ? professor.rating.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {professor.difficulty ? professor.difficulty.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {professor.num_ratings || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {professor.would_take_again !== null && professor.would_take_again !== undefined
                        ? `${professor.would_take_again}%` 
                        : 'N/A'}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
