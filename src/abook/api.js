import axios from "axios";

export default async function testConnection(data) {
    console.log("서버 콜");
    try {
        const res = await axios.post("http://localhost:5000/api/data", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("서버로부터 받은 응답: ", res.data);
        return res.data.isSuccess;
    } catch (error) {
        console.error("Sending data to server failed:", error);
    }
}
