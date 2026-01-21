import { useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";
import { UseFormRegister, UseFormSetValue, FieldErrors, FieldValues, Path } from "react-hook-form";

interface AttachmentUploadProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  existingAttachments?: { name: string; url: string; type: string }[];
}

function AttachmentUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  register,
  setValue,
  errors,
  existingAttachments = [],
}: AttachmentUploadProps<TFieldValues>) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    setValue(name, newFiles as TFieldValues[Path<TFieldValues>]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    onDrop,
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue(name, (newFiles.length > 0 ? newFiles : undefined) as TFieldValues[Path<TFieldValues>]);
  };

  useEffect(() => {
    register(name);
  }, [register, name]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label}
      </label>

      {/* Zona de Arrastre */}
      <div
        {...getRootProps()}
        className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
         flex min-h-[150px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 p-6`}
      >
        <input {...getInputProps()} id={name} />
        <div className="flex flex-col items-center">
          <div className="grid aspect-square w-12 place-items-center rounded-full bg-pure-greys-800">
            <FiUploadCloud className="text-xl text-yellow-50" />
          </div>
          <p className="mt-2 text-center text-xs text-richblack-200">
            Arrastra archivos o haz clic para <span className="font-semibold text-yellow-50">Explorar</span>
          </p>
          <p className="mt-1 text-center text-[10px] text-richblack-400">
            Soportado: PDF, Word, Excel
          </p>
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-richblack-5">Archivos seleccionados:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-md bg-richblack-700 p-2 text-xs text-richblack-5">
              <div className="flex items-center space-x-2">
                <FiFile className="text-yellow-50" />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-pink-200 hover:text-pink-100"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Adjuntos existentes (solo lectura visual por ahora) */}
      {existingAttachments.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-richblack-5 text-yellow-100">Adjuntos actuales:</p>
          {existingAttachments.map((attachment, index) => (
            <div key={index} className="flex items-center space-x-2 rounded-md bg-richblack-800 p-2 text-xs text-richblack-400">
              <FiFile />
              <span className="truncate">{attachment.name}</span>
            </div>
          ))}
        </div>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {errors[name]?.message as string || "Error en los adjuntos"}
        </span>
      )}
    </div>
  );
};

export default AttachmentUpload;

