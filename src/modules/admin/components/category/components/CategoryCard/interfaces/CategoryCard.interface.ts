import type { Category } from "@shared/services/adminAPI";
import type { CourseItem } from "../../../types";

export interface CategoryCardProps {
    category: Category & {
        courses?: CourseItem[];
        expanded?: boolean;
        loading?: boolean;
        courseCount?: number;
    };
    onToggle: (categoryId: string) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}
