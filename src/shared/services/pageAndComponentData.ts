// import { toast } from "react-hot-toast"
import { apiConnector } from './apiConnector';
import { catalogData } from './apis';
import type { ApiError } from '@modules/auth/types';


// ================ get Catalog Page Data  ================
export const getCatalogPageData = async (categoryId: string) => {
  // const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId, });

    if (!response?.data?.success)
      throw new Error("Could not Fetch Category page data");

    console.log("CATALOG PAGE DATA API RESPONSE............", response)
    result = response?.data?.data;

  }
  catch (error) {
    const apiError = error as ApiError & { response?: { data?: { data?: unknown } } };
    console.log("CATALOG PAGE DATA API ERROR....", apiError);
    // toast.error(apiError.response?.data?.message);
    result = (apiError.response?.data as { data?: unknown })?.data as unknown[] || [];
  }
  // toast.dismiss(toastId);
  return result;
}

