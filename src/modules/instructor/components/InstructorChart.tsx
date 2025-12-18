import { useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
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

  // Data for the chart displaying student information (Bar Chart)
  const chartDataStudents = useMemo(
    () => {
      const studentsData = courses.map((course) => {
        // Calcular estudiantes desde el array si está disponible, sino usar totalStudentsEnrolled
        const studentsCount = Array.isArray(course.studentsEnrolled)
          ? course.studentsEnrolled.length
          : (course.totalStudentsEnrolled || 0);
        
        return Math.max(0, studentsCount);
      });
      
      return {
        labels: courses.map((course) => course.courseName),
        datasets: [
          {
            label: 'Estudiantes Inscritos',
            data: studentsData,
            backgroundColor: 'rgba(59, 130, 246, 0.6)', // Azul
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      };
    },
    [courses]
  );

  // Data for the chart displaying income information (Bar Chart con colores diferentes)
  const chartIncomeData = useMemo(
    () => {
      const incomeData = courses.map((course) => {
        // Usar totalAmountGenerated del backend si está disponible, sino calcular
        if (typeof course.totalAmountGenerated === 'number' && course.totalAmountGenerated >= 0) {
          return course.totalAmountGenerated;
        }
        
        // Fallback: calcular desde price * students
        const studentsCount = Array.isArray(course.studentsEnrolled)
          ? course.studentsEnrolled.length
          : (course.totalStudentsEnrolled || 0);
        return (course.price || 0) * studentsCount;
      });
      
      return {
        labels: courses.map((course) => course.courseName),
        datasets: [
          {
            label: 'Ingresos Generados',
            data: incomeData,
            backgroundColor: incomeData.map(income => 
              income > 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
            ), // Verde para ingresos positivos, rojo para cero
            borderColor: incomeData.map(income => 
              income > 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
            ),
            borderWidth: 1,
          },
        ],
      };
    },
    [courses]
  );

  // Options for Students chart
  const studentsOptions = useMemo(() => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#E5E7EB', // richblack-5 equivalent
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Estudiantes: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9CA3AF', // richblack-300
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  }), []);

  // Options for Income chart
  const incomeOptions = useMemo(() => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#E5E7EB',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Ingresos: Rs. ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9CA3AF',
          callback: function(value: any) {
            return 'Rs. ' + value.toLocaleString();
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  }), []);

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
        {/* Render the Bar chart based on the selected chart */}
        {courses.length > 0 ? (
          <Bar
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={currChart === "students" ? studentsOptions : incomeOptions}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-richblack-400">No hay datos para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
}
