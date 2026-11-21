export const areas = ["Angadical", "Chandanappally"];
export const providers = [
  { name: "Asianet", logo: "/providers/asianet.webp" },
  { name: "Kerala Vision", logo: "/providers/kerala-vision.webp" },
  { name: "BSNL", logo: "/providers/bsnl.webp" },
  { name: "KFON", logo: "/providers/kfon.svg" },
  { name: "Extranet", logo: "/providers/extranet.svg" },
];
export const maps = "https://maps.app.goo.gl/qeak1tVdMT7DPq6f8";
export const services = {
  broadband: {
    title: "Broadband",
    code: "BROADBAND",
    summary: "Explore home internet options for work, learning and streaming.",
    details:
      "Share your locality so we can check available internet providers and explain the steps to set up a home connection.",
  },
  "cable-tv": {
    title: "Cable TV",
    code: "CABLE_TV",
    summary: "Get help setting up a cable television connection for your home.",
    details:
      "Tell us where you live and what you need from your TV connection. We can confirm available options and help arrange setup.",
  },
} as const;
export function businessPhone() {
  const phone = process.env.PUBLIC_PHONE;
  return phone && /^\+[1-9]\d{7,14}$/.test(phone) ? phone : undefined;
}
