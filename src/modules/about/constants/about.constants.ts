import { StaffMember, StatItem, Testimonial } from "../interfaces/about.interfaces";

export const STATS: StatItem[] = [
  { label: "Estudiantes", value: "5K" },
  { label: "Mentores", value: "10+" },
  { label: "Cursos", value: "+200" },
  { label: "Premios", value: "+50" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "User 1",
    role: "Product Manager",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamcoLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    rating: 4,
  },
  {
    name: "User 2",
    role: "Biology",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamcoLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    rating: 4,
  },
  {
    name: "User 3",
    role: "Product Manager",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamcoLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    rating: 4,
  },
];

export const STAFF_CATEGORIES = [
  "Fundadores",
  "Dirección académica",
  "Divulgación científica",
  "Comunidad",
  "Marketing",
  "Servicios especializados",
];

export const ALL_STAFF_MEMBERS: StaffMember[] = [
  { id: 1, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal 1.png" },
  { id: 2, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal2.png" },
  { id: 3, name: "Nombre Apellido", role: "Cargo", category: "Dirección académica", image: "/staff/personal3.png" },
  { id: 4, name: "Nombre Apellido", role: "Cargo", category: "Divulgación científica", image: "/staff/personal4.png" },
  { id: 5, name: "Nombre Apellido", role: "Cargo", category: "Comunidad", image: "/staff/personal5.png" },
  { id: 6, name: "Nombre Apellido", role: "Cargo", category: "Marketing", image: "/staff/personal6.png" },
  { id: 7, name: "Nombre Apellido", role: "Cargo", category: "Servicios especializados", image: "/staff/personal7.png" },
  { id: 8, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal8.png" },
];
