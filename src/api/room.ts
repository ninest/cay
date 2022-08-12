import { API_URL } from ".";

export const checkRoom = async (roomId: string) => {
  const response = await fetch(`${API_URL}/init-room/${roomId}`);
  const json = await response.json();
  return json;
};
