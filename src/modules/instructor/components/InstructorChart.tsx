import { useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
import { InstructorChartProps } from "../types";

Chart.register(...registerables);

export default function InstructorChart({ courses }: InstructorChartProps) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students");

  // Generate stable colors using useMemo to avoid calling Math.random during render
  const colors = useMemo(() => {
    const colorPalette = [
      "rgb(59, 130, 246)", // blue
      "rgb(16, 185, 129)", // green
      "rgb(245, 158, 11)", // yellow
      "rgb(239, 68, 68)", // red
      "rgb(139, 92, 246)", // purple
      "rgb(236, 72, 153)", // pink
      "rgb(14, 165, 233)", // sky
      "rgb(251, 146, 60)", // orange
    ];

    // Return colors cycling through the palette
    return courses.map((_, index) => colorPalette[index % colorPalette.length]);
  }, [courses]);

  // Data for the chart displaying student information
  const chartDataStudents = useMemo(
    () => ({
      labels: courses.map((course) => course.courseName),
      datasets: [
        {
          data: courses.map((course) => course.totalStudentsEnrolled),
          backgroundColor: colors,
        },
      ],
    }),
    [courses, colors]
  );

  // Data for the chart displaying income information
  const chartIncomeData = useMemo(
    () => ({
      labels: courses.map((course) => course.courseName),
      datasets: [
        {
          data: courses.map((course) => course.totalAmountGenerated),
          backgroundColor: colors,
        },
      ],
    }),
    [courses, colors]
  );

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>

        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      <div className="relative flex-1 w-full min-h-0">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  );
}
