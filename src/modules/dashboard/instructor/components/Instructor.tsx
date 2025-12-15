'use client'

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import Link from "next/link"

import { fetchInstructorCourses } from "../../../../shared/services/courseDetailsAPI"
import { getInstructorData } from "../../../../shared/services/profileAPI"
import InstructorChart from "./InstructorChart"
import Img from '../../../../shared/components/Img';

interface InstructorDataType {
  _id: string;
  courseName: string;
  courseDescription: string;
  totalStudentsEnrolled: number;
  totalAmountGenerated: number;
}

interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  studentsEnrolled: any[]; // Using any[] based on usage (just verifying length)
  price: number;
  status: string;
}

interface User {
  firstName: string;
  image?: string;
}

interface AuthState {
  token: string | null;
}

interface ProfileState {
  user: User | null;
}

interface RootState {
  auth: AuthState;
  profile: ProfileState;
}

export default function Instructor() {
  const { token } = useSelector((state: RootState) => state.auth)
  const { user } = useSelector((state: RootState) => state.profile)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState<InstructorDataType[] | null>(null)
  const [courses, setCourses] = useState<Course[]>([])


  // get Instructor Data
  useEffect(() => {
    ; (async () => {
      setLoading(true)
      // const instructorApiData = await getInstructorData(token)
      // const result = await fetchInstructorCourses(token)

      // --- MOCK DATA FOR DEMO PURPOSES ---
      const mockInstructorData: InstructorDataType[] = [
        {
          _id: "1",
          courseName: "Curso Profesional de React",
          courseDescription: "Domina React desde cero hasta experto",
          totalStudentsEnrolled: 120,
          totalAmountGenerated: 12000,
        },
        {
          _id: "2",
          courseName: "Backend con Node.js",
          courseDescription: "Construye APIs escalables",
          totalStudentsEnrolled: 85,
          totalAmountGenerated: 8500,
        },
        {
          _id: "3",
          courseName: "Diseño UX/UI Moderno",
          courseDescription: "Principios de diseño para desarrolladores",
          totalStudentsEnrolled: 200,
          totalAmountGenerated: 5000,
        }
      ]

      const mockCourses: Course[] = [
        {
          _id: "1",
          courseName: "Curso Profesional de React",
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          studentsEnrolled: new Array(120).fill(1),
          price: 100,
          status: "Published"
        },
        {
          _id: "2",
          courseName: "Backend con Node.js",
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          studentsEnrolled: new Array(85).fill(1),
          price: 100,
          status: "Published"
        },
        {
          _id: "3",
          courseName: "Diseño UX/UI Moderno",
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          studentsEnrolled: new Array(200).fill(1),
          price: 25,
          status: "Draft"
        }
      ]
      // -----------------------------------

      // console.log('INSTRUCTOR_API_RESPONSE.....', instructorApiData)
      if (mockInstructorData?.length) setInstructorData(mockInstructorData)
      if (mockCourses) {
        setCourses(mockCourses)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) || 0

  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) || 0


  // skeleton loading
  const skItem = () => {
    return (
      <div className="mt-5 w-full flex flex-col justify-between  rounded-xl ">
        <div className="flex border p-4 border-richblack-600 ">
          <div className="w-full">
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            <div className="mt-3 flex gap-x-5">
              <p className="w-[200px] h-4 rounded-xl skeleton"></p>
              <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            </div>

            <div className="flex justify-center items-center flex-col">
              <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
              {/* circle */}
              <div className="w-60 h-60 rounded-full  mt-4 grid place-items-center skeleton"></div>
            </div>
          </div>
          {/* right column */}
          <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
        </div>

        {/* bottom row */}
        <div className="flex flex-col gap-y-6  mt-5">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-richblack-5 pl-5">Your Courses</p>
            <Link href="/dashboard/my-courses">
              <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">View All</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row  gap-6 ">
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let's start something new
        </p>
      </div>


      {loading ? (
        <div>
          {skItem()}
        </div>
      )
        :
        courses.length > 0 ? (
          <div>
            <div className="my-4 flex h-[450px] space-x-4">
              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData || []} />
              ) : (
                <div className="flex-1 rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}

              {/* left column */}
              {/* Total Statistics */}
              <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-lg text-richblack-200">Total Courses</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      {courses.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-richblack-200">Total Students</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      {totalStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-richblack-200">Total Income</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      Rs. {totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Render 3 courses */}
            <div className="rounded-md bg-richblack-800 p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link href="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
                </Link>
              </div>

              <div className="my-4 flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0 ">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="sm:w-1/3 flex flex-col items-center justify-center">
                    <Img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-[201px] w-full rounded-2xl object-cover"
                    />

                    <div className="mt-3 w-full">
                      <p className="text-sm font-medium text-richblack-50">
                        {course.courseName}
                      </p>
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs font-medium text-richblack-300">
                          {course.studentsEnrolled.length} students
                        </p>
                        <p className="text-xs font-medium text-richblack-300">
                          |
                        </p>
                        <p className="text-xs font-medium text-richblack-300">
                          Rs. {course.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5">
              You have not created any courses yet
            </p>

            <Link href="/dashboard/add-course">
              <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                Create a course
              </p>
            </Link>
          </div>
        )}
    </div>
  )
}
