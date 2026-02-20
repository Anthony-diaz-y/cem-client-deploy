import React, { useState } from "react";
import { QuizQuestion } from "@modules/course/types";
import { FaCheck, FaTimes } from "react-icons/fa";

interface StudentQuizViewProps {
    questions: QuizQuestion[];
    quizTitle: string;
}

const StudentQuizView: React.FC<StudentQuizViewProps> = ({ questions, quizTitle }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [showResults, setShowResults] = useState(false);

    const handleSelectOption = (questionIndex: number, optionIndex: number) => {
        if (showResults) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex,
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(selectedAnswers).length < questions.length) {
            alert("Por favor responde todas las preguntas antes de enviar.");
            return;
        }
        setShowResults(true);
    };

    const handleReset = () => {
        setSelectedAnswers({});
        setShowResults(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
            <div className="bg-richblack-800/50 backdrop-blur-sm rounded-2xl p-8 border border-richblack-700/50 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cem-primary to-cem-primary-dark" />

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-cem-primary/10 rounded-xl">
                        <svg className="w-8 h-8 text-cem-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-richblack-5">{quizTitle}</h2>
                        <p className="text-richblack-400 text-sm mt-1">Resuelve las siguientes {questions.length} preguntas</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="space-y-6">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center font-bold text-sm text-richblack-5 border border-richblack-600">
                                    {qIndex + 1}
                                </span>
                                <p className="text-lg font-medium text-richblack-100 mt-0.5 leading-relaxed">
                                    {q.questionText}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 pl-12">
                                {q.options.map((option, oIndex) => {
                                    const isSelected = selectedAnswers[qIndex] === oIndex;
                                    const isCorrect = Number(q.correctOptionIndex) === oIndex;

                                    let stateClass = "border-richblack-600 bg-richblack-700/30 text-richblack-200 hover:bg-richblack-700 hover:border-richblack-500 shadow-sm";

                                    if (isSelected && !showResults) {
                                        stateClass = "border-cem-primary bg-cem-primary/10 text-cem-primary-light border-2 shadow-[0_0_15px_rgba(2,129,158,0.2)]";
                                    }

                                    if (showResults) {
                                        if (isCorrect) {
                                            stateClass = "border-caribbeangreen-500 bg-caribbeangreen-500/20 text-caribbeangreen-50 border-2 shadow-[0_0_15px_rgba(6,167,125,0.2)]";
                                        } else if (isSelected && !isCorrect) {
                                            stateClass = "border-pink-500 bg-pink-500/20 text-pink-50 border-2 shadow-[0_0_15px_rgba(236,72,153,0.2)]";
                                        }
                                    }

                                    return (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleSelectOption(qIndex, oIndex)}
                                            disabled={showResults}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left ${stateClass} ${!showResults && "hover:-translate-y-0.5"}`}
                                        >
                                            <span className="font-semibold">{option}</span>
                                            {showResults && (
                                                <div className="flex items-center gap-2">
                                                    {isCorrect && <span className="text-[10px] font-bold uppercase bg-caribbeangreen-500/20 px-2 py-1 rounded text-caribbeangreen-500">Correcta</span>}
                                                    {isSelected && !isCorrect && <span className="text-[10px] font-bold uppercase bg-pink-500/20 px-2 py-1 rounded text-pink-500">Incorrecta</span>}
                                                    {isCorrect ? <FaCheck className="text-caribbeangreen-500 drop-shadow-sm" /> : isSelected ? <FaTimes className="text-pink-500 drop-shadow-sm" /> : null}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center border-t border-richblack-700 pt-8">
                    {!showResults ? (
                        <button
                            onClick={handleSubmit}
                            className="px-12 py-4 bg-cem-primary hover:bg-cem-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-cem-primary/30 active:scale-95 disabled:opacity-50"
                        >
                            Enviar Respuestas
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-center p-6 bg-richblack-900/50 rounded-2xl border border-richblack-700 w-full max-w-md">
                                <p className="text-richblack-200 text-lg mb-4 font-semibold uppercase tracking-wider text-sm">Resumen de Resultados</p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <div className="w-12 h-12 bg-caribbeangreen-500/10 text-caribbeangreen-500 rounded-full flex items-center justify-center border border-caribbeangreen-500/20">
                                            <FaCheck size={20} />
                                        </div>
                                        <p className="text-caribbeangreen-500 font-bold text-xl">{questions.filter((q, idx) => selectedAnswers[idx] === Number(q.correctOptionIndex)).length}</p>
                                        <p className="text-richblack-500 text-[10px] uppercase font-bold">Correctas</p>
                                    </div>
                                    <div className="w-px h-12 bg-richblack-700" />
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center border border-pink-500/20">
                                            <FaTimes size={20} />
                                        </div>
                                        <p className="text-pink-500 font-bold text-xl">{questions.filter((q, idx) => selectedAnswers[idx] !== Number(q.correctOptionIndex)).length}</p>
                                        <p className="text-richblack-500 text-[10px] uppercase font-bold">Incorrectas</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="px-10 py-3 bg-richblack-700 hover:bg-richblack-600 text-richblack-5 font-bold rounded-xl transition-all border border-richblack-600 active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Intentar de nuevo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
        </div>
    );
};

export default StudentQuizView;
