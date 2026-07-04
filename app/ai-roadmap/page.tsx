"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { RoadmapStepCard } from "@/components/domain/RoadmapStepCard";
import type { RoadmapStage, StageStatus } from "@/lib/hooks/useRoadmap";
import { motion, AnimatePresence } from "framer-motion";

type View = "questions" | "loading" | "roadmap";

interface FormAnswers {
  careerGoal: string;
  currentStage: string;
  timeline: string;
  experience: string;
  interests: string;
}

const initialAnswers: FormAnswers = {
  careerGoal: "",
  currentStage: "",
  timeline: "",
  experience: "",
  interests: "",
};

function mapApiStageToRoadmapStage(
  s: { title: string; description: string; timeRange: string; actions: string[]; resources?: string[] },
  i: number
): RoadmapStage {
  return {
    id: `gen-${i}`,
    title: s.title,
    description: s.description,
    timeRange: s.timeRange,
    status: "not_started",
    actions: s.actions,
    resourceIds: s.resources ?? [],
  };
}

export default function AIRoadmapPage() {
  const [view, setView] = useState<View>("questions");
  const [answers, setAnswers] = useState<FormAnswers>(initialAnswers);
  const [error, setError] = useState("");
  const [stages, setStages] = useState<RoadmapStage[]>([]);

  // Restore saved roadmap on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("roadmap-stages");
      if (saved) {
        setStages(JSON.parse(saved));
        setView("roadmap");
      }
    } catch {}
  }, []);

  const setStageStatus = (stageId: string, status: StageStatus) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, status } : s))
    );
  };

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const totalActions = stages.reduce((acc, s) => acc + s.actions.length, 0);
  const completedActions = stages.reduce(
    (acc, s) => acc + (s.status === "completed" ? s.actions.length : 0),
    0
  );
  const progressPct = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!answers.careerGoal.trim()) {
      setError("Please enter your career goal.");
      return;
    }
    setView("loading");
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details || "Failed to generate roadmap");
        setView("questions");
        return;
      }
      const mapped = (data.stages ?? []).map(mapApiStageToRoadmapStage);
      setStages(mapped);
      try { sessionStorage.setItem("roadmap-stages", JSON.stringify(mapped)); } catch {}
      setView("roadmap");
    } catch {
      setError("Network error. Please try again.");
      setView("questions");
    }
  };

  const startOver = () => {
    try { sessionStorage.removeItem("roadmap-stages"); } catch {}
    setView("questions");
    setAnswers(initialAnswers);
    setStages([]);
    setError("");
  };

  return (
    <PageShell
      title="Your AI Roadmap"
      description={
        view === "questions"
          ? "Answer a few career-related questions and we'll generate a detailed roadmap to reach your goal."
          : "Your personalized step-by-step path. Mark stages as you complete them."
      }
      maxWidth="xl"
    >
      <AnimatePresence mode="wait">
        {view === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="lg" style={{ maxWidth: "640px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div style={{ display: "flex", height: "48px", width: "48px", flexShrink: 0, alignItems: "center", justifyContent: "center", border: "1px solid var(--color-hairline-strong)", color: "var(--color-ink)" }}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
                    Tell us about your goal
                  </h2>
                  <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>
                    We'll use AI to build a detailed roadmap tailored to you.
                  </p>
                </div>
              </div>
              {error && (
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "12px 16px",
                    border: "1px solid var(--color-error)",
                  }}
                  role="alert"
                >
                  <p className="type-caption" style={{ color: "var(--color-error)", margin: 0 }}>
                    {error.toUpperCase()}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Input
                  label="Career goal"
                  placeholder="e.g. Become a software engineer, Get into data analytics, Switch to product management"
                  value={answers.careerGoal}
                  onChange={(e) => setAnswers((a) => ({ ...a, careerGoal: e.target.value }))}
                  required
                />
                <Input
                  label="Current stage"
                  placeholder="e.g. Student, Just graduated, Working in unrelated field, Self-learning"
                  value={answers.currentStage}
                  onChange={(e) => setAnswers((a) => ({ ...a, currentStage: e.target.value }))}
                />
                <Input
                  label="Timeline"
                  placeholder="e.g. 6 months, 1 year, No fixed deadline"
                  value={answers.timeline}
                  onChange={(e) => setAnswers((a) => ({ ...a, timeline: e.target.value }))}
                />
                <Textarea
                  label="Current experience & skills"
                  placeholder="Briefly describe your background, relevant skills, courses, or projects."
                  value={answers.experience}
                  onChange={(e) => setAnswers((a) => ({ ...a, experience: e.target.value }))}
                  rows={3}
                />
                <Textarea
                  label="Interests & constraints"
                  placeholder="e.g. Prefer remote work, interested in startups, need to balance with full-time job"
                  value={answers.interests}
                  onChange={(e) => setAnswers((a) => ({ ...a, interests: e.target.value }))}
                  rows={2}
                />
                <Button type="submit" variant="primary" fullWidth style={{ marginTop: "12px" }}>
                  Generate my roadmap
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {view === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg" style={{ maxWidth: "420px", margin: "40px auto", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <div style={{ position: "relative", width: "48px", height: "48px" }}>
                  <svg
                    style={{ animation: "spin 1s linear infinite", color: "var(--color-ink)", width: "100%", height: "100%" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              <p className="type-caption" style={{ color: "var(--color-ink)", margin: 0 }}>
                GENERATING YOUR ROADMAP...
              </p>
              <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "8px", marginBottom: 0 }}>
                This usually takes 10–30 seconds.
              </p>
            </Card>
          </motion.div>
        )}

        {view === "roadmap" && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress hero */}
            <Card padding="md" style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                      <path
                        className="text-[var(--color-border)]"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        className="roadmap-progress-ring"
                        stroke="var(--color-ink)"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                        fill="none"
                        strokeDasharray="100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - progressPct }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <span className="type-caption" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-ink)", fontSize: "14px" }}>
                      {progressPct}%
                    </span>
                  </div>
                  <div>
                    <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
                      YOUR PROGRESS
                    </h3>
                    <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>
                      {completedCount} of {stages.length} stages · {completedActions} of {totalActions} actions done
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Button variant="outline" size="sm" onClick={startOver}>
                    Start over
                  </Button>
                  <Link href="/career-quiz" className="btn-bugatti" style={{ height: "36px", padding: "0 20px", fontSize: "11px" }}>
                    UPDATE FROM QUIZ →
                  </Link>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "24px",
                  bottom: "24px",
                  width: "1px",
                  background: "var(--color-hairline)",
                }}
                aria-hidden
              />
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "32px", margin: 0, padding: 0 }}>
                {stages.map((stage, i) => (
                  <motion.li
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      position: "relative",
                      display: "flex",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 10,
                        display: "flex",
                        height: "48px",
                        width: "48px",
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--color-canvas)",
                        border: `1px solid ${
                          stage.status === "completed"
                            ? "var(--color-success)"
                            : stage.status === "in_progress"
                            ? "var(--color-ink)"
                            : "var(--color-hairline-strong)"
                        }`,
                        color:
                          stage.status === "completed"
                            ? "var(--color-success)"
                            : "var(--color-ink)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                      }}
                    >
                      {stage.status === "completed" ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <RoadmapStepCard
                        stage={stage}
                        stepIndex={i}
                        onStatusChange={(status: StageStatus) =>
                          setStageStatus(stage.id, status)
                        }
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
