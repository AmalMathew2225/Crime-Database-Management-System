import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Newspaper, ExternalLink, CheckCircle } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publication_date: string;
  url: string;
  is_verified: boolean;
}

interface NewsArticlesProps {
  news: NewsArticle[];
}

export function NewsArticles({ news }: NewsArticlesProps) {
  if (news.length === 0) {
    return (
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Related News
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No related news articles found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Related News
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {news.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-foreground leading-tight">
                  {article.title}
                </h4>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {article.source}
                </span>
                <span className="text-muted-foreground">-</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(article.publication_date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
                {article.is_verified && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-200 bg-green-50 text-green-700"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
