"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { FIRWithRelations, CaseFollowup } from "@/lib/types";

interface DownloadPDFButtonProps {
  fir: FIRWithRelations;
  followups: CaseFollowup[];
}

export function DownloadPDFButton({ fir, followups }: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const content = `
CRIME TRANSPARENCY PORTAL - KERALA POLICE
==========================================
FIR DETAILS REPORT
==========================================

FIR Number: ${fir.fir_number}
Status: ${fir.status}
Date Filed: ${new Date(fir.date_filed).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
Time: ${fir.time_filed}

CRIME INFORMATION
-----------------
Crime Type: ${fir.crime_types?.name} (${fir.crime_types?.name_ml})
IPC Section: ${fir.crime_types?.ipc_section}

LOCATION
--------
${fir.location}
${fir.location_ml}

COMPLAINANT
-----------
Name: ${fir.complainant_name}

POLICE STATION
--------------
${fir.police_stations?.name}
${fir.police_stations?.name_ml}
${fir.police_stations?.address}
Phone: ${fir.police_stations?.phone}
Email: ${fir.police_stations?.email}

INVESTIGATING OFFICER
---------------------
Name: ${fir.officers?.name}
Rank: ${fir.officers?.rank}
Badge Number: ${fir.officers?.badge_number}

CASE DESCRIPTION
----------------
${fir.description}

CASE TIMELINE
-------------
${
  followups.length > 0
    ? followups
        .map(
          (f) => `
[${new Date(f.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}]
${f.title}
${f.description}
Updated by: ${f.officers?.name || "N/A"}
`
        )
        .join("\n---\n")
    : "No timeline updates available."
}

==========================================
DISCLAIMER
==========================================
This document is generated from the Crime Transparency Portal
maintained by Kerala Police under RTI Act 2005.

All information is subject to ongoing investigations and court
proceedings. This document is for informational purposes only.

Generated on: ${new Date().toLocaleString("en-IN")}
==========================================
`;

      // Create a Blob with the text content
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `FIR_${fir.fir_number.replace(/\//g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={isGenerating} variant="outline">
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </>
      )}
    </Button>
  );
}


