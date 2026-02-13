import { useState, useRef, useEffect } from "react";
import {
    AdminCourse,
    publishCourse,
    deleteCourseAdmin,
    editCourseAdmin,
} from "@shared/services/adminAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { useCourseFilters } from "../../../../hooks/course/useCourseFilters";

interface Category {
    id?: string;
    _id?: string;
    name: string;
}

export type CourseFiltersType = {
    search?: string;
    status?: string;
    categoryId?: string;
    instructorId?: string;
};

export interface UseAllCoursesTableProps {
    courses: AdminCourse[];
    token: string;
    onUpdate: () => void;
    filters?: CourseFiltersType;
    onFiltersChange?: (filters: CourseFiltersType) => void;
    searchInput?: string;
    onSearchInputChange?: (value: string) => void;
    loadMore?: () => void;
    hasMore?: boolean;
}

export const useAllCoursesTable = ({
    courses,
    token,
    onUpdate,
    filters,
    onFiltersChange,
    searchInput: externalSearchInput,
    onSearchInputChange,
    loadMore,
    hasMore,
}: UseAllCoursesTableProps) => {
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        type: "publish" | "unpublish" | "delete" | null;
        course: AdminCourse | null;
    }>({
        isOpen: false,
        type: null,
        course: null,
    });

    const observerTarget = useRef(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    // Infinite Scroll Observer
    useEffect(() => {
        if (!loadMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: "800px" }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, hasMore]);

    // Load Categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await fetchCourseCategories();
                if (categories && Array.isArray(categories)) {
                    setAllCategories(categories);
                }
            } catch {
                // Error handled by service
            }
        };

        loadCategories();
    }, []);

    // Local State Filters
    const [localStatusFilter, setLocalStatusFilter] = useState<
        "all" | "Draft" | "Published"
    >("all");
    const [localCategoryFilter, setLocalCategoryFilter] = useState<string>("all");
    const [localInstructorFilter, setLocalInstructorFilter] =
        useState<string>("all");
    const [localSearchQuery, setLocalSearchQuery] = useState<string>("");

    // Determine Active Filters (External vs Local)
    const statusFilter: "all" | "Draft" | "Published" =
        filters?.status &&
            (filters.status === "all" ||
                filters.status === "Draft" ||
                filters.status === "Published")
            ? (filters.status as "all" | "Draft" | "Published")
            : localStatusFilter;
    const categoryFilter = filters?.categoryId || localCategoryFilter;
    const instructorFilter = filters?.instructorId || localInstructorFilter;
    const searchQuery = filters?.search || localSearchQuery;
    const searchInput =
        externalSearchInput !== undefined ? externalSearchInput : localSearchQuery;

    const hasBackendFilters =
        filters &&
        ((filters.search !== undefined &&
            filters.search !== null &&
            filters.search.trim() !== "") ||
            (filters.status !== undefined &&
                filters.status !== null &&
                filters.status !== "all") ||
            (filters.categoryId !== undefined &&
                filters.categoryId !== null &&
                filters.categoryId !== "all") ||
            (filters.instructorId !== undefined &&
                filters.instructorId !== null &&
                filters.instructorId !== "all"));

    const shouldFilterLocally = !hasBackendFilters;

    // Filter Logic
    const { filteredCourses, categories, instructors } = useCourseFilters(
        courses,
        shouldFilterLocally ? statusFilter : "all",
        shouldFilterLocally ? categoryFilter : "all",
        shouldFilterLocally ? instructorFilter : "all",
        shouldFilterLocally ? searchQuery : "",
        allCategories
    );

    const displayCourses = hasBackendFilters ? courses : filteredCourses;

    // Handlers
    const handleStatusChange = (value: "all" | "Draft" | "Published") => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, status: value });
        } else {
            setLocalStatusFilter(value);
        }
    };

    const handleCategoryChange = (value: string) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, categoryId: value });
        } else {
            setLocalCategoryFilter(value);
        }
    };

    const handleInstructorChange = (value: string) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, instructorId: value });
        } else {
            setLocalInstructorFilter(value);
        }
    };

    const handleSearchChange = (value: string) => {
        if (onSearchInputChange) {
            onSearchInputChange(value);
        } else {
            setLocalSearchQuery(value);
        }
    };

    // Actions Handlers
    const handlePublishClick = (course: AdminCourse) => {
        setConfirmationModal({ isOpen: true, type: "publish", course });
    };

    const handleUnpublishClick = (course: AdminCourse) => {
        setConfirmationModal({ isOpen: true, type: "unpublish", course });
    };

    const handleDeleteClick = (course: AdminCourse) => {
        setConfirmationModal({ isOpen: true, type: "delete", course });
    };

    const handleConfirm = async () => {
        if (!confirmationModal.course) return;

        let success = false;
        if (confirmationModal.type === "publish") {
            success = await publishCourse(confirmationModal.course.id, token);
        } else if (confirmationModal.type === "unpublish") {
            const result = await editCourseAdmin(
                confirmationModal.course.id,
                { status: COURSE_STATUS.DRAFT },
                token
            );
            success = result !== null;
        } else if (confirmationModal.type === "delete") {
            success = await deleteCourseAdmin(confirmationModal.course.id, token);
        }

        if (success) {
            setConfirmationModal({ isOpen: false, type: null, course: null });
            onUpdate();
        }
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({ isOpen: false, type: null, course: null });
    };

    return {
        observerTarget,
        displayCourses,
        categories,
        instructors,
        statusFilter,
        categoryFilter,
        instructorFilter,
        searchInput,
        handlers: {
            handleStatusChange,
            handleCategoryChange,
            handleInstructorChange,
            handleSearchChange,
            handlePublishClick,
            handleUnpublishClick,
            handleDeleteClick,
            handleConfirm,
            closeConfirmationModal,
        },
        confirmationModal,
    };
};
