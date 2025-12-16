import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { RootState, AppDispatch } from "../../../shared/store/store"
import { buyCourse } from "../../../shared/services/studentFeaturesAPI"
import { addToCart } from "../store/cartSlice"
import { ACCOUNT_TYPE } from "../../../shared/utils/constants"
import { Course } from "../types"
import { ConfirmationModalData } from "../../../shared/components/ConfirmationModal"

/**
 * Custom hook for course actions (buy, add to cart, active sections)
 * Separates action handlers from component
 */
export const useCourseActions = (
  courseId: string | string[] | undefined,
  course: Course | undefined
) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.profile)
  const { token } = useSelector((state: RootState) => state.auth)
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalData | null>(null)
  const [isActive, setIsActive] = useState<string[]>([])

  const handleActive = (id: string) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
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
    if (token && course) {
      dispatch(addToCart(course))
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

  const handleCollapseAll = () => {
    setIsActive([])
  }

  return {
    isActive,
    confirmationModal,
    setConfirmationModal,
    handleActive,
    handleBuyCourse,
    handleAddToCart,
    handleCollapseAll,
  }
}

