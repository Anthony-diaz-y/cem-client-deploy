import HomeContainer from "@modules/home/containers/HomeContainer";

// Hacer la página estática para mejorar el rendimiento
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default function Home() {
  return <HomeContainer />;
}
