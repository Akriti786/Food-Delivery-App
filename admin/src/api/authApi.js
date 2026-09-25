// authApi.js
import api from "./api";

export const loginAdmin = async (loginData) => {
    const response = await api.post("/auth/login", loginData);

    return response.data;
};
