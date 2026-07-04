"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ProgressHeader } from "@/components/domain/ProgressHeader";
import { QuizQuestionCard } from "@/components/domain/QuizQuestionCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatSalaryRange } from "@/lib/utils";
import { useCareerQuiz } from "@/lib/hooks/useCareerQuiz";
import { motion, AnimatePresence } from "framer-motion";

export default function CareerQuizPage() {
  const {
    phase,
    currentStep,
    currentQuestion,
    totalQuestions,
    progress,
    answers,
    results,
    error,
    canProceed,
    isLastQuestion,
    submitAnswer,
    goBack,
    goNext,
    retake,
    addToRoadmap,
    roadmapLoading,
    roadmapAdded,
    roadmapError,
  } = useCareerQuiz();

  // ─── Loading states ──────────────────────────────────────────────────────
  if (phase === "loading-phase2" || phase === "loading-results") {
    return (
      <PageShell
        title="Career Quiz"
        description="Answer a few questions to find careers that fit you."
        maxWidth="xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="logo"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="mb-6 h-20 w-20 object-contain"
          />
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {phase === "loading-phase2"
              ? "Generating personalised questions…"
              : "Analysing your answers…"}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {phase === "loading-phase2"
              ? "Our AI is crafting 10 questions based on your interests."
              : "Our AI is finding the best career matches for you."}
          </p>
          <div className="w-full max-w-md mt-8">
            <ProgressHeader progress={100} title="" />
          </div>
        </motion.div>
      </PageShell>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <PageShell
        title="Career Quiz"
        description="Answer a few questions to find careers that fit you."
        maxWidth="xl"
      >
        <Card padding="lg">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                height: "56px",
                width: "56px",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--color-error)",
                color: "var(--color-error)",
                margin: "0 auto",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
              SOMETHING WENT WRONG
            </h3>
            <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "0 auto", maxWidth: "480px" }}>
              {error}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px" }}>
              <Button variant="outline" onClick={retake}>
                START OVER
              </Button>
              <Button variant="primary" onClick={goNext}>
                RETRY
              </Button>
            </div>
          </div>
        </Card>
      </PageShell>
    );
  }


  const phaseLabel =
    phase === "phase1" ? "Basic Profile" : "Personalised Questions";

  return (
    <PageShell
      title="Career Quiz"
      description="Answer a few questions to find careers that fit you."
      maxWidth="xl"
    >
      <AnimatePresence mode="wait">
        {phase === "results" ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProgressHeader
              title="Your career matches"
              description="Based on your answers, these careers are a strong fit. Explore and add them to your roadmap."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {results.map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card padding="lg">
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                          <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
                            {career.title.toUpperCase()}
                          </h3>
                          <Badge variant="success" size="sm">
                            {career.matchScore}% MATCH
                          </Badge>
                        </div>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "8px", margin: 0, lineHeight: 1.5 }}>
                          {career.summary}
                        </p>
                        <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          <Badge variant="default" size="sm">
                            {formatSalaryRange(career.salaryMin, career.salaryMax).toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {career.education.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", marginTop: "12px", margin: 0 }}>
                          KEY SKILLS: {career.skills.join(", ").toUpperCase()}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                          {roadmapAdded.has(career.id) ? (
                            <span
                              className="type-caption"
                              style={{
                                display: "inline-flex",
                                height: "36px",
                                padding: "0 20px",
                                alignItems: "center",
                                gap: "8px",
                                border: "1px solid var(--color-hairline)",
                                color: "var(--color-muted-soft)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                              }}
                            >
                              ADDED TO ROADMAP
                            </span>
                          ) : (
                            <button
                              onClick={() => addToRoadmap(career)}
                              disabled={roadmapLoading.has(career.id)}
                              className="btn-bugatti"
                              style={{ height: "36px", padding: "0 20px", fontSize: "11px" }}
                            >
                              {roadmapLoading.has(career.id) ? "GENERATING…" : "ADD TO ROADMAP"}
                            </button>
                          )}
                          <Link
                            href={"/learning-resources?q=" + encodeURIComponent(career.title)}
                            className="btn-bugatti"
                            style={{ height: "36px", padding: "0 20px", fontSize: "11px", textDecoration: "none" }}
                          >
                            EXPLORE LEARNING
                          </Link>
                        </div>
                        {roadmapError[career.id] && (
                          <p className="type-caption" style={{ color: "var(--color-error)", fontSize: "10px", margin: 0 }}>{roadmapError[career.id]}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px" }}>
              <button
                onClick={retake}
                className="btn-bugatti"
                style={{ height: "40px", padding: "0 24px", fontSize: "11px" }}
              >
                RETAKE QUIZ
              </button>
              <Link
                href="/ai-roadmap"
                className="btn-bugatti"
                style={{ height: "40px", padding: "0 24px", fontSize: "11px", textDecoration: "none" }}
              >
                VIEW ROADMAP
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressHeader
              title={currentQuestion?.question ?? "Career Quiz"}
              description={
                phase === "phase1"
                  ? "Be honest — there are no wrong answers."
                  : "These questions are tailored to your interests."
              }
              progress={progress}
              step={{
                current: currentStep + 1,
                total: totalQuestions,
                label: `${phaseLabel} · Question ${currentStep + 1}`,
              }}
            />
            {currentQuestion && (
              <QuizQuestionCard
                question={currentQuestion.question}
                options={currentQuestion.options}
                type={currentQuestion.type}
                value={answers[currentStep]}
                onChange={submitAnswer}
              />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              <Button
                variant="outline"
                onClick={goBack}
                disabled={currentStep === 0}
              >
                BACK
              </Button>
              <Button
                variant="primary"
                onClick={goNext}
                disabled={!canProceed}
              >
                {isLastQuestion
                  ? phase === "phase1"
                    ? "GENERATE PERSONALISED QUESTIONS"
                    : "SEE RESULTS"
                  : "NEXT"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
