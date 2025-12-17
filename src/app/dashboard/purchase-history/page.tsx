"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Img from "@shared/components/Img";

// ========== TEMPORAL: Interface para datos de compra ==========
// TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS - Reemplazar con datos de la BD
interface PurchaseItem {
  _id: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  price: number;
  purchaseDate: string;
  status: "Completed" | "Pending" | "Refunded";
  transactionId: string;
  courseContent: { _id: string; subSection: { _id: string }[] }[];
}
// ============================================================

function PurchaseHistory() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[] | null>(null);

  useEffect(() => {
    // ========== TEMPORAL: Datos falsos para Purchase History ==========
    // TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS - Reemplazar con llamada a API
    const getPurchaseHistory = async () => {
      try {
        // Mock Data - Datos falsos simples para testing
        const mockPurchases: PurchaseItem[] = [
          {
            _id: "purchase1",
            courseName: "Full Stack Web Development",
            courseDescription: "Become a full-stack developer with MERN stack.",
            thumbnail:
              "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
            price: 2999,
            purchaseDate: "2024-01-15",
            status: "Completed",
            transactionId: "TXN-2024-001",
            courseContent: [{ _id: "sec1", subSection: [{ _id: "sub1" }] }],
          },
          {
            _id: "purchase2",
            courseName: "Machine Learning A-Z",
            courseDescription: "Learn Python for Data Science and Machine Learning.",
            thumbnail:
              "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/ml_thumb.jpg",
            price: 3999,
            purchaseDate: "2024-02-20",
            status: "Completed",
            transactionId: "TXN-2024-002",
            courseContent: [{ _id: "sec2", subSection: [{ _id: "sub2" }] }],
          },
          {
            _id: "purchase3",
            courseName: "Digital Marketing Masterclass",
            courseDescription: "Complete Digital Marketing course for beginners.",
            thumbnail:
              "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/marketing_thumb.jpg",
            price: 1999,
            purchaseDate: "2024-03-10",
            status: "Completed",
            transactionId: "TXN-2024-003",
            courseContent: [{ _id: "sec3", subSection: [{ _id: "sub3" }] }],
          },
        ];
        // TODO: Reemplazar con llamada real a API cuando se conecte con la BD
        // const res = await getPurchaseHistory(token);
        setPurchases(mockPurchases);
      } catch {
        console.log("Could not fetch purchase history.");
      }
    };

    getPurchaseHistory();
    // ============================================================
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "Pending":
        return "text-yellow-400";
      case "Refunded":
        return "text-red-400";
      default:
        return "text-richblack-300";
    }
  };

  return (
    <div>
      <h1 className="mb-14 text-4xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        Purchase History
      </h1>

      <div className="rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
        {!purchases ? (
          <p className="text-center text-richblack-300">Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="text-center text-richblack-300">
            Your purchase history will appear here.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-4 pb-4 border-b border-richblack-700 text-richblack-400 text-sm font-medium">
              <div>Course</div>
              <div className="text-center">Price</div>
              <div className="text-center">Date</div>
              <div className="text-center">Status</div>
              <div className="text-center">Transaction ID</div>
            </div>

            {/* Purchase Items */}
            {purchases.map((purchase, i) => (
              <div
                key={purchase._id}
                className={`flex flex-col sm:grid sm:grid-cols-5 gap-4 py-4 ${
                  i !== purchases.length - 1
                    ? "border-b border-richblack-700"
                    : ""
                }`}
              >
                {/* Course Info */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/view-course/${purchase._id}/section/${purchase.courseContent?.[0]?._id}/sub-section/${purchase.courseContent?.[0]?.subSection?.[0]?._id}`
                    );
                  }}
                >
                  <Img
                    src={purchase.thumbnail}
                    alt={purchase.courseName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-richblack-5">
                      {purchase.courseName}
                    </p>
                    <p className="text-xs text-richblack-300 line-clamp-2">
                      {purchase.courseDescription.length > 60
                        ? `${purchase.courseDescription.slice(0, 60)}...`
                        : purchase.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex sm:justify-center items-center">
                  <p className="text-richblack-5 font-semibold">
                    Rs. {purchase.price}
                  </p>
                </div>

                {/* Date */}
                <div className="flex sm:justify-center items-center">
                  <p className="text-richblack-300 text-sm">
                    {formatDate(purchase.purchaseDate)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex sm:justify-center items-center">
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      purchase.status
                    )}`}
                  >
                    {purchase.status}
                  </span>
                </div>

                {/* Transaction ID */}
                <div className="flex sm:justify-center items-center">
                  <p className="text-richblack-400 text-xs font-mono">
                    {purchase.transactionId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistory;
