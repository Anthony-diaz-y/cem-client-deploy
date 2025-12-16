import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { Category, CatalogPageData } from "../types";

/**
 * Custom hook to fetch and manage catalog data
 * Separates data fetching logic from component
 */
export const useCatalogData = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] =
    useState<CatalogPageData | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch All Categories
  useEffect(() => {
    (async () => {
      try {
        const res = (await fetchCourseCategories()) as Category[];
        const catalogNameStr = Array.isArray(catalogName)
          ? catalogName[0]
          : catalogName;
        if (catalogNameStr) {
          const category_id = res.filter(
            (ct: Category) =>
              ct.name.split(" ").join("-").toLowerCase() ===
              catalogNameStr.toLowerCase()
          )[0]?._id;
          if (category_id) {
            setCategoryId(category_id);
          }
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
    })();
  }, [catalogName]);

  // Fetch Catalog Page Data
  useEffect(() => {
    if (categoryId) {
      (async () => {
        setLoading(true);
        try {
          // Mock Data for Catalog
          const mockCatalogData: CatalogPageData = {
            selectedCategory: {
              name: "Web Development",
              description:
                "Master the art of web development with our comprehensive courses.",
              courses: [
                {
                  _id: "c1",
                  courseName: "MERN Stack Bootcamp",
                  price: 4999,
                  thumbnail:
                    "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
                  instructor: { firstName: "John", lastName: "Doe" },
                  ratingAndReviews: [],
                  studentsEnrolled: [],
                },
                {
                  _id: "c2",
                  courseName: "React Zero to Hero",
                  price: 2999,
                  thumbnail:
                    "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/react_thumb.jpg",
                  instructor: { firstName: "Jane", lastName: "Smith" },
                  ratingAndReviews: [],
                  studentsEnrolled: [],
                },
                {
                  _id: "c3",
                  courseName: "Node.js Advanced",
                  price: 3499,
                  thumbnail:
                    "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/node_thumb.jpg",
                  instructor: { firstName: "Mike", lastName: "Johnson" },
                  ratingAndReviews: [],
                  studentsEnrolled: [],
                },
              ],
            },
            differentCategory: {
              name: "Python",
              courses: [
                {
                  _id: "c4",
                  courseName: "Python Masterclass",
                  price: 1999,
                  thumbnail:
                    "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/python_thumb.jpg",
                  instructor: { firstName: "Sarah", lastName: "Lee" },
                  ratingAndReviews: [],
                  studentsEnrolled: [],
                },
              ],
            },
            mostSellingCourses: [
              {
                _id: "c1",
                courseName: "MERN Stack Bootcamp",
                price: 4999,
                thumbnail:
                  "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
                instructor: { firstName: "John", lastName: "Doe" },
                ratingAndReviews: [],
                studentsEnrolled: [],
              },
              {
                _id: "c5",
                courseName: "Java DSA Upgrade",
                price: 5999,
                thumbnail:
                  "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/java_thumb.jpg",
                instructor: { firstName: "David", lastName: "Brown" },
                ratingAndReviews: [],
                studentsEnrolled: [],
              },
            ],
          };
          // const res = await getCatalogPageData(categoryId)
          setCatalogPageData(mockCatalogData);
        } catch (error) {
          console.error("Error fetching catalog page data:", error);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  return { catalogPageData, loading };
};
