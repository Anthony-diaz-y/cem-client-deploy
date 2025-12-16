import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseDetailsResponse } from "../types";

/**
 * Custom hook to fetch and manage course details
 * Separates data fetching logic from component
 */
export const useCourseDetails = () => {
  const { courseId } = useParams();
  const [response, setResponse] = useState<CourseDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetailsData = async () => {
      try {
        setLoading(true);
        // Normalize courseId to string (handle array case)
        const normalizedCourseId = Array.isArray(courseId)
          ? courseId[0]
          : courseId || "mock_id";

        // Mock Response for Demo
        const mockResponse: CourseDetailsResponse = {
          success: true,
          data: {
            courseDetails: {
              _id: normalizedCourseId,
              courseName: "MERN Stack Bootcamp 2024",
              courseDescription:
                "Go from zero to hero in Full Stack Web Development. Master React, Node.js, Express, and MongoDB.",
              thumbnail:
                "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
              price: 4999,
              whatYouWillLearn:
                "Build full-stack applications\nMaster React Hooks and Redux\nCreate RESTful APIs with Node.js\nDatabase management with MongoDB\nAuthentication and Authorization",
              courseContent: [
                {
                  _id: "sec1",
                  sectionName: "Introduction to Web Development",
                  subSection: [
                    {
                      _id: "sub1",
                      title: "Welcome to the Course",
                      timeDuration: "5:00",
                      description: "Intro",
                      videoUrl: "",
                    },
                    {
                      _id: "sub2",
                      title: "How the Web Works",
                      timeDuration: "10:30",
                      description: "Basics",
                      videoUrl: "",
                    },
                  ],
                },
                {
                  _id: "sec2",
                  sectionName: "React Fundamentals",
                  subSection: [
                    {
                      _id: "sub3",
                      title: "JSX and Components",
                      timeDuration: "15:00",
                      description: "React Basics",
                      videoUrl: "",
                    },
                    {
                      _id: "sub4",
                      title: "State and Props",
                      timeDuration: "20:00",
                      description: "Data flow",
                      videoUrl: "",
                    },
                  ],
                },
              ],
              ratingAndReviews: [
                {
                  _id: "rev1",
                  user: {
                    _id: "user1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                  },
                  rating: 5,
                  review: "Great course!",
                  course: normalizedCourseId,
                },
                {
                  _id: "rev2",
                  user: {
                    _id: "user2",
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane@example.com",
                  },
                  rating: 4,
                  review: "Very helpful",
                  course: normalizedCourseId,
                },
                {
                  _id: "rev3",
                  user: {
                    _id: "user3",
                    firstName: "Bob",
                    lastName: "Johnson",
                    email: "bob@example.com",
                  },
                  rating: 5,
                  review: "Excellent!",
                  course: normalizedCourseId,
                },
              ],
              instructor: {
                _id: "instructor1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                image: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
                additionalDetails: {
                  about:
                    "Senior Full Stack Developer with 10+ years of experience.",
                },
              },
              studentsEnrolled: ["user1", "user2", "user3"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tag: ["Web Development", "MERN", "JavaScript"],
              category: {
                _id: "cat1",
                name: "Web Development",
                description: "Web development courses",
              },
              instructions: ["Basic JavaScript knowledge"],
              status: "Published",
            },
            totalDuration: "12h 45m",
          },
        };
        // const res = await fetchCourseDetails(courseId)
        setResponse(mockResponse);
      } catch (error) {
        console.log("Could not fetch Course Details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetailsData();
  }, [courseId]);

  return { response, loading };
};
