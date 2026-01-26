import { useState, useCallback } from "react";
import { ClaseProgramada } from "@/types/scheduledClasses.types";
import { actualizarClaseProgramada, eliminarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

interface UseClassModalsReturn {
  claseSeleccionada: ClaseProgramada | null;
  editModalAbierto: boolean;
  deleteModal: { isOpen: boolean; classId: string | null };
  canEdit: (clase: ClaseProgramada) => boolean;
  handleEdit: (classId: string, classes: ClaseProgramada[]) => void;
  handleDelete: (classId: string) => void;
  handleToggleActive: (classId: string, isActive: boolean, token: string, userAccountType?: string, onSuccess?: () => void) => Promise<void>;
  confirmDelete: (token: string, userAccountType?: string, onSuccess?: () => void) => Promise<void>;
  openEditModal: (clase: ClaseProgramada) => void;
  closeEditModal: () => void;
  closeDeleteModal: () => void;
}

export function useClassModals(
  user: { id: string; accountType: string } | null
): UseClassModalsReturn {
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseProgramada | null>(null);
  const [editModalAbierto, setEditModalAbierto] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; classId: string | null }>({
    isOpen: false,
    classId: null,
  });

  const canEdit = useCallback((clase: ClaseProgramada) => {
    if (!user) return false;
    return user.accountType === 'Admin' || 
           (user.accountType === 'Instructor' && clase.createdBy.id === user.id);
  }, [user]);

  const handleEdit = useCallback((classId: string, classes: ClaseProgramada[]) => {
    const clase = classes.find((c) => c.id === classId);
    if (clase && canEdit(clase)) {
      setClaseSeleccionada(clase);
      setEditModalAbierto(true);
    } else if (clase && !canEdit(clase)) {
      toast.error(SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.errors.editOwnOnly);
    }
  }, [canEdit]);

  const handleDelete = useCallback((classId: string) => {
    setDeleteModal({ isOpen: true, classId });
  }, []);

  const handleToggleActive = useCallback(async (
    classId: string, 
    isActive: boolean, 
    token: string,
    userAccountType?: string,
    onSuccess?: () => void
  ): Promise<void> => {
    if (userAccountType !== 'Admin') {
      toast.error(SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.errors.toggleActiveAdminOnly);
      return;
    }
    try {
      await actualizarClaseProgramada(classId, { isActive }, token);
      toast.success(isActive ? SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.success.activated : SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.success.deactivated);
      onSuccess?.();
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.errors.toggleActiveError;
      toast.error(mensaje);
    }
  }, []);

  const confirmDelete = useCallback(async (
    token: string,
    userAccountType?: string,
    onSuccess?: () => void
  ) => {
    if (!deleteModal.classId) return;
    
    if (userAccountType !== 'Admin') {
      toast.error(SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.errors.deleteAdminOnly);
      setDeleteModal({ isOpen: false, classId: null });
      return;
    }

    try {
      await eliminarClaseProgramada(deleteModal.classId, token);
      toast.success(SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.success.deleted);
      setDeleteModal({ isOpen: false, classId: null });
      onSuccess?.();
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.hooks.useClassModals.errors.deleteError;
      toast.error(mensaje);
    }
  }, [deleteModal.classId]);

  const openEditModal = useCallback((clase: ClaseProgramada) => {
    setClaseSeleccionada(clase);
    setEditModalAbierto(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalAbierto(false);
    setClaseSeleccionada(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, classId: null });
  }, []);

  return {
    claseSeleccionada,
    editModalAbierto,
    deleteModal,
    canEdit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    confirmDelete,
    openEditModal,
    closeEditModal,
    closeDeleteModal,
  };
}

