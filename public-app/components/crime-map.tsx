import React from "react";

interface CrimeMapProps {
  location: string;
}

export function CrimeMap({ location }: CrimeMapProps) {
  const encoded = encodeURIComponent(location);
  const src = `https://www.google.com/maps?q=${encoded}&output=embed`;
  return (
    <div className="w-full h-64 rounded overflow-hidden">
      <iframe
        title="Crime location map"
        src={src}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
