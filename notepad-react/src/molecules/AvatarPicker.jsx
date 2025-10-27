import { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";

export default function AvatarPicker({
  nameHidden = "avatar",
  id = "avatar",
  size = 112,             
  accept = "image/*",
  maxSizeMB = 5,           
  initialValue = "",      
  className = "",
}) {
  const [preview, setPreview] = useState(initialValue || "");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleSelect = async (file) => {
    setError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen válida.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`La imagen no debe superar ${maxSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result); // dataURL (Base64)
    };
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  };

  const onInputChange = (e) => handleSelect(e.target.files?.[0]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Label clickable con preview */}
      <label
        htmlFor={id}
        className="relative group cursor-pointer"
        style={{ width: size, height: size }}
      >
        {/* Círculo contenedor */}
        <div className="h-full w-full rounded-full overflow-hidden border border-neutral-200 bg-neutral-50 grid place-items-center shadow-sm">
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-neutral-400">
              <Upload size={24} />
              <span className="text-[10px] mt-1">Subir</span>
            </div>
          )}
        </div>

        {/* Overlay suave al hover */}
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
      </label>

      {/* Input file oculto de acceso */}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
      />

      {/* Valor Base64 para enviar al backend */}
      <input type="hidden" name={nameHidden} value={preview} />

      {/* ayuda / error */}
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-neutral-500">
          JPG/PNG • máx. {maxSizeMB}MB
        </p>
      )}
    </div>
  );
}
