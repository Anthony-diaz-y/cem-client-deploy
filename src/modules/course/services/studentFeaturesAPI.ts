import { toast } from "react-hot-toast";
import { studentEndpoints } from "@shared/services/apis";
import { apiConnector } from "@shared/services/apiConnector";
import rzpLogo from "@shared/assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../store/courseSlice";
import { resetCart } from "../store/cartSlice";
import type { Dispatch } from "@reduxjs/toolkit";
import {
  UserDetails,
  PaymentResponse,
  VerifyPaymentData,
  ApiError,
} from "../types";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Only run on client-side
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(false);
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// ================ buyCourse ================
export async function buyCourse(
  token: string,
  coursesId: string[],
  userDetails: UserDetails,
  navigate: (path: string) => void,
  dispatch: Dispatch
) {
  const toastId = toast.loading("Loading...");

  try {
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("RazorPay SDK failed to load");
      return;
    }

    // initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { coursesId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log("orderResponse... ", orderResponse);
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";
    // console.log("RAZORPAY_KEY...", RAZORPAY_KEY);

    // options
    const options = {
      key: RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: orderResponse.data.message.amount,
      order_id: orderResponse.data.message.id,
      name: "StudyNotion",
      description: "Thank You for Purchasing the Course",
      image: typeof rzpLogo === "string" ? rzpLogo : rzpLogo.src,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function (response: PaymentResponse) {
        //send successful mail
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        );
        //verifyPayment
        verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log("payment failed.... ", response.error);
    });
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PAYMENT API ERROR.....", apiError);
    toast.error(apiError.response?.data?.message || "Could not make Payment");
  }
  toast.dismiss(toastId);
}

// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(
  response: PaymentResponse,
  amount: number,
  token: string
) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PAYMENT SUCCESS EMAIL ERROR....", apiError);
  }
}

// ================ verify payment ================
async function verifyPayment(
  bodyData: VerifyPaymentData,
  token: string,
  navigate: (path: string) => void,
  dispatch: Dispatch
) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("payment Successful, you are addded to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PAYMENT VERIFY ERROR....", apiError);
    toast.error(apiError.response?.data?.message || "Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
