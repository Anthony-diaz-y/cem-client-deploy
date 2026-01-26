"use client";

import Template from "../components/Template";
import OpenRoute from "../components/OpenRoute";
import signupImage from "@shared/assets/Images/signup2.webp";
import { AUTH_TEXTS } from "../constants/auth.constants";

function SignupContainer() {
  return (
    <OpenRoute>
      <Template
        title={AUTH_TEXTS.signup.title}
        description1={AUTH_TEXTS.signup.description1}
        description2={AUTH_TEXTS.signup.description2}
        image={signupImage}
        formType="signup"
      />
    </OpenRoute>
  );
}

export default SignupContainer;
