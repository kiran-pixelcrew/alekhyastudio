export type PhotoCategory =
  | "all"
  | "bharatanatyam"
  | "arangetram"
  | "stage"
  | "portrait"
  | "costume"
  | "video";

export const photoCategories: { id: PhotoCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "bharatanatyam", label: "Bharatanatyam" },
  { id: "arangetram", label: "Rangapravesha / Arangetram" },
  { id: "stage", label: "Stage" },
  { id: "portrait", label: "Portraits" },
  { id: "costume", label: "Costume" },
  { id: "video", label: "Videography" },
];

export type PhotoItem = {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, "all">;
  alt: string;
  src: string;
  aspect: "portrait" | "landscape" | "square";
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const studioHero: PhotoItem[] = [
  {
    id: "s1",
    title: "Stage Lights",
    category: "stage",
    alt: "Classical dancer in traditional costume performing on stage",
    src: "/images/hero/img1.webp",
    aspect: "landscape",
  },
  {
    id: "s2",
    title: "Warm Stage Light",
    category: "bharatanatyam",
    alt: "Bharatanatyam performance captured in warm stage light",
    src: "/images/hero/img2.webp",
    aspect: "landscape",
  },
  {
    id: "s3",
    title: "Ensemble Formation",
    category: "arangetram",
    alt: "Indian classical dance ensemble in formation",
    src: "/images/hero/img3.webp",
    aspect: "landscape",
  },
  {
    id: "s4",
    title: "Expressive Portrait",
    category: "portrait",
    alt: "Expressive classical dance portrait with traditional attire",
    src: "/images/hero/img4.webp",
    aspect: "landscape",
  },
  {
    id: "s5",
    title: "Mid-Performance",
    category: "costume",
    alt: "Young dancer in classical costume mid-performance",
    src: "/images/hero/img5.webp",
    aspect: "landscape",
  },
  {
    id: "s6",
    title: "Dramatic Stage",
    category: "stage",
    alt: "Classical dance performance under dramatic stage lighting",
    src: "/images/hero/img6.webp",
    aspect: "landscape",
  },
  {
    id: "s7",
    title: "Stage Ensemble",
    category: "arangetram",
    alt: "Ensemble of dancers performing on stage",
    src: "/images/hero/img7.webp",
    aspect: "landscape",
  },
  {
    id: "sm1",
    title: "Stage Portrait I",
    category: "stage",
    alt: "Classical dancer portrait from mobile showreel frame one",
    src: "/images/hero/Mimg1.webp",
    aspect: "portrait",
  },
  {
    id: "sm2",
    title: "Stage Portrait II",
    category: "bharatanatyam",
    alt: "Classical dancer portrait from mobile showreel frame two",
    src: "/images/hero/Mimg2.webp",
    aspect: "portrait",
  },
  {
    id: "sm3",
    title: "Stage Portrait III",
    category: "arangetram",
    alt: "Classical dancer portrait from mobile showreel frame three",
    src: "/images/hero/Mimg3.webp",
    aspect: "portrait",
  },
  {
    id: "sm4",
    title: "Stage Portrait IV",
    category: "costume",
    alt: "Classical dancer portrait from mobile showreel frame four",
    src: "/images/hero/Mimg4.webp",
    aspect: "portrait",
  },
];

export const photographyItems: PhotoItem[] = [
  {
    id: "p3",
    title: "First Stage",
    category: "arangetram",
    alt: "Young dancer in traditional Indian costume performing gracefully on stage",
    src: u("photo-1768491815837-87a90744f9e6"),
    aspect: "portrait",
  },
  {
    id: "p4",
    title: "Namaskaram",
    category: "bharatanatyam",
    alt: "Classical dancer in traditional attire greeting with folded hands",
    src: u("photo-1774425243305-02ae44fdefd1"),
    aspect: "square",
  },
  {
    id: "p17",
    title: "Bharatanatyam Ensemble",
    category: "bharatanatyam",
    alt: "Group of Bharatanatyam dancers standing in formation on stage",
    src: u("photo-1688820661462-a44e4b2770e8"),
    aspect: "landscape",
  },
  {
    id: "p18",
    title: "Twin Mudras",
    category: "arangetram",
    alt: "Two women performing traditional Indian classical dance together",
    src: u("photo-1746983062953-74c19d0dfc5d"),
    aspect: "landscape",
  },
  {
    id: "p19",
    title: "Costume Duet",
    category: "costume",
    alt: "Two Indian dancers in traditional costumes mid-performance",
    src: u("photo-1746983047239-cb817eba7d05"),
    aspect: "portrait",
  },
  {
    id: "p20",
    title: "Orange & Violet",
    category: "stage",
    alt: "Classical dancer in orange and purple costume striking a pose",
    src: u("photo-1740456977659-bdd269417fc0"),
    aspect: "portrait",
  },
  {
    id: "p21",
    title: "Anjali Hasta",
    category: "bharatanatyam",
    alt: "Two dancers in traditional Indian attire with hands clasped",
    src: u("photo-1774425243343-09786fbbfe84"),
    aspect: "square",
  },
  {
    id: "p22",
    title: "Hasta Detail",
    category: "portrait",
    alt: "Close portrait of a dancer in classical costume with hands clasped",
    src: u("photo-1774425243379-5f74f9da5a83"),
    aspect: "portrait",
  },
  {
    id: "p23",
    title: "Temple Festival Dance",
    category: "stage",
    alt: "Two women in traditional Indian attire dancing at a temple festival",
    src: u("photo-1645264090488-a019de493023"),
    aspect: "landscape",
  },
  {
    id: "p24",
    title: "Costume Ready",
    category: "costume",
    alt: "Dancer in yellow and red traditional saree costume before performance",
    src: u("photo-1722440044170-8df784901428"),
    aspect: "portrait",
  },
  {
    id: "p12",
    title: "Arangetram Portrait",
    category: "arangetram",
    alt: "Woman performing a traditional Indian classical dance pose",
    src: u("photo-1764014792666-0f9e3c8442a9"),
    aspect: "portrait",
  },
  {
    id: "p9",
    title: "Stage Film Still",
    category: "video",
    alt: "Cinematic still of classical dancers performing on a lit stage",
    src: u("photo-1774425243355-a6c4858a5e63"),
    aspect: "landscape",
  },
  {
    id: "p1",
    title: "Golden Hour Portrait",
    category: "portrait",
    alt: "Woman in traditional attire photographed in warm outdoor light",
    src: u("photo-1610030469983-98e550d6193c"),
    aspect: "portrait",
  },
  {
    id: "p14",
    title: "Festive Light",
    category: "costume",
    alt: "Portrait illuminated by warm festive lamps and soft glow",
    src: u("photo-1605649487212-47bdab064df7"),
    aspect: "square",
  },
  {
    id: "p10",
    title: "Behind the Lens",
    category: "video",
    alt: "Videographer filming a celebration with soft bokeh lights",
    src: u("photo-1492691527719-9d1e07e534b4"),
    aspect: "landscape",
  },
  {
    id: "p16",
    title: "Performance Frame",
    category: "video",
    alt: "Cinematic stage lighting for classical performance videography",
    src: u("photo-1470225620780-dba8ba36b745"),
    aspect: "landscape",
  },
];

/** Hero-only assets — not used in Our Work. */
export { studioHero };