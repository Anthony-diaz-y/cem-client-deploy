"use client";

import { ValuePropositionSection } from "@/modules/home/components/valueProposition";
import { RatingStars } from "@shared/components";
import Image from "next/image";

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

const AboutContainer = () => {
  return (
    <section className="flex flex-col h-full w-full  justify-center items-center">
      <div className=" w-full mt-16">
        <section className="px-6 xl:px-40 bg-cem-accent h-[215px] md:h-[250px] xl:h-[300px] w-full flex justify-center lg:items-center ">
          <h2 className="text-[24px] md:text-[28px] xl:text-[42px] font-bold text-center leading-[32px] xl:leading-[46px] max-w-[300px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[1000px] mt-5 lg:mt-0">Impulsando la innovación en la educación en línea para un futuro más brillante</h2>
        </section>


        <section className="w-full flex gap-10 xl:gap-20 justify-center flex-col items-center">
          <div>
            <Image src="/videoprueba.png" alt="Video de prueba" width={600} height={400} className="w-[304px] md:w-[440px] lg:w-[600px] h-[183px] xl:h-[302px] sm:h-[220px] xl:w-[992px] -mt-12 md:-mt-28 lg:-mt-16 xl:-mt-10 rounded-xl" />
          </div>

          <div className="max-w-[1200px] px-8 xl:px-36 text-center flex flex-col gap-6">
            <p className="text-[16px] lg:text-[20px] xl:text-[28px] font-medium leading-[22px]  xl:leading-[40px] max-w-[300px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[1200px] ">{'"En CEM, estamos convencidos de que a través de la cooperación podemos emprender proyectos de gran impacto y resolver desafíos complejos. Nuestros aliados, colaboradores y usuarios son nuestra prioridad; por ello, nos comprometemos a brindarles un experiencia de alto valor en nuestra plataforma. ¡Bienvenidos a esta comunidad!"'}</p>
            <p className="text-[16px] xl:text-[18px]">Mario Taira - CEO</p>
          </div>

          <div className="flex flex-col-reverse xl:flex-row justify-between w-full items-center max-w-[326px] md:max-w-[450px] lg:max-w-[600px] md: xl:max-w-[1200px] xl:px-0">
            <div className="xl:w-1/2 flex flex-col gap-5 xl:gap-6 xl:-mt-24">
              <h3 className="text-[32px] font-semibold mt-8 xl:mt-0">Nuestra historia</h3>
              <p className="text-[16px] xl:max-w-md">El Centro de Epecialización Multidisciplinario (CEM), es una empresa comprometida con el desarrollo académico y profesional, la transferencia tecnológica y el fortalecimiento del ecosistema y la cultura científica del país. Nuestra labor se centra en brindar capacitaciones, asesorías y otros servicios especializados de alta calidad a través de una plataforma colaborativa, innovadora, eficiente y descentralizada.</p>
            </div>
            <div className="">
              <Image src="/about-img.svg" alt="Imagen de historia" width={535} height={200} />
            </div>

          </div>
        </section>

        <section className=" bg-cem-primary mt-32 flex items-center justify-center py-16">
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

        <section className=" flex flex-col items-center justify-center py-16 bg-cem-accent">
          <h3 className=" text-[16px] uppercase inline-block mb-4">Testimonios</h3>
          <h2 className="text-[36px] font-semibold mb-12">Autoridades nos recomiendan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] px-6">
            {testimonials.map((testi, index) => (
              <div key={index} className="bg-white  rounded-[40px] p-8 flex flex-col gap-6 shadow-sm">
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

        <section>
          
        </section>
      </div>
    </section>
  );
};


export default AboutContainer;
