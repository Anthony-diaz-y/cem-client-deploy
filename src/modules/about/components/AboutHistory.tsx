import React from "react";
import Image from "next/image";

const AboutHistory = () => {
    return (
        <section className="w-full flex gap-10 xl:gap-20 justify-center flex-col items-center">
            <div>
                <Image
                    src="/videoprueba.png"
                    alt="Video de prueba"
                    width={600}
                    height={400}
                    className="w-[304px] md:w-[440px] lg:w-[600px] h-[183px] xl:h-[302px] sm:h-[220px] xl:w-[992px] -mt-12 md:-mt-28 lg:-mt-16 xl:-mt-10 rounded-xl"
                />
            </div>

            <div className="max-w-[400px] md:max-w-[520px] lg:max-w-[690px] xl:max-w-[1200px] px-8 xl:px-36 text-center flex flex-col gap-6">
                <p className="text-[16px] lg:text-[20px] xl:text-[28px] font-medium leading-[22px] xl:leading-[40px]">
                    {'"En CEM, estamos convencidos de que a través de la cooperación podemos emprender proyectos de gran impacto y resolver desafíos complejos. Nuestros aliados, colaboradores y usuarios son nuestra prioridad; por ello, nos comprometemos a brindarles un experiencia de alto valor en nuestra plataforma. ¡Bienvenidos a esta comunidad!"'}
                </p>
                <p className="text-[16px] xl:text-[18px]">Mario Taira - CEO</p>
            </div>

            <div className="flex flex-col-reverse xl:flex-row justify-between w-full items-center max-w-[1200px] px-8 xl:px-0">
                <div className="xl:w-1/2 flex flex-col gap-5 xl:gap-6 xl:-mt-24 max-w-[400px] md:max-w-[520px] lg:max-w-[690px]">
                    <h3 className="text-[32px] font-semibold mt-8 xl:mt-0">Nuestra historia</h3>
                    <p className="text-[16px] xl:max-w-md">
                        El Centro de Epecialización Multidisciplinario (CEM), es una empresa comprometida con el desarrollo académico y profesional, la transferencia tecnológica y el fortalecimiento del ecosistema y la cultura científica del país. Nuestra labor se centra en brindar capacitaciones, asesorías y otros servicios especializados de alta calidad a través de una plataforma colaborativa, innovadora, eficiente y descentralizada.
                    </p>
                </div>
                <div className="w-full xl:w-1/2 flex justify-center xl:justify-end">
                    <Image src="/about-img.svg" alt="Imagen de historia" width={535} height={200} className="lg:w-full w-[320px] md:w-[520px]  max-w-[535px] h-auto" />
                </div>
            </div>
        </section>
    );
};

export default AboutHistory;
