import React from "react";
import * as Icon1 from "react-icons/bi";
import * as Icon3 from "react-icons/hi2";
import * as Icon2 from "react-icons/io5";
import { contactDetails } from "../data";

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-cem-primary p-6 lg:p-10 shadow-xl border border-white/10 h-full">
      {contactDetails.map((ele, i) => {
        const Icon =
          (Icon1 as Record<string, React.ComponentType<{ size?: number }>>)[
          ele.icon
          ] ||
          (Icon2 as Record<string, React.ComponentType<{ size?: number }>>)[
          ele.icon
          ] ||
          (Icon3 as Record<string, React.ComponentType<{ size?: number }>>)[
          ele.icon
          ];
        return (
          <div
            className="flex flex-col gap-[6px] p-2 text-sm text-cem-neutral-gray-300"
            key={i}
          >
            <div className="flex flex-row items-center gap-4">
              {Icon && (
                <span className="text-cem-primary-light">
                  <Icon size={28} />
                </span>
              )}
              <h1 className="text-xl font-bold text-white tracking-tight">
                {ele?.heading}
              </h1>
            </div>

            <p className="font-medium text-white/70 text-base">
              {ele?.description}
            </p>
            <p className="font-semibold text-white text-base">
              {ele?.details}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ContactDetails;
