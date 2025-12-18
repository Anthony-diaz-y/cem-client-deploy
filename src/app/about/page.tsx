import AboutContainer from "@modules/about/containers/AboutContainer";

// Hacer la página estática para mejorar el rendimiento
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default function About() {
  return <AboutContainer />;
}
