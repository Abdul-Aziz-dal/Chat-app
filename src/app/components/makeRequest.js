import axios from "axios";

export const makePostRequest = async (url, data = {}, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    if (error) {
      throw new Error(
        `Request failed with status ${error.response.status}: ${error.response.data}`
      );
    } else if (error.request) {
      throw new Error("No response received from the server.");
    } else {
      throw new Error(`Error in request setup: ${error.message}`);
    }
  }
};
