import axios from "axios";
import { intervalToDuration, subDays } from "date-fns";

// Ensure that room has not been used in the pas three days
const handler = async (req, res) => {
  console.log(process.env.LIVEBLOCKS_SECRET_KEY);

  // Authenticate
  const authResponse = await axios.get("https://liveblocks.io/api/authorize", {
    headers: { Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}` },
  });
  const { token } = authResponse.data;
  const { roomId } = req.query;

  // Get room storage
  try {
    const roomResponse = await axios.get(
      `https://liveblocks.net/api/v1/room/${roomId}/storage`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { config } = roomResponse.data.data;
    const timeStarted = new Date(config.data.timeStarted);
    console.log(timeStarted);

    // If this room was created, more than a day back, delete all storage and return success true
    const interval = intervalToDuration({
      start: timeStarted,
      end: new Date(),
    });
    if (interval.days ?? 0 > 1) {
      await axios.delete(
        `https://liveblocks.net/api/v1/room/${roomId}/storage`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.send({ success: true });
    }
    // Other wise return success false so the client can create a new room ID
    else {
      return res.send({ success: false });
    }
  } catch (err) {
    // The room doesn't exist
    return res.send({ success: true });
  }
};

export default handler;
