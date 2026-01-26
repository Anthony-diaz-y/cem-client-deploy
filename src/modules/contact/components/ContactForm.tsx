import ContactUsForm from "./ContactUsForm";
import { CONTACT_TEXTS } from "../constants/contact.constants";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
      <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
        {CONTACT_TEXTS.form.title}
      </h1>
      <p className="">
        {CONTACT_TEXTS.form.description}
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
