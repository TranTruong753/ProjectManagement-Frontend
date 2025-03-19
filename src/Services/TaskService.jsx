import axios from "axios";

const api = "http://localhost:8000/api/tasks/";

export const taskPost = async (obj) => {
    try {
        const response = await axios.post(api, obj);
        console.log("taskPost",response.data)
        return response.data;
    } catch (error) {
        console.log(error);
    }
};