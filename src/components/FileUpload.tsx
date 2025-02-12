import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

interface FileUploadProps {
    uploadUrl: string;
    onUploadSuccess: (fileUrl: string) => void;
    fileMode: "image" | "pdf" | "both"; // 🔹 Modo para definir qué tipos de archivos acepta
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadUrl, onUploadSuccess, fileMode }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            const isImage = ["png", "jpg", "jpeg", "gif"].includes(fileExtension || "");
            const isPdf = fileExtension === "pdf";

            if (
                (fileMode === "image" && !isImage) ||
                (fileMode === "pdf" && !isPdf) ||
                (fileMode === "both" && !isImage && !isPdf)
            ) {
                toast.error(`⚠️ Tipo de archivo no permitido. Solo ${fileMode === "image" ? "imágenes" : fileMode === "pdf" ? "PDFs" : "imágenes y PDFs"}.`);
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("⚠️ Por favor, selecciona un archivo.");
            return;
        }

        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
        //const isImage = ["png", "jpg", "jpeg", "gif"].includes(fileExtension || "");
        const isPdf = fileExtension === "pdf";

        const endpoint = isPdf ? "pdfs" : "images"; // 🔹 Determina el endpoint correcto
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("token");

        setUploading(true);

        try {
            const response = await axios.post(`${uploadUrl}/${endpoint}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data || typeof response.data !== "string") {
                throw new Error("⚠️ Respuesta inesperada del servidor.");
            }

            onUploadSuccess(response.data);
            toast.success("✅ Archivo subido correctamente.");
            setSelectedFile(null);
        } catch (error) {
            console.error("❌ Error al subir el archivo:", error);
            toast.error("⚠️ No se pudo subir el archivo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-bold mb-2">Subir {fileMode === "image" ? "Imagen" : fileMode === "pdf" ? "PDF" : "Archivo (Imagen o PDF)"}</h2>
            <input
                type="file"
                accept={fileMode === "image" ? "image/*" : fileMode === "pdf" ? "application/pdf" : "image/*,application/pdf"}
                onChange={handleFileChange}
                className="mb-2"
            />
            <button
                type="button"
                onClick={handleUpload}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={uploading}
            >
                {uploading ? "Subiendo..." : `Subir ${fileMode === "image" ? "Imagen" : fileMode === "pdf" ? "PDF" : "Archivo"}`}
            </button>
        </div>
    );
};

export default FileUpload;
