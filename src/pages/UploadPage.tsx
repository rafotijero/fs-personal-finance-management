import React from "react";
import FileUpload from "../components/FileUpload";

const UploadPage: React.FC = () => {
    const handleUploadSuccess = (fileUrl: string) => {
        console.log("Archivo subido con éxito:", fileUrl);
        // Aquí puedes guardar la URL en tu base de datos o actualizar el estado
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Subidas</h1>

            {/* Subir imágenes */}
            <FileUpload
                uploadUrl="/api/v1/uploads/images"
                onUploadSuccess={handleUploadSuccess}
                fileMode="image"
            />

            {/* Subir PDFs */}
            <FileUpload
                uploadUrl="/api/v1/uploads/pdfs"
                onUploadSuccess={handleUploadSuccess}
                fileMode="pdf"
            />
        </div>
    );
};

export default UploadPage;
