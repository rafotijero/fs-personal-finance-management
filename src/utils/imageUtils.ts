export const resizeImage = (file: File, width: number, height: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/png")); // Guarda la imagen en base64
                } else {
                    reject(new Error("No se pudo obtener el contexto del canvas"));
                }
            };

            img.onerror = () => reject(new Error("Error al cargar la imagen"));
        };

        reader.onerror = () => reject(new Error("Error al leer el archivo"));
        reader.readAsDataURL(file);
    });
};
