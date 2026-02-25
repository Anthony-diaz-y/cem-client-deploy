import { useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { UploadProps } from "../../types";
import Image from "next/image";

// Componente de carga de archivos (imágenes/videos)
export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData,
  required = true,
}: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string>(
    viewData ? viewData : editData ? editData : ""
  );


  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const maxSize = !video ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        import("react-hot-toast").then(({ toast }) => {
          toast.error(`El archivo es demasiado grande. Máximo ${!video ? "10MB" : "100MB"}`);
        });
        return;
      }
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    noClick: true,
  });

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPreviewSource(result);
      }
    };
  };

  useEffect(() => {
    register(name, { required: required });
  }, [register, name, required]);

  useEffect(() => {
    setValue(name, selectedFile as unknown as Parameters<typeof setValue>[1]);
  }, [selectedFile, setValue, name]);

  return (
    <div id={name} className="flex flex-col space-y-2">
      <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor={name}>
        {label} {required && !viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        {...getRootProps()}
        onClick={(e) => {
          if (!previewSource) {
            e.preventDefault();
            open();
          }
        }}
        className={`flex min-h-[250px] cursor-pointer items-center justify-center rounded-2xl border border-dashed transition-all duration-300
          ${isDragActive
            ? "border-cem-primary bg-cem-primary/5 shadow-inner"
            : "border-cem-neutral-gray-200 bg-white hover:border-cem-primary/50 hover:bg-cem-neutral-gray-50/50 shadow-sm"
          }`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <Image
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-xl object-cover shadow-md"
                width={800}
                height={450}
                unoptimized={
                  previewSource.startsWith("data:") ||
                  previewSource.startsWith("http") ||
                  previewSource.startsWith("//")
                }
              />
            ) : (
              <video
                src={previewSource}
                className="w-full h-full rounded-xl object-cover shadow-md"
                controls
                playsInline
                style={{ aspectRatio: "16/9" }}
              />
            )}

            {!viewData && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewSource("");
                    setSelectedFile(null);
                    setValue(
                      name,
                      null as unknown as Parameters<typeof setValue>[1]
                    );
                  }}
                  className="mt-4 px-4 py-2 text-cem-neutral-gray-500 font-medium hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm border border-transparent hover:border-red-100"
                >
                  Eliminar archivo y cambiar
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-8">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="grid aspect-square w-16 place-items-center rounded-full bg-cem-primary/5 text-cem-primary transition-transform duration-300 group-hover:scale-110">
                <FiUploadCloud className="text-3xl" />
              </div>

              <div className="text-center">
                <p className="text-[16px] leading-[24px] text-cem-neutral-gray-700">
                  Arrastra y suelta una {!video ? "imagen" : "video"}, o haz clic para Explorar
                  <br />
                  un archivo
                </p>
                <div className="mt-2 text-[13px] leading-[18px] text-cem-neutral-gray-400">
                  <p>Tamaño recomendado 1024x576 (Máx. {!video ? "10MB" : "100MB"}).</p>
                  <p>Relación de aspecto 16:9</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

