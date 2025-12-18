import ContactContainer from "@modules/contact/containers/ContactContainer";

// Hacer la página estática para mejorar el rendimiento
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default function Contact() {
  return <ContactContainer />;
}
