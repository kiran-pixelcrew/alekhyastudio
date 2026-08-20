export const contactServices = [
  "Photography",
  "Videography",
  "Invitation / Poster",
  "Portfolio Website",
  "Social Media",
  "Not Sure Yet",
] as const;

export type ContactService = (typeof contactServices)[number];
