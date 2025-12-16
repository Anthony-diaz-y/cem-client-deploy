"use client";

import Template from "../components/Template";
import OpenRoute from "../components/OpenRoute";
import signupImage from "@shared/assets/Images/signup2.webp";

function SignupContainer() {
  return (
    <OpenRoute>
      <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={signupImage}
        formType="signup"
      />
    </OpenRoute>
  );
}

export default SignupContainer;
