/**
 * Tipos compartidos para los componentes de categorías
 */

import { Category } from "@shared/services/adminAPI";

export interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  token: string;
  onClose: () => void;
  onSuccess: (updatedCategories?: Category[]) => void;
}

export interface CourseItem {
  id: string;
  courseName: string;
  status: "Published" | "Draft";
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

