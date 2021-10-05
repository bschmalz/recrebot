export const sendMessage = async (params) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/contact`;

  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });
};
