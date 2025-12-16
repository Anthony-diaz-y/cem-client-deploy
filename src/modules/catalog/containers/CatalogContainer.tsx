'use client'

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Footer from "../../../shared/components/Footer"
import Course_Card from "../components/Course_Card"
import Course_Slider from "../components/Course_Slider"
import Loading from '../../../shared/components/Loading'
import { fetchCourseCategories } from '../../../shared/services/courseDetailsAPI'

// Type definitions
interface Course {
  _id: string
  courseName: string
  price: number
  thumbnail: string
  instructor: {
    firstName: string
    lastName: string
  }
  ratingAndReviews: unknown[]
  studentsEnrolled: unknown[]
}

interface Category {
  _id: string
  name: string
}

interface CategoryWithCourses {
  name: string
  description?: string
  courses: Course[]
}

interface CatalogPageData {
  selectedCategory: CategoryWithCourses
  differentCategory: CategoryWithCourses
  mostSellingCourses: Course[]
}

/**
 * CatalogContainer - Container component for Catalog page
 * Handles all business logic: data fetching, state management, API calls
 */
const CatalogContainer = () => {
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState<CatalogPageData | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch All Categories
  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetchCourseCategories() as Category[]
        const catalogNameStr = Array.isArray(catalogName) ? catalogName[0] : catalogName
        if (catalogNameStr) {
          const category_id = res.filter(
            (ct: Category) => ct.name.split(" ").join("-").toLowerCase() === catalogNameStr.toLowerCase()
          )[0]?._id
          if (category_id) {
            setCategoryId(category_id)
          }
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])

  // Fetch Catalog Page Data
  useEffect(() => {
    if (categoryId) {
      ; (async () => {
        setLoading(true)
        try {
          // Mock Data for Catalog
          const mockCatalogData = {
            selectedCategory: {
              name: "Web Development",
              description: "Master the art of web development with our comprehensive courses.",
              courses: [
                { _id: "c1", courseName: "MERN Stack Bootcamp", price: 4999, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg", instructor: { firstName: "John", lastName: "Doe" }, ratingAndReviews: [], studentsEnrolled: [] },
                { _id: "c2", courseName: "React Zero to Hero", price: 2999, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/react_thumb.jpg", instructor: { firstName: "Jane", lastName: "Smith" }, ratingAndReviews: [], studentsEnrolled: [] },
                { _id: "c3", courseName: "Node.js Advanced", price: 3499, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/node_thumb.jpg", instructor: { firstName: "Mike", lastName: "Johnson" }, ratingAndReviews: [], studentsEnrolled: [] }
              ]
            },
            differentCategory: {
              name: "Python",
              courses: [
                { _id: "c4", courseName: "Python Masterclass", price: 1999, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/python_thumb.jpg", instructor: { firstName: "Sarah", lastName: "Lee" }, ratingAndReviews: [], studentsEnrolled: [] }
              ]
            },
            mostSellingCourses: [
              { _id: "c1", courseName: "MERN Stack Bootcamp", price: 4999, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg", instructor: { firstName: "John", lastName: "Doe" }, ratingAndReviews: [], studentsEnrolled: [] },
              { _id: "c5", courseName: "Java DSA Upgrade", price: 5999, thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/java_thumb.jpg", instructor: { firstName: "David", lastName: "Brown" }, ratingAndReviews: [], studentsEnrolled: [] }
            ]
          }
          // const res = await getCatalogPageData(categoryId)
          setCatalogPageData(mockCatalogData)
        } catch (error) {
          console.error("Error fetching catalog page data:", error)
        }
        setLoading(false)
      })()
    }
  }, [categoryId])

  // Loading state
  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    )
  }

  // No data state
  if (!loading && !catalogPageData) {
    return (
      <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
        No Courses found for selected Category
      </div>
    )
  }

  // Render presentational component with data
  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${active === 1
              ? "border-b border-b-yellow-25 text-yellow-25"
              : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${active === 2
              ? "border-b border-b-yellow-25 text-yellow-25"
              : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <Course_Slider
            Courses={catalogPageData?.selectedCategory?.courses || []}
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.differentCategory?.name}
        </div>
        <div>
          <Course_Slider
            Courses={catalogPageData?.differentCategory?.courses || []}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.mostSellingCourses
              ?.slice(0, 4)
              .map((course: Course, i: number) => (
                <Course_Card course={course} key={course._id || i} Height={"h-[300px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CatalogContainer

