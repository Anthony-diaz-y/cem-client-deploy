"use client";

import { useState, useRef } from "react";
import CalendarView from "@/modules/scheduled-classes/components/calendar/CalendarView";
import CreateClassForm from "@/modules/scheduled-classes/components/forms/CreateClassForm";
import { motion, AnimatePresence } from "framer-motion";
import { SCHEDULED_CLASSES_TEXTS } from "../constants/scheduledClasses.constants";

interface ScheduledClassesContainerProps {
  token: string;
  userRole?: string;
  userId?: string;
}

export default function ScheduledClassesContainer({ token, userRole, userId }: ScheduledClassesContainerProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const refreshKey = useRef(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const esEstudiante = userRole === 'Student';
  const esInstructor = userRole === 'Instructor';
  const esAdmin = userRole === 'Admin';
  const puedeCrear = esInstructor || esAdmin;

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-richblack-5">{SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.title}</h1>
            <p className="text-richblack-300 mt-1">
              {esEstudiante 
                ? SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.descriptions.student
                : SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.descriptions.other}
            </p>
          </div>

          {puedeCrear && (
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all font-semibold shadow-lg"
            >
              {mostrarFormulario ? SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.buttons.cancel : SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.buttons.createNew}
            </button>
          )}
        </div>

        <AnimatePresence>
          {mostrarFormulario && puedeCrear && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-richblack-800 rounded-lg shadow-lg p-6 border border-richblack-700"
            >
              <h2 className="text-2xl font-bold text-richblack-5 mb-6">{SCHEDULED_CLASSES_TEXTS.containers.scheduledClasses.formTitle}</h2>
              <CreateClassForm
                token={token}
                userRole={userRole}
                onSuccess={() => {
                  setMostrarFormulario(false);
                  refreshKey.current += 1;
                  setRefreshTrigger(refreshKey.current);
                }}
                onCancel={() => setMostrarFormulario(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <CalendarView refreshKey={refreshTrigger} token={token} userRole={userRole} userId={userId} />
      </div>
    </div>
  );
}
