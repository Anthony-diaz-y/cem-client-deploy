// FAQ Section - Constants
// Datos para la sección "Preguntas frecuentes"

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "que-es-biologia-molecular",
    question: "¿Qué es el curso de Biología Molecular?",
    answer: "El curso de Biología Molecular explora en profundidad cómo las moléculas como el ADN, ARN y proteínas controlan los procesos fundamentales de la vida celular, incluyendo replicación, transcripción y traducción genética, con énfasis en aplicaciones prácticas en investigación y biotecnología.",
  },
  {
    id: "que-cubre-ingenieria-biomedica",
    question: "¿Qué cubre Ingeniería Biomédica?",
    answer: "La Ingeniería Biomédica integra principios de ingeniería con ciencias biológicas y médicas para desarrollar soluciones tecnológicas que mejoren la atención médica, incluyendo diseño de dispositivos médicos, sistemas de diagnóstico, biomateriales y tecnologías de rehabilitación.",
  },
  {
    id: "quienes-son-expertos",
    question: "¿Quiénes son los expertos?",
    answer: "Nuestros expertos son profesionales altamente calificados con amplia experiencia en investigación, docencia y práctica profesional en sus respectivas áreas. Incluyen doctores, investigadores y especialistas reconocidos en ciencias biomédicas, biología molecular e ingeniería biomédica.",
  },
  {
    id: "como-son-cursos-programas",
    question: "¿Cómo son los cursos y programas?",
    answer: "Nuestros cursos y programas combinan teoría sólida con práctica aplicada, utilizando metodologías modernas de enseñanza, casos de estudio reales, laboratorios virtuales y proyectos prácticos que permiten aplicar inmediatamente los conocimientos adquiridos en contextos profesionales.",
  },
  {
    id: "cuanto-duran-programas",
    question: "¿Cuánto duran los programas?",
    answer: "La duración de nuestros programas varía según el nivel y la profundidad del contenido. Ofrecemos cursos cortos de varias semanas, programas de certificación de varios meses, y programas completos de especialización. Cada programa está diseñado para ser flexible y adaptarse a diferentes ritmos de aprendizaje.",
  },
] as const;

