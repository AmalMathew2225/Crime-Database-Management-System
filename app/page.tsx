// import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { StatsCard } from "@/components/stats-card";
import { FIRTable } from "@/components/fir-table";
import { StationsGrid } from "@/components/stations-grid";
import { Sidebar } from "@/components/sidebar";
import {
  FileText,
  Search,
  Scale,
  CheckCircle,
  FileIcon, // Replaced specific icons with functional ones if needed
  AlertTriangle,
  Gavel,
  ShieldCheck
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";

import { mockDashboardData } from "@/lib/mock-data";

async function getDashboardData() {
  const { firs, stations, crimeTypes } = mockDashboardData;

  const stats: DashboardStats = {
    totalFirs: firs.length,
    underInvestigation: firs.filter((f) => f.status === "Under Investigation")
      .length,
    chargeSheetFiled: firs.filter((f) => f.status === "Charge Sheet Filed")
      .length,
    closedCases: firs.filter((f) => f.status === "Closed").length,
  };

  return { firs, stations, crimeTypes, stats };
}

export default async function HomePage() {
  const { firs, stations, crimeTypes, stats } = await getDashboardData();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />

      <div className="app-container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

          {/* Sidebar */}
          <div className="hidden lg:block relative">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1">

            {/* Mobile Filter Toggle could go here */}

            {/* Stats Overview */}
            <section className="mb-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Total FIRS"
                  value={stats.totalFirs}
                  icon={FileText}
                  description="Total registered cases"
                  variant="default"
                />
                <StatsCard
                  title="Under Investigation"
                  value={stats.underInvestigation}
                  icon={Search}
                  description="Active investigations"
                  variant="warning"
                />
                <StatsCard
                  title="Charge Sheet Filed"
                  value={stats.chargeSheetFiled}
                  icon={Scale}
                  description="Cases in court"
                  variant="accent"
                />
                <StatsCard
                  title="Closed Cases"
                  value={stats.closedCases}
                  icon={CheckCircle}
                  description="Resolved cases"
                  variant="primary"
                />
              </div>
            </section>

            {/* Recent FIR Entries */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b border-border bg-white">
                  <h3 className="text-lg font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent FIR Entries
                  </h3>
                </div>
                <div className="p-0">
                  <FIRTable firs={firs} stations={stations} crimeTypes={crimeTypes} />
                </div>
              </div>
            </section>

            {/* Police Stations Grid */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary uppercase tracking-wide">
                  Police Stations
                </h3>
                <a href="#" className="text-sm text-accent hover:underline font-medium">View All Stations &rarr;</a>
              </div>
              <StationsGrid stations={stations} />
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

