import { CEMModalLayout } from "@shared/components";

interface CategoryModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
    loading?: boolean;
}

/**
 * Wrapper para el layout base universal del sistema CEM
 * Utilizado específicamente para modales de categorías
 */
export const CategoryModalLayout: React.FC<CategoryModalLayoutProps> = (props) => {
    return (
        <CEMModalLayout {...props} />
    );
};
