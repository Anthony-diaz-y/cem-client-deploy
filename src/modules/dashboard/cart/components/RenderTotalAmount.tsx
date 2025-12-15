'use client'

import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"

import IconBtn from "../../../../shared/components/IconBtn"
import { buyCourse } from "../../../../shared/services/studentFeaturesAPI"
import { RootState } from "../../../../shared/store/store"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state: RootState) => state.cart)
  const { token } = useSelector((state: RootState) => state.auth)
  const { user } = useSelector((state: RootState) => state.profile)
  const router = useRouter()
  const dispatch = useDispatch()


  const handleBuyCourse = async () => {
    const courses = cart.map((course) => course._id)
    await buyCourse(token, courses, user, router.push, dispatch)
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}
