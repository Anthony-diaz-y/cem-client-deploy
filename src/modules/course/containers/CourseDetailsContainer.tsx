'use client'

import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useParams } from "next/navigation"
import { GiReturnArrow } from 'react-icons/gi'
import { MdOutlineVerified } from 'react-icons/md'
import toast from "react-hot-toast"

import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import Footer from "../../../shared/components/Footer"
import RatingStars from "../../../shared/components/RatingStars"
import CourseAccordionBar from "../components/CourseAccordionBar"
import CourseDetailsCard from "../components/CourseDetailsCard"
import Img from '../../../shared/components/Img'
import { formatDate } from "../../../shared/utils/formatDate"
import { fetchCourseDetails } from "../../../shared/services/courseDetailsAPI"
import { buyCourse } from "../../../shared/services/studentFeaturesAPI"
import GetAvgRating from "../../../shared/utils/avgRating"
import { ACCOUNT_TYPE } from "../../../shared/utils/constants"
import { addToCart } from "../store/cartSlice"

/**
 * CourseDetailsContainer - Container component for Course Details page
 * Handles all business logic: data fetching, state management, API calls, event handlers
 */
const CourseDetailsContainer = () => {
  const router = useRouter()
  const { courseId } = useParams()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()

  // State management
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [isActive, setIsActive] = useState(Array(0))
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetailsData = async () => {
      try {
        // Mock Response for Demo
        const mockResponse = {
          success: true,
          data: {
            courseDetails: {
              _id: courseId || "mock_id",
              courseName: "MERN Stack Bootcamp 2024",
              courseDescription: "Go from zero to hero in Full Stack Web Development. Master React, Node.js, Express, and MongoDB.",
              thumbnail: "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
              price: 4999,
              whatYouWillLearn: "Build full-stack applications\nMaster React Hooks and Redux\nCreate RESTful APIs with Node.js\nDatabase management with MongoDB\nAuthentication and Authorization",
              courseContent: [
                {
                  _id: "sec1",
                  sectionName: "Introduction to Web Development",
                  subSection: [
                    { _id: "sub1", title: "Welcome to the Course", timeDuration: "5:00", description: "Intro" },
                    { _id: "sub2", title: "How the Web Works", timeDuration: "10:30", description: "Basics" }
                  ]
                },
                {
                  _id: "sec2",
                  sectionName: "React Fundamentals",
                  subSection: [
                    { _id: "sub3", title: "JSX and Components", timeDuration: "15:00", description: "React Basics" },
                    { _id: "sub4", title: "State and Props", timeDuration: "20:00", description: "Data flow" }
                  ]
                }
              ],
              ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
              instructor: {
                firstName: "John",
                lastName: "Doe",
                image: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
                additionalDetails: { about: "Senior Full Stack Developer with 10+ years of experience." }
              },
              studentsEnrolled: ["user1", "user2", "user3"],
              createdAt: new Date().toISOString(),
              tag: ["Web Development", "MERN", "JavaScript"]
            },
            totalDuration: "12h 45m"
          }
        }
        // const res = await fetchCourseDetails(courseId)
        setResponse(mockResponse)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    }
    fetchCourseDetailsData()
  }, [courseId])

  // Calculate average rating
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails?.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])

  // Calculate total lectures
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  // Event handlers
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  const handleBuyCourse = () => {
    if (token) {
      const coursesId = [courseId]
      buyCourse(token, coursesId, user, router.push, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(response?.data.courseDetails))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // Loading state
  if (paymentLoading || loading || !response) {
    return (
      <div className={`mt-24 p-5 flex flex-col justify-center gap-4`}>
        <div className="flex flex-col sm:flex-col-reverse gap-4">
          <p className="h-44 sm:h-24 sm:w-[60%] rounded-xl skeleton"></p>
          <p className="h-9 sm:w-[39%] rounded-xl skeleton"></p>
        </div>
        <p className="h-4 w-[55%] lg:w-[25%] rounded-xl skeleton"></p>
        <p className="h-4 w-[75%] lg:w-[30%] rounded-xl skeleton"></p>
        <p className="h-4 w-[35%] lg:w-[10%] rounded-xl skeleton"></p>
        <div className="right-[1.5rem] top-[20%] hidden lg:block lg:absolute min-h-[450px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 rounded-xl skeleton"></div>
        <p className="mt-24 h-60 lg:w-[60%] rounded-xl skeleton"></p>
      </div>
    )
  }

  // Extract course data
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
    tag
  } = response?.data?.courseDetails

  // Render presentational component
  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-cente py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            {/* Go back button */}
            <div className="mb-5 lg:mt-10 lg:mb-0 z-[100]" onClick={() => router.back()}>
              <GiReturnArrow className="w-10 h-10 text-yellow-100 hover:text-yellow-50 cursor-pointer" />
            </div>

            {/* Mobile thumbnail */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <Img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
            </div>

            {/* Course data */}
            <div className={`mb-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}>
              <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseName}</p>
              <p className='text-richblack-200'>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <p className="capitalize"> Created By <span className="font-semibold underline">{instructor.firstName} {instructor.lastName}</span></p>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2"><HiOutlineGlobeAlt /> English</p>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">Rs. {price}</p>
              <button className="yellowButton" onClick={handleBuyCourse}>Buy Now</button>
              <button onClick={handleAddToCart} className="blackButton">Add to Cart</button>
            </div>
          </div>

          {/* Desktop floating card */}
          <div className="right-[1.5rem] top-[60px] mx-auto hidden lg:block lg:absolute min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What you'll learn */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-3">
              {whatYouWillLearn && (
                whatYouWillLearn.split('\n').map((line, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <p className="font-bold">{index + 1}.</p>
                    <p className="ml-2">{line}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col lg:flex-row gap-4">
            <p className="text-xl font-bold">Tags</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {tag && tag.map((item, ind) => (
                <p key={ind} className="bg-yellow-50 p-[2px] text-black rounded-full text-center font-semibold">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-[830px] mt-9">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>{courseContent.length} {`section(s)`}</span>
                  <span>{totalNoOfLectures} {`lecture(s)`}</span>
                  <span>{response.data?.totalDuration} Total Time</span>
                </div>
                <button className="text-yellow-25" onClick={() => setIsActive([])}>
                  Collapse All Sections
                </button>
              </div>
            </div>

            {/* Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <Img
                  src={instructor.image}
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg capitalize flex items-center gap-2 font-semibold">
                    {`${instructor.firstName} ${instructor.lastName}`}
                    <span><MdOutlineVerified className='w-5 h-5 text-[#00BFFF]' /></span>
                  </p>
                  <p className="text-richblack-50">{instructor?.additionalDetails?.about}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetailsContainer

