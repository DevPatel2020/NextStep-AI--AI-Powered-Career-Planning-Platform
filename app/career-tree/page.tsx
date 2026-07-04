"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  Node,
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Milestone {
  title: string;
  timeframe: string;
  skills: string[];
  actions: string[];
}

interface CareerBranch {
  id: string;
  title: string;
  color: string;
  description: string;
  shortTermAlignment: string;
  longTermAlignment: string;
  milestones: Milestone[];
}

interface CareerTreeData {
  root: { title: string; description: string; skills: string[] };
  branches: CareerBranch[];
}

interface FormData {
  skills: string;
  passions: string;
  targetRoles: string;
  currentStage: string;
  shortTermGoal: string;
  longTermGoal: string;
}

const initialForm: FormData = {
  skills: "",
  passions: "",
  targetRoles: "",
  currentStage: "",
  shortTermGoal: "",
  longTermGoal: "",
};

const STAGES = [
  "High School Student",
  "Undergraduate Student",
  "Graduate Student",
  "Recent Graduate",
  "Early Career (1–2 years)",
  "Career Switcher",
  "Self-learning",
];

type View = "form" | "loading" | "tree";

// ─── Custom Nodes ────────────────────────────────────────────────────────────

const RootNode = ({ data }: { data: { title: string; description: string; skills: string[] } }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      style={{
        background: "var(--color-surface-card)",
        border: "1px solid var(--color-hairline-strong)",
        borderRadius: "0px",
        padding: "20px",
        width: "280px",
        textAlign: "center",
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            height: "48px",
            width: "48px",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--color-hairline-strong)",
            background: "var(--color-surface-soft)",
            color: "var(--color-ink)",
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>{data.title.toUpperCase()}</h3>
        <p className="type-caption" style={{ color: "var(--color-muted-soft)", marginTop: "4px", margin: 0, fontSize: "10px" }}>
          STARTING POINT
        </p>
        <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
          {data.skills.map((s, i) => (
            <Badge key={i} variant="secondary" size="sm">
              {s.toUpperCase()}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const MilestoneNode = ({ data }: { data: Milestone & { color: string; onShowDetails: (m: Milestone) => void } }) => {
  return (
    <div
      style={{
        background: "var(--color-surface-card)",
        border: `1px solid ${data.color || "var(--color-hairline)"}`,
        borderRadius: "0px",
        padding: "16px",
        width: "240px",
        cursor: "pointer",
        textAlign: "center",
      }}
      onClick={() => data.onShowDetails(data)}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <span
          className="type-caption"
          style={{
            border: `1px solid ${data.color || "var(--color-hairline)"}`,
            padding: "4px 10px",
            color: data.color || "var(--color-ink)",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            background: "transparent",
          }}
        >
          {data.timeframe.toUpperCase()}
        </span>
        <div className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0 }}>
          {data.title.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
          {data.skills.slice(0, 2).map((s, i) => (
            <Badge key={i} variant="default" size="sm">
              {s.toUpperCase()}
            </Badge>
          ))}
          {data.skills.length > 2 && (
            <Badge variant="secondary" size="sm">+{data.skills.length - 2}</Badge>
          )}
        </div>

        <div className="type-caption" style={{ color: "var(--color-link)", fontSize: "9px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          VIEW DETAILS →
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  root: RootNode,
  milestone: MilestoneNode,
};

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              height: "32px",
              width: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: (i + 1 <= step) ? "1px solid var(--color-ink)" : "1px solid var(--color-hairline)",
              background: (i + 1 < step) ? "var(--color-surface-soft)" : "transparent",
              color: (i + 1 <= step) ? "var(--color-ink)" : "var(--color-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              borderRadius: "0px",
            }}
          >
            {i + 1 < step ? "✓" : String(i + 1).padStart(2, "0")}
          </div>
          {i < total - 1 && (
            <div
              style={{
                height: "1px",
                width: "40px",
                background: (i + 1 < step) ? "var(--color-hairline-strong)" : "var(--color-hairline)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CareerTreePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [view, setView] = useState<View>("form");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [milestoneResources, setMilestoneResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Restore saved tree on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("career-tree-data");
      if (saved) {
        generateNodesAndEdges(JSON.parse(saved));
        setView("tree");
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSteps = 3;

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const canProceed = () => {
    if (step === 1) return form.skills.trim() && form.passions.trim();
    if (step === 2) return form.currentStage.trim();
    if (step === 3) return form.shortTermGoal.trim() && form.longTermGoal.trim();
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const onShowDetails = useCallback((m: Milestone) => {
    setSelectedMilestone(m);
    setMilestoneResources([]);
    if (m.skills.length === 0) return;
    setResourcesLoading(true);
    const query = m.skills.slice(0, 3).join(" ");
    fetch(`/api/courses/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => setMilestoneResources((d.courses || []).slice(0, 2)))
      .catch(() => {})
      .finally(() => setResourcesLoading(false));
  }, []);

  const generateNodesAndEdges = (treeData: CareerTreeData) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Root Node
    newNodes.push({
      id: "root",
      type: "root",
      position: { x: 500, y: 50 },
      data: treeData.root,
    });

    const branchSpacing = 600;
    const verticalSpacing = 350;
    const startX = 500 - ((treeData.branches.length - 1) * branchSpacing) / 2;

    treeData.branches.forEach((branch, bIdx) => {
      const branchX = startX + bIdx * branchSpacing;

      branch.milestones.forEach((milestone, mIdx) => {
        const nodeId = `${branch.id}-m${mIdx}`;
        newNodes.push({
          id: nodeId,
          type: "milestone",
          position: { x: branchX - 110, y: 450 + mIdx * verticalSpacing },
          data: { ...milestone, color: branch.color, onShowDetails },
        });

        // Edge logic
        if (mIdx === 0) {
          newEdges.push({
            id: `e-root-${nodeId}`,
            source: "root",
            target: nodeId,
            animated: true,
            label: branch.title,
            labelStyle: { fill: branch.color, fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em" },
            labelBgStyle: { fill: isDark ? "#030712" : "#ffffff", fillOpacity: isDark ? 0.85 : 0.92, rx: 6 },
            labelBgPadding: [4, 8],
            style: { stroke: branch.color, strokeWidth: 3, opacity: 0.9 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: branch.color,
            },
          });
        } else {
          const prevNodeId = `${branch.id}-m${mIdx - 1}`;
          newEdges.push({
            id: `e-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            animated: true,
            style: { stroke: branch.color, opacity: 0.4 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: branch.color,
            },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleGenerate = async () => {
    setError("");
    setView("loading");
    try {
      const res = await fetch("/api/career-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details || "Failed to generate career tree");
        setView("form");
        return;
      }
      generateNodesAndEdges(data.tree);
      sessionStorage.setItem("career-tree-data", JSON.stringify(data.tree));
      setView("tree");
    } catch {
      setError("Network error. Please try again.");
      setView("form");
    }
  };

  const startOver = () => {
    sessionStorage.removeItem("career-tree-data");
    setView("form");
    setStep(1);
    setForm(initialForm);
    setNodes([]);
    setEdges([]);
    setError("");
    setIsFullscreen(false);
  };

  // ── Step labels
  const stepLabels = ["Skills & Passions", "Your Roles", "Your Goals"];
  const stepIcons = [
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  ];

  // Re-apply edge label bg colours when theme toggles
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (edges.length === 0) return;
    setEdges((prev) =>
      prev.map((edge) =>
        edge.labelBgStyle
          ? { ...edge, labelBgStyle: { ...edge.labelBgStyle, fill: isDark ? "#030712" : "#ffffff", fillOpacity: isDark ? 0.85 : 0.92 } }
          : edge
      )
    );
  }, [isDark]);

  return (
    <PageShell
      title="Career Tree"
      description="Map your professional progression — assess your strengths, explore career paths, and define your goals. We'll generate a personalized interactive career tree."
      maxWidth="xl"
    >
      {/* ── FORM VIEW ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === "form" && (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-2xl px-4"
          >
            <Card
              padding="lg"
              className="border border-[var(--color-hairline)] bg-[var(--color-surface-card)]"
            >
              <div className="mb-6 flex items-center gap-4">
                <motion.div
                  key={step}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: "flex",
                    height: "44px",
                    width: "44px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--color-hairline-strong)",
                    background: "var(--color-surface-soft)",
                    color: "var(--color-ink)",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stepIcons[step - 1]} />
                  </svg>
                </motion.div>
                <div>
                  <div className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>
                    STEP {step} OF {totalSteps}
                  </div>
                  <h2 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>{stepLabels[step - 1].toUpperCase()}</h2>
                </div>
              </div>

              <StepIndicator step={step} total={totalSteps} />

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{
                    border: "1px solid var(--color-error)",
                    background: "transparent",
                    padding: "12px",
                    color: "var(--color-error)",
                    marginBottom: "16px",
                  }}
                  className="type-body-md"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && (
                    <div className="space-y-5">
                      <Textarea
                        label="Your current skills"
                        placeholder="e.g. Python, mathematics, writing, public speaking..."
                        value={form.skills}
                        onChange={set("skills")}
                        rows={3}
                        required
                      />
                      <Textarea
                        label="Your passions & interests"
                        placeholder="e.g. AI/machine learning, helping people, creative design..."
                        value={form.passions}
                        onChange={set("passions")}
                        rows={3}
                        required
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <Textarea
                        label="Roles or industries you've researched"
                        placeholder="e.g. Data Scientist, Software Engineer..."
                        value={form.targetRoles}
                        onChange={set("targetRoles")}
                        rows={3}
                      />
                      <Select
                        label="Your current stage"
                        value={form.currentStage}
                        onChange={set("currentStage")}
                        required
                        options={[
                          { value: "", label: "Select your stage..." },
                          ...STAGES.map((s) => ({ value: s, label: s })),
                        ]}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <Textarea
                        label="Short-term goal (next 6–12 months)"
                        placeholder="e.g. Land a data science internship..."
                        value={form.shortTermGoal}
                        onChange={set("shortTermGoal")}
                        rows={2}
                        required
                      />
                      <Textarea
                        label="Long-term goal (3–5 years from now)"
                        placeholder="e.g. Become a senior ML engineer..."
                        value={form.longTermGoal}
                        onChange={set("longTermGoal")}
                        rows={2}
                        required
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "32px" }}>
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    BACK
                  </Button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    NEXT STEP →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={!canProceed()}
                  >
                    GENERATE CAREER TREE
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── LOADING VIEW ──────────────────────────────────────────────────── */}
        {view === "loading" && (
          <motion.div
            key="loading-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  height: "56px",
                  width: "56px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--color-hairline-strong)",
                  color: "var(--color-ink)",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
                ARCHITECTING YOUR FUTURE
              </p>
              <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}>
                AI is mapping thousands of possibilities into 3 optimal paths...
              </p>
            </div>
          </motion.div>
        )}

        {/* ── TREE VIEW ─────────────────────────────────────────────────────── */}
        {view === "tree" && (
          <motion.div
            key="tree-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={
              isFullscreen
                ? `fixed inset-0 z-50 ${isDark ? "bg-[#000000]" : "bg-[#f8fafc]"}`
                : `h-[800px] w-full relative border border-white/5 overflow-hidden ${isDark ? "bg-[#000000]" : "bg-[#f8fafc]"}`
            }
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.1}
              maxZoom={2}
            >
              <Background color={isDark ? "#1f2937" : "#cbd5e1"} size={1.5} gap={24} variant={"dots" as any} />
              <Controls style={{ borderRadius: "0px", border: "1px solid var(--color-hairline)" }} />

              <Panel position="top-right" className="flex gap-2 items-center">
                {/* Maximize / Minimize toggle */}
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  title={isFullscreen ? "Exit full screen" : "Full screen"}
                  className="btn-bugatti"
                  style={{ height: "32px", width: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {isFullscreen ? "[-]" : "[+]"}
                </button>
                <Button size="sm" variant="outline" onClick={startOver}>
                  START OVER
                </Button>
                <Button size="sm" variant="primary" onClick={() => window.print()}>
                  EXPORT PLAN
                </Button>
              </Panel>

              <Panel position="bottom-left" style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-hairline)", padding: "20px", maxWidth: "320px", margin: "24px" }}>
                <h4 className="type-caption" style={{ color: "var(--color-ink)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  NAVIGATOR
                </h4>
                <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>
                  Welcome to your interactive career architecture. Connect with Root to see your foundation, or explore the Branches to discover your potential. Click any node for detailed action plans.
                </p>
              </Panel>
            </ReactFlow>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DETAILS MODAL ─────────────────────────────────────────────────── */}
      {selectedMilestone && (
        <Modal
          open={!!selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          title={selectedMilestone.title}
          size="lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

            {/* ── LEFT: Milestone Details ── */}
            <div className="flex flex-col gap-5">
              {/* Timeframe Badge */}
              <Badge variant="primary" size="sm" style={{ alignSelf: "flex-start" }}>
                {selectedMilestone.timeframe.toUpperCase()}
              </Badge>

              {/* Skills */}
              <div>
                <p className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase" }}>SKILLS TO ACQUIRE</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedMilestone.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" size="sm">
                      {skill.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ flex: 1 }}>
                <p className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px", marginBottom: "12px", textTransform: "uppercase" }}>EXECUTION STRATEGY</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedMilestone.actions.map((action, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", border: "1px solid var(--color-hairline)", padding: "12px", background: "var(--color-surface-card)" }}>
                      <div
                        style={{
                          display: "flex",
                          height: "20px",
                          width: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--color-hairline-strong)",
                          color: "var(--color-muted)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p className="type-body-sm" style={{ color: "var(--color-body)", margin: 0, lineHeight: 1.5 }}>{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Learning Resources ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px", textTransform: "uppercase" }}>SUGGESTED LEARNING RESOURCES</p>

              {resourcesLoading ? (
                <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--color-muted)" }} className="type-caption">
                  <svg style={{ animation: "spin 1s linear infinite", width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  FINDING RESOURCES...
                </div>
              ) : milestoneResources.length === 0 ? (
                <p className="type-body-sm" style={{ color: "var(--color-muted)" }}>No resources found.</p>
              ) : (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {milestoneResources.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        border: "1px solid var(--color-hairline)",
                        background: "var(--color-surface-card)",
                        padding: "16px",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Badge variant="primary" size="sm">
                          {r.type.toUpperCase()}
                        </Badge>
                        <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "9px" }}>{r.source.toUpperCase()}</span>
                      </div>
                      <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0, lineHeight: 1.4 }}>
                        {r.title.toUpperCase()}
                      </p>
                      <span className="type-caption" style={{ color: "var(--color-link)", fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                        EXPLORE RESOURCE →
                      </span>
                    </a>
                  ))}
                </div>
                <Link
                  href={"/learning-resources?q=" + encodeURIComponent(selectedMilestone.skills.slice(0, 3).join(" "))}
                  className="btn-bugatti"
                  style={{ height: "36px", fontSize: "11px", textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  SHOW MORE RESOURCES →
                </Link>
                </>
              )}
            </div>

          </div>
        </Modal>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </PageShell>
  );
}
