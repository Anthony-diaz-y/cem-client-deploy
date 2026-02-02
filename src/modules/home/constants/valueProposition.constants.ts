// Value Proposition Section - Constants
// Datos para la sección "Nuestra propuesta de valor"

export interface ValuePropositionCard {
  id: string;
  title: string;
  description: string;
  iconName:
    | "Formacion"
    | "Colaboracion"
    | "Acompanamiento"
    | "Metodologia"
    | "Respaldo";
  isLarge?: boolean;
  bgColor: "teal" | "white";
}

export const VALUE_PROPOSITION_CARDS: ValuePropositionCard[] = [
  {
    id: "formacion",
    title: "Flexibilidad",
    description:
      "Estudia a tu ritmo en cursos asincrónicos o interactúa en vivo en cursos híbridos. Tú gestionas tu agenda.",
    iconName: "Formacion",
    isLarge: true,
    bgColor: "white",
  },
  {
    id: "colaboracion",
    title: "Colaboración y Redes",
    description:
      "Accede a un ecosistema que te conecta con empresas, instituciones y líderes del sector y amplía tus oportunidades de desarrollo.",
    iconName: "Colaboracion",
    bgColor: "white",
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento",
    description:
      "Asesoría profesional y soporte en tiempo real para garantizar tu aprendizaje.",
    iconName: "Acompanamiento",
    bgColor: "white",
  },
  {
    id: "metodologia",
    title: "Metodología",
    description:
      "Formación moderna, dinámica y eficiente, diseñada para potenciar el desarrollo profesional del estudiante.",
    iconName: "Metodologia",
    bgColor: "white",
  },
  {
    id: "respaldo",
    title: "Respaldo",
    description:
      "Certifícate con el aval de especialistas altamente calificados y alianzas institucionales de prestigio",
    iconName: "Respaldo",
    bgColor: "white",
  },
];
