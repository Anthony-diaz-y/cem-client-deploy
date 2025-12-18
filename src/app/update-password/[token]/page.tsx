import UpdatePasswordContainer from "@modules/auth/containers/UpdatePasswordContainer";

// Exportar metadata para mejorar SEO y evitar que Next.js muestre 404
export const metadata = {
  title: "Reset Password - E-Learning Platform",
  description: "Reset your password",
};

// Hacer la página dinámica para evitar problemas de caché
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function UpdatePassword() {
  return <UpdatePasswordContainer />;
}

