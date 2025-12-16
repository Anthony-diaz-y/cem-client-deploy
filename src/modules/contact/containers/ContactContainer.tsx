import React from "react";

import Footer from "@shared/components/Footer";
import ContactDetails from "../components/ContactDetails";
import ContactForm from "../components/ContactForm";
import ReviewSlider from "@shared/components/ReviewSlider";

/**
 * ContactContainer - Container component for Contact page
 * Handles all business logic and renders the Contact page UI
 */
const ContactContainer = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>

      {/* Reviews from Other Learners */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactContainer;
