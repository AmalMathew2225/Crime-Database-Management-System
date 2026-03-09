import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CaseTimeline } from "@/components/case-timeline";
import { CaseDetails } from "@/components/case-details";
import { NewsArticles } from "@/components/news-articles";
import { DownloadPDFButton } from "@/components/download-pdf-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { FIRWithRelations, CaseFollowup, NewsArticle } from "@/lib/types";

const statusColors: Record<string, string> = {
  Registered: "bg-blue-100 text-blue-800 border-blue-200",
  "Under Investigation": "bg-amber-100 text-amber-800 border-amber-200",
  "Charge Sheet Filed": "bg-green-100 text-green-800 border-green-200",
  "Court Proceedings": "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

interface CasePageProps {
  params: Promise<{ id: string }>;
}

async function getCaseData(id: string) {
  const supabase = await createClient();

  const [firResult, followupsResult, newsResult] = await Promise.all([
    supabase
      .from("firs")
      .select(
        `
        *,
        police_stations (*),
        crime_types (*),
        officers (*)
      `
      )
      .eq("id", id)
      .single(),
    supabase
      .from("case_followups")
      .select(
        `
        *,
        officers (*)
      `
      )
      .eq("fir_id", id)
      .order("date", { ascending: true }),
    supabase
      .from("news_articles")
      .select("*")
      .eq("fir_id", id)
      .order("publication_date", { ascending: false }),
  ]);

  if (firResult.error || !firResult.data) {
    return null;
  }

  return {
    fir: firResult.data as FIRWithRelations,
    followups: (followupsResult.data || []) as CaseFollowup[],
    news: (newsResult.data || []) as NewsArticle[],
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params;
  const data = await getCaseData(id);

  if (!data) {
    notFound();
  }

  const { fir, followups, news } = data;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <DownloadPDFButton fir={fir} followups={followups} />
          </div>

          <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {fir.fir_number}
                  </h1>
                  <Badge
                    variant="outline"
                    className={statusColors[fir.status]}
                  >
                    {fir.status}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {fir.crime_types?.name} ({fir.crime_types?.ipc_section})
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Filed on{" "}
                  {new Date(fir.date_filed).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {fir.time_filed}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Police Station</p>
                <p className="font-medium">{fir.police_stations?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {fir.police_stations?.name_ml}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <CaseDetails fir={fir} />
              <CaseTimeline followups={followups} />
            </div>
            <div className="space-y-6">
              <NewsArticles news={news} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

