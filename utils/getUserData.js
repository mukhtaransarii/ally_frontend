// utils/getUserData.js
import axios from "axios";
import { BASE_URL } from "@/env.js";

export const getUserData = async (token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.user; // returns the whole user object
  } catch (err) {
    console.log("Error fetching user data:", err);
    return null; // return null if error
  }
};
