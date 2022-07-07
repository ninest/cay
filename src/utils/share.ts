export const shareLink = async (url: string) => {
  try {
    await navigator.share({ title: "CAU game", text: "Join this game!", url });
  } catch (e) {
    window.prompt("Share this link", url);
  }
};
