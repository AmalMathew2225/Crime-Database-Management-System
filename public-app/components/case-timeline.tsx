import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, CheckCircle2 } from "lucide-react";

interface CaseFollowup {
  id: string;
  date: string;
  title: string;
  description?: string;
}

interface CaseTimelineProps {
  followups: CaseFollowup[];
}

export function CaseTimeline({ followups }: CaseTimelineProps) {
  if (followups.length === 0) {
    return (
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Case Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No updates available for this case yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Case Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative space-y-0">
          {followups.map((followup, index) => (
            <div key={followup.id} className="relative pb-8 last:pb-0">
              {index !== followups.length - 1 && (
                <span
                  className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-foreground">
                      {followup.title}
                    </h4>
                    <time className="text-sm text-muted-foreground">
                      {new Date(followup.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {followup.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
