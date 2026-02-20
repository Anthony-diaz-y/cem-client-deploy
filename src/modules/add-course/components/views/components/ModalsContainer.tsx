import { SubSection } from "@modules/course/types";
import { ConfirmationModal, type ConfirmationModalData } from "@shared/components";
import SubSectionModal from "../../modals/SubSectionModal";
import QuizModal from "../../modals/QuizModal";
import MoveLectureWarningModal from "../../modals/MoveLectureWarningModal";

interface ModalsContainerProps {
  addSubSection: string | null;
  viewSubSection: SubSection | null;
  editSubSection: (SubSection & { sectionId: string }) | null;
  editQuiz: (SubSection & { sectionId: string }) | null;
  confirmationModal: ConfirmationModalData | null;
  showMoveWarning: boolean;
  pendingMove: {
    lecture: SubSection;
    fromSectionName: string;
    toSectionName: string;
  } | null;
  setAddSubsection: React.Dispatch<React.SetStateAction<string | null>>;
  setViewSubSection: React.Dispatch<React.SetStateAction<SubSection | null>>;
  setEditSubSection: React.Dispatch<React.SetStateAction<(SubSection & { sectionId: string }) | null>>;
  setEditQuiz: React.Dispatch<React.SetStateAction<(SubSection & { sectionId: string }) | null>>;
  confirmMoveLecture: () => void;
  cancelMoveLecture: () => void;
}

// Componente para renderizar todos los modales
export default function ModalsContainer({
  addSubSection,
  viewSubSection,
  editSubSection,
  editQuiz,
  confirmationModal,
  showMoveWarning,
  pendingMove,
  setAddSubsection,
  setViewSubSection,
  setEditSubSection,
  setEditQuiz,
  confirmMoveLecture,
  cancelMoveLecture,
}: ModalsContainerProps) {
  return (
    <>
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={(value) => {
            if (typeof value === "function") {
              setAddSubsection((prev) => {
                const newValue = value(prev as string | (SubSection & { sectionId?: string }) | null);
                return typeof newValue === "string" ? newValue : null;
              });
            } else {
              setAddSubsection(typeof value === "string" ? value : null);
            }
          }}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={(value) => {
            if (typeof value === "function") {
              setViewSubSection((prev) => {
                const newValue = value(prev as string | (SubSection & { sectionId?: string }) | null);
                return typeof newValue === "object" && newValue !== null
                  ? (newValue as SubSection)
                  : null;
              });
            } else {
              setViewSubSection(
                typeof value === "object" && value !== null
                  ? (value as SubSection)
                  : null
              );
            }
          }}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={(value) => {
            if (typeof value === "function") {
              setEditSubSection((prev) => {
                const newValue = value(prev as string | (SubSection & { sectionId?: string }) | null);
                return typeof newValue === "object" && newValue !== null
                  ? (newValue as SubSection & { sectionId: string })
                  : null;
              });
            } else {
              setEditSubSection(
                typeof value === "object" && value !== null
                  ? (value as SubSection & { sectionId: string })
                  : null
              );
            }
          }}
          edit={true}
        />
      ) : editQuiz ? (
        <QuizModal
          modalData={editQuiz}
          setModalData={(value) => setEditQuiz(typeof value === "object" ? (value as SubSection & { sectionId: string }) : null)}
          edit={true}
        />
      ) : null}

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}

      {pendingMove && (
        <MoveLectureWarningModal
          isOpen={showMoveWarning}
          lecture={pendingMove.lecture}
          fromSectionName={pendingMove.fromSectionName}
          toSectionName={pendingMove.toSectionName}
          onConfirm={confirmMoveLecture}
          onCancel={cancelMoveLecture}
        />
      )}
    </>
  );
}


