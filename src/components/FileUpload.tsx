import React, { useState } from "react";
import axios from "../api/axiosConfig"; // Asegúrate de que sea la ruta correcta hacia tu instancia de Axios
import { toast } from "react-toastify";

interface FileUploadProps {
    uploadUrl: string; // URL del endpoint para subir archivos
    onUploadSuccess: (fileUrl: string) => void; // Callback para manejar la URL del archivo subido
    fileType: "image" | "pdf"; // Tipo de archivo permitido (imagen o PDF)
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadUrl, onUploadSuccess, fileType }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false); // Estado para indicar si se está subiendo el archivo

    // Manejar la selección de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Subir archivo al backend
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("⚠️ Por favor, selecciona un archivo para subir.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("token"); // 📌 Asegura que el token se obtiene correctamente

        // 📌 LOGS DE DEPURACIÓN
        console.log("📌 Subiendo a:", uploadUrl);
        console.log("📌 Archivo seleccionado:", selectedFile);
        console.log("📌 Token enviado:", token);

        setUploading(true);

        try {
            const response = await axios.post(`http://localhost:8081/api/v1/uploads/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("📌 Respuesta del servidor:", response.data);

            if (!response.data || typeof response.data !== "string") {
                throw new Error("⚠️ Respuesta inesperada del servidor");
            }

            onUploadSuccess(response.data); // ✅ Guarda la URL de la imagen en el formulario
            toast.success("✅ Imagen subida correctamente.");
            setSelectedFile(null); // ✅ Limpia la selección
        } catch (error: any) {
            console.error("❌ Error al subir el archivo:", error.response ? error.response.data : error);
            toast.error("⚠️ No se pudo subir la imagen.");
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-bold mb-2">Subir {fileType === "image" ? "Imagen" : "PDF"}</h2>
            <input
                type="file"
                accept={fileType === "image" ? "image/*" : "application/pdf"}
                onChange={handleFileChange}
                className="mb-2"
            />
            <button
                type="button" // ✅ Previene que active el submit del formulario
                onClick={handleUpload}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={uploading}
            >
                {uploading ? "Subiendo..." : `Subir ${fileType === "image" ? "Imagen" : "PDF"}`}
            </button>
        </div>
    );
};

export default FileUpload;
