"use client";

import { useLanguage } from "../lib/language";
import { CrimeMap } from "./crime-map";

interface LocalizedMapProps {
  location: string;
  location_ml?: string;
}

export function LocalizedMap({ location, location_ml }: LocalizedMapProps) {
  const { lang } = useLanguage();
  const chosen = lang === "ml" && location_ml ? location_ml : location;
  return <CrimeMap location={chosen} />;
}
