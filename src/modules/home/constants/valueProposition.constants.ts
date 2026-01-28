// Value Proposition Section - Constants
// Datos para la sección "Nuestra propuesta de valor"

export interface ValuePropositionCard {
  id: string;
  title: string;
  description: string;
  iconName: "Formacion" | "Colaboracion" | "Acompanamiento" | "Metodologia" | "Respaldo";
  isLarge?: boolean;
  bgColor: "teal" | "white";
}

export const VALUE_PROPOSITION_CARDS: ValuePropositionCard[] = [
  {
    id: "formacion",
    title: "Formación y desarrollo",
    description:
      "Formación aplicada a la empleabilidad y al desarrollo profesional, con énfasis en tecnologías y técnicas modernas.",
    iconName: "Formacion",
    isLarge: true,
    bgColor: "white",
  },
  {
    id: "colaboracion",
    title: "Colaboración",
    description:
      "Ecosistema colaborativo que conecta a empresas, investigadores, docentes y estudiantes.",
    iconName: "Colaboracion",
    bgColor: "white",
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento",
    description:
      "Acompañamiento híbrido (asincrónico + sincrónico) con asesorías en tiempo real para resolver dudas y avanzar con confianza.",
    iconName: "Acompanamiento",
    bgColor: "white",
  },
  {
    id: "metodologia",
    title: "Metodología",
    description:
      "Experiencia de aprendizaje distinta a los cursos virtuales tradicionales: dinámica, eficiente y centrada en el estudiante.",
    iconName: "Metodologia",
    bgColor: "white",
  },
  {
    id: "respaldo",
    title: "Respaldo",
    description:
      "Respaldo de aliados, concursos ganados y prestigio de los especialistas que imparten los cursos.",
    iconName: "Respaldo",
    bgColor: "white",
  },
];

