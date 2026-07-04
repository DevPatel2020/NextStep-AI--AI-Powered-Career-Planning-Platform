import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { College } from "@/lib/hooks/useCollegeSearch";

interface CollegeCardProps {
  college: College;
  onSave?: () => void;
  onRemove?: () => void;
  isShortlisted?: boolean;
}

export function CollegeCard({
  college,
  onSave,
  onRemove,
  isShortlisted,
}: CollegeCardProps) {
  return (
    <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <div>
        <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
          {college.name.toUpperCase()}
        </h3>
        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
          {college.location}
        </p>
      </div>

      <p className="type-body-sm" style={{ color: "var(--color-body-strong)", margin: 0, fontWeight: 500 }}>
        {college.degree}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <Badge variant="default" size="sm">
          {college.costRange.toUpperCase()}
        </Badge>
        <Badge variant="secondary" size="sm">
          ADMISSION: {college.admissionRate.toUpperCase()}
        </Badge>
      </div>

      {(college.stateRanking || college.countryRanking || college.worldRanking) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {college.stateRanking && college.stateRanking !== "Not ranked" && (
            <Badge variant="default" size="sm">
              STATE: {college.stateRanking.toUpperCase()}
            </Badge>
          )}
          {college.countryRanking && college.countryRanking !== "Not ranked" && (
            <Badge variant="primary" size="sm">
              COUNTRY: {college.countryRanking.toUpperCase()}
            </Badge>
          )}
          {college.worldRanking && college.worldRanking !== "Not ranked" && (
            <Badge variant="success" size="sm">
              WORLD: {college.worldRanking.toUpperCase()}
            </Badge>
          )}
        </div>
      )}

      <ul style={{ paddingLeft: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }} className="list-disc">
        {college.strengths.slice(0, 3).map((s, i) => (
          <li key={i} className="type-body-sm" style={{ color: "var(--color-muted)" }}>
            {s}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: "12px", marginTop: "auto", borderTop: "1px solid var(--color-hairline)", paddingTop: "16px" }}>
        <Button variant="outline" size="sm" style={{ flex: 1 }}>
          VIEW DETAILS
        </Button>
        {isShortlisted ? (
          <Button variant="ghost" size="sm" onClick={onRemove} style={{ flex: 1, color: "var(--color-error)", borderColor: "var(--color-error)" }}>
            REMOVE
          </Button>
        ) : (
          onSave && (
            <Button variant="primary" size="sm" onClick={onSave} style={{ flex: 1 }}>
              SAVE
            </Button>
          )
        )}
      </div>
    </Card>
  );
}
