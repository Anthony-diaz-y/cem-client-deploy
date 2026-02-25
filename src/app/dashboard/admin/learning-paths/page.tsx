import LearningPathsContainer from "@/modules/admin/containers/LearningPathsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Rutas de Aprendizaje | CEM Admin",
  description:
    "Administra las trayectorias educativas y rutas de aprendizaje del CEM.",
};

export default function LearningPathsPage() {
  return <LearningPathsContainer />;
}
