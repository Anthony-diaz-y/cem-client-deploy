import { useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";
import { UseFormRegister, UseFormSetValue, FieldErrors, FieldValues, Path } from "react-hook-form";

interface AttachmentUploadProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  deletedAttachmentsName?: Path<TFieldValues>;
  label: string;
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  existingAttachments?: { name: string; url: string; type: string }[];
}

function AttachmentUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  deletedAttachmentsName,
  label,
  register,
  setValue,
  errors,
  existingAttachments = [],
}: AttachmentUploadProps<TFieldValues>) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const maxSize = 100 * 1024 * 1024;
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      import("react-hot-toast").then(({ toast }) => {
        toast.error(`Algunos archivos superan el límite de 100MB`);
      });
      return;
    }

    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    setValue(name, newFiles as TFieldValues[Path<TFieldValues>]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue(name, (newFiles.length > 0 ? newFiles : undefined) as TFieldValues[Path<TFieldValues>]);
  };

  const handleRemoveExisting = (url: string) => {
    const updatedDeleted = [...deletedUrls, url];
    setDeletedUrls(updatedDeleted);
    if (deletedAttachmentsName) {
      setValue(deletedAttachmentsName, updatedDeleted as TFieldValues[Path<TFieldValues>]);
    }
  };

  useEffect(() => {
    register(name);
    if (deletedAttachmentsName) {
      register(deletedAttachmentsName);
    }
  }, [register, name, deletedAttachmentsName]);

  const visibleExisting = existingAttachments.filter(att => !deletedUrls.includes(att.url));

  return (
    <div className="flex flex-col space-y-2 animate-fadeIn">
      <label className="text-sm font-bold text-cem-neutral-gray-900" htmlFor={name}>
        {label}
      </label>

      {/* Zona de Arrastre */}
      <div
        {...getRootProps()}
        className={`flex min-h-[220px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragActive
            ? "border-cem-primary bg-cem-primary/5 shadow-inner"
            : "border-cem-neutral-gray-200 bg-white hover:border-cem-primary/50 hover:bg-cem-neutral-gray-50/50 shadow-sm"
          }`}
      >
        <input {...getInputProps()} id={name} />
        <div className="flex flex-col items-center p-8">
          <div className="grid aspect-square w-16 place-items-center rounded-full bg-cem-primary/5 text-cem-primary transition-transform duration-300 group-hover:scale-110">
            <FiUploadCloud className="text-3xl" />
          </div>
          <p className="mt-4 text-center text-base text-cem-neutral-gray-700">
            Arrastra archivos o haz clic para <span className="font-bold text-cem-primary">Explorar</span>
          </p>
          <div className="mt-2 text-center text-[13px] leading-[18px] text-cem-neutral-gray-400">
            <p>Tamaño máximo 100mb</p>
            <p>Formatos: PDF, Word, Excel, PPT</p>
          </div>
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-bold text-cem-neutral-gray-900 ml-1">Nuevos archivos:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-xl bg-cem-neutral-gray-50 p-3 text-[13px] border border-cem-neutral-gray-100 animate-slideDown">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cem-primary/10 flex items-center justify-center text-cem-primary">
                  <FiFile size={18} />
                </div>
                <span className="font-medium text-cem-neutral-gray-900 truncate max-w-[200px]">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-cem-neutral-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Adjuntos existentes */}
      {visibleExisting.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold text-cem-primary ml-1">Adjuntos actuales:</p>
          {visibleExisting.map((attachment, index) => (
            <div key={index} className="flex items-center justify-between rounded-xl bg-white border border-cem-neutral-gray-100 p-3 text-[13px]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cem-neutral-gray-100 flex items-center justify-center text-cem-neutral-gray-500">
                  <FiFile size={18} />
                </div>
                <span className="font-medium text-cem-neutral-gray-700 truncate max-w-[200px]">{attachment.name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExisting(attachment.url)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-cem-neutral-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {errors[name] && (
        <span className="mt-1 text-xs font-medium text-red-500 ml-1">
          {errors[name]?.message as string || "Error en los adjuntos"}
        </span>
      )}
    </div>
  );
}

export default AttachmentUpload;

