// export default async function testConnection(data) {
//     try {
//         const res = await axios.post("http://localhost:5000/api/data", data, {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         return res.data.isSuccess;
//     } catch (error) {
//         console.error("Sending data to server failed:", error);
//     }
// }

export async function testConnection(blobData) {
    const formData = new FormData();
    formData.append("file", blobData, "example.sb3");
    try {
        const res = await fetch("http://localhost:5001/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            await res.text();
            console.log("업로드 완료!");
        } else {
            console.error("Upload failed.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getFile() {
    try {
        const res = await fetch("http://localhost:5001/file", {
            method: "GET",
            type: "application/x.scratch.sb3",
        });
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        return arrayBuffer;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function captureImg(blobData) {
    const formData = new FormData();
    formData.append("capture", blobData, "capture.png");
    try {
        const res = await fetch("http://localhost:5001/capture", {
            method: "POST",
            body: formData,
        });

        console.log("캡쳐 res", res);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getCapturedImg() {
    try {
        const res = await fetch("http://localhost:5001/img", {
            method: "GET",
            type: "image/png",
        });
        const blob = await res.blob();
        const objectURL = URL.createObjectURL(blob);
        console.log("캡쳐이미지 ", objectURL);
        return objectURL;
    } catch (error) {
        console.error("Error:", error);
    }
}
