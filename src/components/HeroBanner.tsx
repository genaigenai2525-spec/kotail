"use client";

interface HeroBannerProps {
  imageUrl?: string;
  tagline?: string;
}

export default function HeroBanner({
  imageUrl,
  tagline = "動かすのは、ココロとミライ。",
}: HeroBannerProps) {
  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400" />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full flex items-center justify-center">
        <p className="text-white text-2xl md:text-4xl font-bold tracking-wider drop-shadow-lg">
          {tagline}
        </p>
      </div>
    </div>
  );
}
