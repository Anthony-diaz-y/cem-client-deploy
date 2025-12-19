import ContactContainer from "@modules/contact/containers/ContactContainer";

// La página debe ser dinámica porque tiene un formulario que envía datos
export const dynamic = 'force-dynamic';

export default function Contact() {
  return <ContactContainer />;
}
