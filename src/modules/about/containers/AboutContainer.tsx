"use client";

import { ValuePropositionSection } from "@/modules/home/components/valueProposition";
import { RatingStars } from "@shared/components";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

const stats = [
  { label: "Estudiantes", value: "5K" },
  { label: "Mentores", value: "10+" },
  { label: "Cursos", value: "+200" },
  { label: "Premios", value: "+50" },
];

const testimonials = [
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

const staffCategories = [
  "Fundadores",
  "Dirección académica",
  "Divulgación científica",
  "Comunidad",
  "Marketing",
  "Servicios especializados",
];

interface StaffMember {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
}

const allStaffMembers: StaffMember[] = [
  { id: 1, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal 1.png" },
  { id: 2, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal2.png" },
  { id: 3, name: "Nombre Apellido", role: "Cargo", category: "Dirección académica", image: "/staff/personal3.png" },
  { id: 4, name: "Nombre Apellido", role: "Cargo", category: "Divulgación científica", image: "/staff/personal4.png" },
  { id: 5, name: "Nombre Apellido", role: "Cargo", category: "Comunidad", image: "/staff/personal5.png" },
  { id: 6, name: "Nombre Apellido", role: "Cargo", category: "Marketing", image: "/staff/personal6.png" },
  { id: 7, name: "Nombre Apellido", role: "Cargo", category: "Servicios especializados", image: "/staff/personal7.png" },
  { id: 8, name: "Nombre Apellido", role: "Cargo", category: "Fundadores", image: "/staff/personal8.png" },
];

const StaffCard = ({ member }: { member: StaffMember }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flex flex-col gap-4 w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="relative w-full aspect-[4/5] [perspective:1000px] cursor-pointer">
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover rounded-[30px] grayscale"
            />
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-cem-accent rounded-[30px] p-6 flex items-center justify-center text-center">
            <p className="text-cem-neutral-gray-700 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fermentum iaculis turpis morbi libero. Sodales commodo arcu mi aliquam amet.
            </p>
          </div>
        </motion.div>
      </div>
      <div>
        <h4 className="text-[20px] font-bold text-cem-neutral-gray-900">{member.name}</h4>
        <p className="text-cem-neutral-gray-500 text-[14px]">{member.role}</p>
      </div>
    </div>
  );
};

const AboutContainer = () => {
  const [activeCategory, setActiveCategory] = useState("Fundadores");

  const filteredStaff = useMemo(() => {
    const base = allStaffMembers.filter(m => m.category === activeCategory);
    if (base.length < 4) {
      const others = allStaffMembers.filter(m => m.category !== activeCategory);
      return [...base, ...others].slice(0, 8);
    }
    return base;
  }, [activeCategory]);

  return (
    <section className="flex flex-col h-full w-full justify-center items-center">
      <div className="w-full mt-16">
        <section className="px-6 xl:px-40 bg-cem-accent h-[215px] md:h-[250px] xl:h-[300px] w-full flex justify-center lg:items-center ">
          <h2 className="text-[24px] md:text-[28px] xl:text-[42px] font-bold text-center leading-[32px] xl:leading-[46px] max-w-[300px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[1000px] mt-5 lg:mt-0">
            Impulsando la innovación en la educación en línea para un futuro más brillante
          </h2>
        </section>

        <section className="w-full flex gap-10 xl:gap-20 justify-center flex-col items-center">
          <div className="mt-[-48px] md:mt-[-112px] lg:mt-[-64px] xl:mt-[-40px]">
            <Image
              src="/videoprueba.png"
              alt="Video de prueba"
              width={992}
              height={302}
              className="w-[304px] md:w-[440px] lg:w-[600px] xl:w-[992px] h-auto rounded-xl shadow-lg"
            />
          </div>

          <div className="max-w-[1200px] px-8 xl:px-36 text-center flex flex-col gap-6">
            <p className="text-[16px] lg:text-[20px] xl:text-[28px] font-medium leading-[22px] xl:leading-[40px]">
              {'"En CEM, estamos convencidos de que a través de la cooperación podemos emprender proyectos de gran impacto y resolver desafíos complejos. Nuestros aliados, colaboradores y usuarios son nuestra prioridad; por ello, nos comprometemos a brindarles un experiencia de alto valor en nuestra plataforma. ¡Bienvenidos a esta comunidad!"'}
            </p>
            <p className="text-[16px] xl:text-[18px]">Mario Taira - CEO</p>
          </div>

          <div className="flex flex-col-reverse xl:flex-row justify-between w-full items-center max-w-[1200px] px-8 xl:px-0">
            <div className="xl:w-1/2 flex flex-col gap-5 xl:gap-6 xl:-mt-24">
              <h3 className="text-[32px] font-semibold mt-8 xl:mt-0">Nuestra historia</h3>
              <p className="text-[16px] xl:max-w-md">
                El Centro de Epecialización Multidisciplinario (CEM), es una empresa comprometida con el desarrollo académico y profesional, la transferencia tecnológica y el fortalecimiento del ecosistema y la cultura científica del país. Nuestra labor se centra en brindar capacitaciones, asesorías y otros servicios especializados de alta calidad a través de una plataforma colaborativa, innovadora, eficiente y descentralizada.
              </p>
            </div>
            <div className="w-full xl:w-1/2 flex justify-center xl:justify-end">
              <Image src="/about-img.svg" alt="Imagen de historia" width={535} height={200} className="w-full max-w-[535px] h-auto" />
            </div>
          </div>
        </section>

        <section className="bg-cem-primary mt-32 flex items-center justify-center py-16">
          <div className="flex flex-col md:flex-row w-full max-w-[1200px] justify-around items-center text-white text-center gap-7 md:gap-0">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1 justify-center items-center">
                <h4 className="text-[48px] font-bold">{stat.value}</h4>
                <p className="text-[28px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col justify-center items-center">
          <ValuePropositionSection />
        </section>

        <section className="flex flex-col items-center justify-center py-16 bg-cem-accent px-5 lg:px-0">
          <h3 className="text-[16px] uppercase inline-block mb-4">Testimonios</h3>
          <h2 className="text-[36px] font-semibold mb-12">Autoridades nos recomiendan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px]">
            {testimonials.map((testi, index) => (
              <div key={index} className="bg-white rounded-[40px] p-8 flex flex-col gap-6 shadow-sm">
                <RatingStars Review_Count={testi.rating} Star_Size={20} />
                <p className="text-cem-neutral-gray-600 text-[18px] leading-[24px]">
                  {testi.text}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white font-bold">
                    MW
                  </div>
                  <div>
                    <h4 className="font-bold text-cem-neutral-gray-900">{testi.name}</h4>
                    <p className="text-cem-neutral-gray-500 text-sm">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-center items-center mt-20 mb-32 px-6">
          <div className="max-w-[1200px] w-full">
            <h2 className="text-[36px] font-semibold mb-8">Conoce al equipo</h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-12 text-sm md:text-base overflow-x-auto pb-2 no-scrollbar">
              {staffCategories.map((cat, idx) => (
                <div key={cat} className="flex items-center gap-4 whitespace-nowrap">
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`transition-all duration-300 relative pb-1 ${activeCategory === cat
                      ? "text-cem-primary font-bold border-b-2 border-cem-primary"
                      : "text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600"
                      }`}
                  >
                    {cat}
                  </button>
                  {idx < staffCategories.length - 1 && (
                    <span className="text-cem-neutral-gray-300 hidden md:inline">—</span>
                  )}
                </div>
              ))}
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredStaff.map((member, index) => (
                  <motion.div
                    key={`${activeCategory}-${member.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <StaffCard member={member} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutContainer;
