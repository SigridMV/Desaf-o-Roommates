const axios = require("axios");

async function getUser() {
  try {
    const response = await axios.get("https://randomuser.me/api/");

    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
}

module.exports = getUser;
