/** Admin-uploaded invitations/creatives are loaded from MongoDB. */
export const invitationProjects: {
  id: string;
  title: string;
  type: string;
  description: string;
  src: string;
  alt: string;
}[] = [];

export const invitationProcess = [
  {
    step: "01",
    title: "Brief",
    text: "Date, venue, guru lineage, colour mood, and print vs digital needs.",
  },
  {
    step: "02",
    title: "Concept",
    text: "Two refined directions rooted in classical aesthetics — never generic templates.",
  },
  {
    step: "03",
    title: "Craft",
    text: "Typography, motifs, and layout refined for both print and screen.",
  },
  {
    step: "04",
    title: "Deliver",
    text: "Print-ready files, digital versions, and optional stationery add-ons.",
  },
];
