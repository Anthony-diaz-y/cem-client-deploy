// Contact Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type { ContactFormData, ContactDetail } from "./types";

// Constants
export { CONTACT_TEXTS } from "./constants/contact.constants";

// Data
export { contactDetails } from "./data";

// Hooks
export { useContactForm } from "./hooks/useContactForm";
export type { UseContactFormReturn } from "./hooks/useContactForm";

// Services
export * from "./services/contactAPI";

// Components
export { default as ContactDetails } from "./components/ContactDetails";
export { default as ContactForm } from "./components/ContactForm";
export { default as ContactUsForm } from "./components/ContactUsForm";
export { default as CountryCodeDropdown } from "./components/CountryCodeDropdown";

// Containers
export { default as ContactContainer } from "./containers/ContactContainer";
