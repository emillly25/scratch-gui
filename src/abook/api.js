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

export default async function testConnection(blobData) {
    const formData = new FormData();
    formData.append("file", blobData, "example.sb3");
    try {
        const res = await fetch("http://localhost:5000/upload", {
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
