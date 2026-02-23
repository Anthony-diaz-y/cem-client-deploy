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
    <div className="min-h-[80vh] pt-24 pb-12 lg:pt-36 lg:pb-20">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 lg:flex-row">
        <div className="lg:w-[45%]">
          <ContactDetails />
        </div>
        <div className="lg:w-[55%]">
          <ContactForm />
        </div>
      </div>

      <div className="mt-32 px-5 hidden">
        <h1 className="text-center text-4xl font-bold mt-8 text-cem-neutral-gray-900">
          {CONTACT_TEXTS.reviews.title}
        </h1>
        <ReviewSlider />
      </div>
    </div>
  );
};

export default ContactContainer;
