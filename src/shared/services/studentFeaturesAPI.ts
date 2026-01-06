import { toast } from "react-hot-toast";
import { studentEndpoints } from "./apis";
import { apiConnector } from "./apiConnector";
import rzpLogo from "@shared/assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "@modules/course/store/courseSlice";
import { resetCart } from "@modules/course/store/cartSlice";
import type { AppDispatch } from "@shared/store/store";
import type { NavigateFunction, ApiError } from "@modules/auth/types";

// API Response Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string | T;
  data?: T;
}


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src: string): Promise<boolean> {
    return new Promise((resolve) => {
        // Only run on client-side
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            resolve(false);
            return;
        }

        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// ================ buyCourse ================ 
export async function buyCourse(
    token: string,
    coursesId: string[],
    userDetails: { firstName: string; email: string },
    navigate: NavigateFunction,
    dispatch: AppDispatch
) {
    const toastId = toast.loading("Loading...");

    try {
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        // initiate the order
        const orderResponse = await apiConnector<ApiResponse<{ currency: string; amount: number; id: string }>>("POST", COURSE_PAYMENT_API,
            { coursesId } as Record<string, unknown>,
            {
                Authorization: `Bearer ${token}`,
            })
        // console.log("orderResponse... ", orderResponse);
        if (!orderResponse.data.success) {
            throw new Error(typeof orderResponse.data.message === 'string' ? orderResponse.data.message : 'Payment failed');
        }

        const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || '';
        // console.log("RAZORPAY_KEY...", RAZORPAY_KEY);

        // Obtener los datos del mensaje (puede ser string o objeto)
        const orderData = typeof orderResponse.data.message === 'object' && orderResponse.data.message !== null
            ? orderResponse.data.message
            : orderResponse.data.data;

        if (!orderData || typeof orderData !== 'object') {
            throw new Error('Invalid order response format');
        }

        // options
        const options = {
            key: RAZORPAY_KEY,
            currency: (orderData as any).currency,
            amount: (orderData as any).amount,
            order_id: (orderData as any).id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo.src,
            prefill: {
                name: userDetails.firstName,
                email: userDetails.email
            },
            handler: function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                //send successful mail
                sendPaymentSuccessEmail(response, (orderData as any).amount, token);
                //verifyPayment
                verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("oops, payment failed");
            console.log("payment failed.... ", response.error);
        })

    }
    catch (error) {
        const apiError = error as ApiError;
        console.log("PAYMENT API ERROR.....", apiError);
        toast.error(apiError.response?.data?.message || "Could not make Payment");
    }
    toast.dismiss(toastId);
}


// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(
    response: { razorpay_order_id: string; razorpay_payment_id: string },
    amount: number,
    token: string
) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        } as Record<string, unknown>, {
            Authorization: `Bearer ${token}`
        })
    }
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}


// ================ verify payment ================
async function verifyPayment(
    bodyData: Record<string, unknown>,
    token: string,
    navigate: NavigateFunction,
    dispatch: AppDispatch
) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector<ApiResponse>("POST", COURSE_VERIFY_API, bodyData as unknown as Record<string, unknown>, {
            Authorization: `Bearer ${token}`,
        })

        if (!response.data.success) {
            throw new Error(typeof response.data.message === 'string' ? response.data.message : 'Payment verification failed');
        }
        
        // Invalidar cache del instructor para que se actualicen los datos de estudiantes
        // Importar dinámicamente para evitar dependencias circulares
        const { invalidateInstructorCache } = await import("@modules/instructor/hooks/useInstructorData");
        invalidateInstructorCache();
        
        // Disparar evento personalizado para refrescar datos del instructor
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
        }
        
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}