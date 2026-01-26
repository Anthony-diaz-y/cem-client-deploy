import React from "react";
import { Footer, ReviewSlider } from "@shared/components";
import ContactDetails from "../components/ContactDetails";
import ContactForm from "../components/ContactForm";
import { CONTACT_TEXTS } from "../constants/contact.constants";

/**
 * ContactContainer - Container component for Contact page
 * Minimal logic container following Scream Modular Architecture
 */
const ContactContainer = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>

      <div className="my-20 px-5 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          {CONTACT_TEXTS.reviews.title}
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  );
};

export default ContactContainer;
