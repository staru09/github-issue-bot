import { Badge } from "@/components/retroui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/retroui/Card";
import type { Theme } from "@/lib/types/digest";
import { ExternalLink } from "lucide-react";

export function ThemesPanel({
  themes,
  repo,
}: {
  themes: Theme[];
  repo: string;
}) {
  if (themes.length === 0) {
    return null;
  }

  const baseUrl = `https://github.com/${repo}/issues`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Themes</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((theme, index) => (
          <Card key={`${theme.name}-${index}`}>
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold">
                  {index + 1}
                </span>
                {theme.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{theme.description}</p>
              {theme.issueNumbers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {theme.issueNumbers.map((num) => (
                    <a
                      key={num}
                      href={`${baseUrl}/${num}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="accent" className="gap-1 hover:opacity-80">
                        #{num}
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
