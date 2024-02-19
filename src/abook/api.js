import axios from "axios";

export default async function testConnection(data) {
    try {
        const res = await axios.post("http://localhost:5000/api/data", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data.isSuccess;
    } catch (error) {
        console.error("Sending data to server failed:", error);
    }
}
