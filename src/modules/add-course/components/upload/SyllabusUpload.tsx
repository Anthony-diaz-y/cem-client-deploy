"use client";

import { useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { UseFormRegister, UseFormSetValue, FieldErrors, FieldValues, Path } from "react-hook-form";

interface SyllabusUploadProps<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    errors: FieldErrors<T>;
    editData?: string | null;
    required?: boolean;
}

export default function SyllabusUpload<T extends FieldValues = FieldValues>({
    name,
    label,
    register,
    setValue,
    errors,
    editData,
    required = true,
}: SyllabusUploadProps<T>) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>(editData ? "Archivo actual" : "");

    const onDrop = (acceptedFiles: FileWithPath[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                import("react-hot-toast").then(({ toast }) => {
                    toast.error(`El archivo es demasiado grande. Máximo 100MB`);
                });
                return;
            }
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        onDrop,
        noClick: true,
    });

    useEffect(() => {
        register(name, { required: required });
    }, [register, name, required]);

    useEffect(() => {
        setValue(name, selectedFile as unknown as Parameters<typeof setValue>[1]);
    }, [selectedFile, setValue, name]);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setFileName("");
        setValue(name, null as unknown as Parameters<typeof setValue>[1]);
    };

    return (
        <div id={name} className="flex flex-col space-y-2">
            <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor={name}>
                {label} {required && <sup className="text-pink-200">*</sup>}
            </label>

            <div
                {...getRootProps()}
                onClick={(e) => {
                    if (!fileName) {
                        e.preventDefault();
                        open();
                    }
                }}
                className={`flex min-h-[200px] cursor-pointer items-center justify-center rounded-2xl border border-dashed transition-all duration-300
          ${isDragActive
                        ? "border-cem-primary bg-cem-primary/5 shadow-inner"
                        : "border-cem-neutral-gray-200 bg-white hover:border-cem-primary/50 hover:bg-cem-neutral-gray-50/50 shadow-sm"
                    }`}
            >
                <input {...getInputProps()} />

                {fileName ? (
                    <div className="flex flex-col items-center space-y-4 p-6 w-full">
                        <div className="w-16 h-16 rounded-2xl bg-cem-primary/10 flex items-center justify-center text-cem-primary">
                            <FiFileText className="text-3xl" />
                        </div>
                        <div className="text-center">
                            <p className="text-cem-neutral-gray-900 font-medium break-all px-4">{fileName}</p>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm border border-transparent hover:border-red-100 font-medium"
                            >
                                <FiX />
                                Eliminar y cambiar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4 p-8">
                        <div className="grid aspect-square w-16 place-items-center rounded-full bg-cem-primary/5 text-cem-primary">
                            <FiUploadCloud className="text-3xl" />
                        </div>

                        <div className="text-center">
                            <p className="text-[16px] leading-[24px] text-cem-neutral-gray-700">
                                Arrastra y suelta un archivo PDF, o haz clic para
                                <br />
                                Explorar un archivo
                            </p>
                            <p className="mt-2 text-[13px] leading-[18px] text-cem-neutral-gray-400">
                                Peso máximo 100mb
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} es requerido
                </span>
            )}
        </div>
    );
}
