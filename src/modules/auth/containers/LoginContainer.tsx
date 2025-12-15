'use client'

import Template from '../components/Template'
import OpenRoute from '../components/OpenRoute'
import loginImage from '../../../shared/assets/Images/login2.webp'

function LoginContainer() {
  return (
    <OpenRoute>
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImage}
        formType="login"
      />
    </OpenRoute>
  )
}

export default LoginContainer

