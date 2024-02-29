export default async function getFile() {
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
