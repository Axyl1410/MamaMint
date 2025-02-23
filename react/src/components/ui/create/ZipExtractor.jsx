import { useState, useRef } from "react";

const ZipExtractor = ({ setFolderId }) => {
    const [htmlContent, setHtmlContent] = useState(null);
    const iframeRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/generate/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                setHtmlContent(`http://localhost:8080${data.url}`);
                setFolderId(data.folderId);
            } else {
                alert("Không thể tải lên file ZIP");
            }
        } catch (error) {
            console.error("Lỗi upload file:", error);
            alert("Lỗi khi tải lên file ZIP");
        }
    };

    return (
        <div className="p-4">
            {/*<input type="file" accept=".zip" onChange={handleFileUpload}/>*/}
            {
                !htmlContent && (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file"
                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or
                                    drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">P5.js Project .ZIP</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".zip" onChange={handleFileUpload}/>
                        </label>
                    </div>
                )
            }

            {htmlContent && (
                <div className="mt-4">
                    <iframe
                        ref={iframeRef}
                        src={htmlContent}
                        width="600"
                        height="400"
                        onLoad={() => console.log("Sketch loaded")}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default ZipExtractor;
