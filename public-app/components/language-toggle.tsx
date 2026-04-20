"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../lib/language";
import { Button } from "./ui/button";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">EN</Button>
        <Button variant="ghost" size="sm">ML</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={lang === "en" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setLang("en")}
      >
        EN
      </Button>
      <Button
        variant={lang === "ml" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setLang("ml")}
      >
        ML
      </Button>
    </div>
  );
}
