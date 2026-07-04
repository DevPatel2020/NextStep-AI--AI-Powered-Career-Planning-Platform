import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Job, JobStatus } from "@/lib/hooks/useJobs";

interface JobCardProps {
  job: Job;
  onStatusChange?: (status: JobStatus) => void;
}

const statusVariant: Record<JobStatus, "default" | "primary" | "secondary" | "success" | "error"> = {
  saved: "default",
  applied: "primary",
  interviewing: "secondary",
  offer: "success",
  rejected: "error",
};

export function JobCard({ job, onStatusChange }: JobCardProps) {
  return (
    <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
            {job.title.toUpperCase()}
          </h3>
          <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>
            {job.company}
          </p>
        </div>
        <Badge variant={statusVariant[job.status]} size="sm">
          {job.status.toUpperCase()}
        </Badge>
      </div>

      <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", margin: 0 }}>
        {job.location}
      </p>

      <p className="type-caption" style={{ color: "var(--color-muted-soft)", margin: "auto 0 0", fontSize: "10px" }}>
        UPDATED {formatDate(job.updatedAt).toUpperCase()}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", borderTop: "1px solid var(--color-hairline)", paddingTop: "16px" }}>
        <Link
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-bugatti"
          style={{ height: "36px", padding: "0 20px", fontSize: "11px", flex: 1, textAlign: "center" }}
        >
          VIEW JOB
        </Link>
        {onStatusChange && (
          <div style={{ position: "relative", flex: 1 }}>
            <select
              style={{
                display: "block",
                appearance: "none",
                width: "100%",
                background: "transparent",
                color: "var(--color-ink)",
                border: "none",
                borderBottom: "1px solid var(--color-hairline-strong)",
                borderRadius: "0",
                padding: "8px 24px 8px 0",
                height: "36px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                outline: "none",
                cursor: "pointer",
                colorScheme: "dark",
              }}
              value={job.status}
              onChange={(e) => onStatusChange(e.target.value as JobStatus)}
              aria-label="Update status"
            >
              <option value="saved" style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>SAVED</option>
              <option value="applied" style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>APPLIED</option>
              <option value="interviewing" style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>INTERVIEWING</option>
              <option value="offer" style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>OFFER</option>
              <option value="rejected" style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>REJECTED</option>
            </select>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: "4px",
                bottom: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: "var(--color-muted)",
              }}
            >
              <svg width="8" height="5" fill="none" viewBox="0 0 8 5">
                <path stroke="currentColor" strokeWidth="1" d="M1 1l3 3 3-3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
