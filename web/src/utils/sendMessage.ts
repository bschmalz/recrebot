import axios from 'axios';

export const sendMessage = async (params) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/contact`;
  return await axios.post(url, params);
};
