"use client";

import Template from "../components/Template";
import OpenRoute from "../components/OpenRoute";
import loginImage from "@shared/assets/Images/login2.webp";
import { AUTH_TEXTS } from "../constants/auth.constants";

function LoginContainer() {
  return (
    <OpenRoute>
      <Template
        title={AUTH_TEXTS.login.title}
        description1={AUTH_TEXTS.login.description1}
        description2={AUTH_TEXTS.login.description2}
        image={loginImage}
        formType="login"
      />
    </OpenRoute>
  );
}

export default LoginContainer;
