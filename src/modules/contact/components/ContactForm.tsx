import ContactUsForm from "./ContactUsForm";
import { CONTACT_TEXTS } from "../constants/contact.constants";

const ContactForm = () => {
  return (
    <div className="border border-cem-neutral-gray-200 text-cem-neutral-gray-600 rounded-xl p-7 lg:p-14 flex gap-3 flex-col bg-white">
      <h1 className="text-4xl leading-10 font-bold text-cem-neutral-gray-900">
        {CONTACT_TEXTS.form.title}
      </h1>
      <p className="text-cem-neutral-gray-500">
        {CONTACT_TEXTS.form.description}
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
