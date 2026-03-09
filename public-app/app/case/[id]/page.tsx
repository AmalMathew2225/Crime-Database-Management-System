import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, MapPin, Clock, FileText, User, UserCircle } from "lucide-react";
import { CaseDetails } from "../../components/case-details";
import { CaseTimeline } from "../../components/case-timeline";
import { LocalizedMap } from "../../components/localized-map";
import { NewsArticles } from "../../components/news-articles";

async function getFIR(id: string) {
  const base = process.env.NEXT_PUBLIC_OFFICER_URL || "";
  const res = await fetch(`${base}/api/firs/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.fir;
}

export default async function CasePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const fir = await getFIR(id);
  if (!fir) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Reports
            </Link>
          </div>

          <div className="space-y-6">
            <CaseDetails fir={fir} />
            <div className="mt-4">
              {/* map will choose language internally via LocalizedMap */}
              <LocalizedMap location={fir.location} location_ml={fir.location_ml} />
            </div>
            {fir.case_followups && <CaseTimeline followups={fir.case_followups} />}
            {fir.news_articles && <NewsArticles news={fir.news_articles} />}
          </div>
        </div>
      </main>
    </div>
  );
}
