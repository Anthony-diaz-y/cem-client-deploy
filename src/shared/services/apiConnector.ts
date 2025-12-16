import axios from "axios";
import { mockCourses, mockCategories, mockUserData, mockInstructorStats } from "../data/mockData";

// Flag to enable/disable mock mode
export const MOCK_MODE = true; // Set to false to use real backend

export const axiosInstance = axios.create({});

// Mock response helper
const createMockResponse = <T = unknown>(data: T, success: boolean = true, message: string = "Success") => {
    return Promise.resolve({
        data: {
            success,
            message,
            data
        }
    });
};

// Mock delay to simulate network request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Original apiConnector
const realApiConnector = (
    method: string,
    url: string,
    bodyData?: Record<string, unknown>,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ?? undefined,
        headers: headers ?? undefined,
        params: params ?? undefined,
    });
};

// In-memory state for mock mode (simulates server-side state)
interface MockCourse {
    _id: string;
    courseContent: Array<{
        _id: string;
        sectionName?: string;
        subSection?: Array<{
            _id: string;
            title?: string;
            description?: string;
            videoUrl?: string;
            timeDuration?: string;
        }>;
    }>;
}

const mockCourseState: Record<string, MockCourse> = {};

// Mock API responses based on URL patterns
const mockApiConnector = async (
    method: string,
    url: string,
    bodyData?: Record<string, unknown>,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
) => {
    console.log(`🎭 MOCK MODE: ${method} ${url}`, { bodyData, params });

    await mockDelay(300); // Simulate network delay

    // Get all courses
    if (url.includes('/course/getAllCourses') || url.includes('GET_ALL_COURSE_API')) {
        return createMockResponse(mockCourses);
    }

    // Get course categories
    if (url.includes('/course/showAllCategories') || url.includes('COURSE_CATEGORIES_API')) {
        return createMockResponse(mockCategories);
    }

    // Get course details
    if (url.includes('/course/getCourseDetails') || url.includes('COURSE_DETAILS_API')) {
        const courseId = bodyData?.courseId || params?.courseId;
        const course = mockCourses.find(c => c._id === courseId);
        if (course) {
            return createMockResponse({
                courseDetails: course,
                totalDuration: "8h 30m",
                completedVideos: []
            });
        }
        return createMockResponse(null, false, "Course not found");
    }

    // Get catalog page data
    if (url.includes('/course/getCategoryPageDetails') || url.includes('CATALOGPAGEDATA_API')) {
        const categoryId = bodyData?.categoryId || params?.categoryId;
        const categoryName = (bodyData?.categoryName || params?.categoryName) as string | undefined;

        let selectedCategory = mockCategories.find(cat =>
            cat._id === categoryId || (typeof categoryName === 'string' && cat.name.toLowerCase() === categoryName.toLowerCase())
        );

        if (!selectedCategory) {
            selectedCategory = mockCategories[0]; // Default to first category
        }

        const selectedCourses = mockCourses.filter(course =>
            course.category._id === selectedCategory._id
        );

        const differentCourses = mockCourses.filter(course =>
            course.category._id !== selectedCategory._id
        ).slice(0, 3);

        return createMockResponse({
            selectedCategory,
            selectedCourses,
            differentCourses,
            mostSellingCourses: mockCourses.slice(0, 3)
        });
    }

    // Get user enrolled courses
    if (url.includes('/profile/getEnrolledCourses') || url.includes('GET_USER_ENROLLED_COURSES_API')) {
        const enrolledCourseIds = mockUserData.student.courses;
        const enrolledCourses = mockCourses.filter(course =>
            enrolledCourseIds.includes(course._id)
        ).map(course => ({
            ...course,
            progressPercentage: Math.floor(Math.random() * 100),
            totalDuration: "8h 30m"
        }));
        return createMockResponse(enrolledCourses);
    }

    // Get user details
    if (url.includes('/profile/getUserDetails') || url.includes('GET_USER_DETAILS_API')) {
        // Check if user is instructor or student based on localStorage
        const userType = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        let userData = mockUserData.student;

        if (userType) {
            try {
                const parsedUser = JSON.parse(userType);
                if (parsedUser.accountType === 'Instructor') {
                    userData = {
                        ...mockUserData.instructor,
                        courseProgress: [] // Instructors don't have course progress, but type requires it
                    };
                }
            } catch (e) {
                console.log('Error parsing user data:', e);
            }
        }

        return createMockResponse(userData);
    }

    // Get instructor courses
    if (url.includes('/course/getInstructorCourses') || url.includes('GET_ALL_INSTRUCTOR_COURSES_API')) {
        const instructorCourses = mockCourses.filter(course =>
            course.instructor._id === mockUserData.instructor._id
        );
        return createMockResponse(instructorCourses);
    }

    // Get instructor dashboard stats
    if (url.includes('/profile/instructorDashboard') || url.includes('GET_INSTRUCTOR_DATA_API')) {
        return createMockResponse(mockInstructorStats);
    }

    // Get full course details (authenticated)
    if (url.includes('/course/getFullCourseDetails') || url.includes('GET_FULL_COURSE_DETAILS_AUTHENTICATED')) {
        const courseId = bodyData?.courseId || params?.courseId;
        const course = mockCourses.find(c => c._id === courseId);
        if (course) {
            return createMockResponse({
                courseDetails: course,
                totalDuration: "8h 30m",
                completedVideos: ["subsection1"],
                progressPercentage: 25
            });
        }
        return createMockResponse(null, false, "Course not found");
    }

    // Get all ratings/reviews
    if (url.includes('/course/getReviews') || url.includes('REVIEWS_DETAILS_API')) {
        const allReviews = mockCourses.flatMap(course =>
            course.ratingAndReviews.map(review => ({
                ...review,
                course: {
                    courseName: course.courseName,
                    _id: course._id
                }
            }))
        );
        return createMockResponse(allReviews);
    }

    // Create/Update operations - just return success
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        // For create/update/delete operations, return success
        if (url.includes('createCourse') || url.includes('CREATE_COURSE_API')) {
            const courseId = `course-${Date.now()}`;
            const newCourse = {
                _id: courseId,
                courseContent: []
            };
            // Store in mock state
            mockCourseState[courseId] = newCourse;
            return createMockResponse(newCourse, true, "Course created successfully");
        }
        if (url.includes('editCourse') || url.includes('EDIT_COURSE_API')) {
            return createMockResponse({ ...bodyData }, true, "Course updated successfully");
        }
        if (url.includes('addSection') || url.includes('CREATE_SECTION_API')) {
            if (!bodyData) {
                return createMockResponse(null, false, "Body data is required");
            }
            // Create a new section with the provided data
            const newSection = {
                _id: `section-${Date.now()}`,
                sectionName: bodyData.sectionName as string,
                subSection: []
            };

            // Get existing course state or create new one
            const courseId = (bodyData.courseId as string) || 'new-course-id';
            if (!mockCourseState[courseId]) {
                mockCourseState[courseId] = {
                    _id: courseId,
                    courseContent: []
                };
            }

            // Create new array with existing sections + new section (avoid mutating frozen arrays)
            const existingContent = Array.isArray(mockCourseState[courseId].courseContent)
                ? [...mockCourseState[courseId].courseContent]
                : [];

            mockCourseState[courseId] = {
                ...mockCourseState[courseId],
                courseContent: [...existingContent, newSection]
            };

            // Return updated course
            const updatedCourse = {
                ...mockCourseState[courseId]
            };

            return createMockResponse({ updatedCourseDetails: updatedCourse }, true, "Section created successfully");
        }
        if (url.includes('addSubSection') || url.includes('CREATE_SUBSECTION_API')) {
            if (!bodyData) {
                return createMockResponse(null, false, "Body data is required");
            }
            // Create a new subsection
            const newSubSection = {
                _id: `subsection-${Date.now()}`,
                title: bodyData.title as string,
                description: bodyData.description as string,
                videoUrl: (bodyData.videoUrl as string) || '',
                timeDuration: (bodyData.timeDuration as string) || '0:00'
            };

            // Add subsection to the correct section in course state
            const courseId = bodyData.courseId as string;
            const sectionId = bodyData.sectionId as string;

            if (mockCourseState[courseId]) {
                // Create new courseContent array with updated section (immutable)
                const updatedContent = mockCourseState[courseId].courseContent.map(section => {
                    if (section._id === sectionId) {
                        return {
                            ...section,
                            subSection: [...(section.subSection || []), newSubSection]
                        };
                    }
                    return section;
                });

                mockCourseState[courseId] = {
                    ...mockCourseState[courseId],
                    courseContent: updatedContent
                };
            }

            return createMockResponse(newSubSection, true, "Lecture added successfully");
        }
        if (url.includes('updateSection') || url.includes('UPDATE_SECTION_API')) {
            if (!bodyData) {
                return createMockResponse(null, false, "Body data is required");
            }
            const courseId = bodyData.courseId as string;
            const sectionId = bodyData.sectionId as string;

            if (mockCourseState[courseId]) {
                // Update section name immutably
                const updatedContent = mockCourseState[courseId].courseContent.map(section => {
                    if (section._id === sectionId) {
                        return {
                            ...section,
                            sectionName: bodyData.sectionName as string
                        };
                    }
                    return section;
                });

                mockCourseState[courseId] = {
                    ...mockCourseState[courseId],
                    courseContent: updatedContent
                };
            }

            const updatedCourse = mockCourseState[courseId] || {
                _id: courseId,
                courseContent: []
            };

            return createMockResponse(updatedCourse, true, "Section updated successfully");
        }
        if (url.includes('updateSubSection') || url.includes('UPDATE_SUBSECTION_API')) {
            return createMockResponse({ ...bodyData }, true, "Lecture updated successfully");
        }
        if (url.includes('deleteSection') || url.includes('DELETE_SECTION_API')) {
            if (!bodyData) {
                return createMockResponse(null, false, "Body data is required");
            }
            const courseId = bodyData.courseId as string;
            const sectionId = bodyData.sectionId as string;

            if (mockCourseState[courseId]) {
                mockCourseState[courseId].courseContent = mockCourseState[courseId].courseContent.filter(
                    (s: { _id: string }) => s._id !== sectionId
                );
            }

            const updatedCourse = mockCourseState[courseId] || {
                _id: courseId,
                courseContent: []
            };

            return createMockResponse(updatedCourse, true, "Section deleted successfully");
        }
        if (url.includes('deleteSubSection') || url.includes('DELETE_SUBSECTION_API')) {
            return createMockResponse({}, true, "Lecture deleted successfully");
        }
        if (url.includes('deleteCourse') || url.includes('DELETE_COURSE_API')) {
            return createMockResponse({}, true, "Course deleted");
        }
        if (url.includes('updateProfile') || url.includes('UPDATE_PROFILE_API')) {
            return createMockResponse({ ...mockUserData.student, ...bodyData }, true, "Profile updated");
        }
        if (url.includes('changePassword') || url.includes('CHANGE_PASSWORD_API')) {
            return createMockResponse({}, true, "Password changed successfully");
        }
        if (url.includes('createRating') || url.includes('CREATE_RATING_API')) {
            return createMockResponse({}, true, "Rating created");
        }
        if (url.includes('markLectureAsComplete') || url.includes('LECTURE_COMPLETION_API')) {
            return createMockResponse({}, true, "Lecture marked as complete");
        }
    }

    // If no mock found, log warning and return empty success
    console.warn(`⚠️ No mock data for: ${method} ${url}`);
    return createMockResponse({}, true, "Mock response - no specific handler");
};

// Export the apiConnector with mock capability
export const apiConnector = (
    method: string,
    url: string,
    bodyData?: Record<string, unknown>,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
) => {
    if (MOCK_MODE) {
        return mockApiConnector(method, url, bodyData, headers, params);
    }
    return realApiConnector(method, url, bodyData, headers, params);
};