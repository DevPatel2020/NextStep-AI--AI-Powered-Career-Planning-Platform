import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDuration } from "@/lib/utils";
import type { Resource } from "@/lib/hooks/useResources";

interface ResourceCardProps {
  resource: Resource;
  onSave?: () => void;
  isSaved?: boolean;
}

export function ResourceCard({ resource, onSave, isSaved }: ResourceCardProps) {
  return (
    <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
        <Badge variant="primary" size="sm">
          {resource.type.toUpperCase()}
        </Badge>
        <Badge variant="default" size="sm">
          {resource.level.toUpperCase()}
        </Badge>
      </div>

      <div>
        <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
          {resource.title.toUpperCase()}
        </h3>
        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "8px", margin: 0, lineClamp: 2, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
          {resource.description}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "auto", borderTop: "1px solid var(--color-hairline)", paddingTop: "12px" }}>
        <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>
          {formatDuration(resource.durationMinutes).toUpperCase()}
        </span>
        <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>
          {resource.source.toUpperCase()}
        </span>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <Link
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-bugatti"
          style={{ height: "36px", padding: "0 20px", fontSize: "11px", flex: 1, textAlign: "center", textDecoration: "none" }}
        >
          VIEW RESOURCE
        </Link>
        {onSave && (
          <Button
            variant={isSaved ? "outline" : "primary"}
            size="sm"
            onClick={onSave}
            aria-pressed={isSaved}
            style={{ flex: 1 }}
          >
            {isSaved ? "SAVED" : "SAVE"}
          </Button>
        )}
      </div>
    </Card>
  );
}
