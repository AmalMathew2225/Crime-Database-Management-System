"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface StatsChartsProps {
  byStatus: Record<string, number>;
  byCrime: Record<string, number>;
}

export function StatsCharts({ byStatus, byCrime }: StatsChartsProps) {
  const statusData = useMemo(
    () => Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    [byStatus]
  );
  const crimeData = useMemo(
    () => Object.entries(byCrime).map(([crime, count]) => ({ crime, count })),
    [byCrime]
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Cases by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Cases by Crime Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={crimeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crime" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
