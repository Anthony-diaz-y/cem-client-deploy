'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { IoMdClose } from "react-icons/io"
import { HiMenuAlt1 } from "react-icons/hi"
import { IoIosArrowBack } from "react-icons/io"
import IconBtn from "../../../shared/components/IconBtn"
import { setCourseViewSidebar } from "../../dashboard/store/sidebarSlice"
import { RootState, AppDispatch } from "../../../shared/store/store"

interface SidebarHeaderProps {
  courseName?: string
  completedLectures: string[]
  totalNoOfLectures: number
  onReviewClick: () => void
}

/**
 * SidebarHeader - Header component for video details sidebar
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  courseName,
  completedLectures,
  totalNoOfLectures,
  onReviewClick,
}) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  )

  return (
    <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
      <div className="flex w-full items-center justify-between">
        <div
          className="sm:hidden text-white cursor-pointer"
          onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
        >
          {courseViewSidebar ? (
            <IoMdClose size={33} />
          ) : (
            <HiMenuAlt1 size={33} />
          )}
        </div>

        <button
          onClick={() => {
            router.push(`/dashboard/enrolled-courses`)
          }}
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
          title="back"
        >
          <IoIosArrowBack size={30} />
        </button>

        <IconBtn text="Add Review" onclick={onReviewClick} />
      </div>

      <div className="flex flex-col">
        <p>{courseName}</p>
        <p className="text-sm font-semibold text-richblack-500">
          {completedLectures?.length} / {totalNoOfLectures}
        </p>
      </div>
    </div>
  )
}

export default SidebarHeader

