import type { Category } from "@shared/services/adminAPI";
import type { CourseItem } from "../../../types";

export interface CategoryCardProps {
    category: Category & {
        courses?: CourseItem[];
        expanded?: boolean;
        loading?: boolean;
        courseCount?: number;
    };
    draggedCourse: {
        courseId: string;
        sourceCategoryId: string;
        courseName: string;
    } | null;
    isDragOver: boolean;
    onToggle: (categoryId: string) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onDragStart: (e: React.DragEvent, courseId: string, sourceCategoryId: string, courseName: string) => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent, categoryId: string) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, categoryId: string) => void;
}
