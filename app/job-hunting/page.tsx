"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type JobStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

const statusVariant: Record<JobStatus, "default" | "primary" | "secondary" | "success" | "error"> = {
  saved: "default",
  applied: "primary",
  interviewing: "secondary",
  offer: "success",
  rejected: "error",
};

// ─── Job Titles / Keywords List ───────────────────────────────────────────────

const JOB_TITLES = [
  // ── Software & Web Development ──
  "Software Engineer", "Software Developer", "Software Development",
  "Frontend Developer", "Frontend Development", "Frontend Engineer",
  "Backend Developer", "Backend Development", "Backend Engineer",
  "Full Stack Developer", "Full Stack Engineer", "Full Stack Development",
  "Web Developer", "Web Development", "Web Designer",
  "React Developer", "React.js Developer", "Next.js Developer",
  "Angular Developer", "Vue.js Developer", "JavaScript Developer",
  "TypeScript Developer", "Node.js Developer", "Express.js Developer",
  "Python Developer", "Python Development", "Django Developer", "Flask Developer",
  "Java Developer", "Java Development", "Spring Boot Developer",
  "PHP Developer", "Laravel Developer", "WordPress Developer",
  "Ruby on Rails Developer", "Go Developer", "Rust Developer",
  "C++ Developer", "C# Developer", ".NET Developer", "ASP.NET Developer",
  "Mobile Developer", "Mobile App Development", "Mobile App Developer",
  "iOS Developer", "Swift Developer", "Objective-C Developer",
  "Android Developer", "Kotlin Developer", "Flutter Developer",
  "React Native Developer", "Xamarin Developer", "Cross Platform Developer",
  // ── Data & Analytics ──
  "Data Analyst", "Data Analysis", "Data Analytics",
  "Data Scientist", "Data Science", "Data Science Intern",
  "Data Engineer", "Data Engineering", "Data Pipeline Engineer",
  "Business Intelligence Analyst", "Business Intelligence", "BI Developer",
  "Business Analyst", "Business Analysis",
  "Database Administrator", "Database Developer", "Database Engineer",
  "SQL Developer", "MySQL Developer", "PostgreSQL Developer",
  "NoSQL Developer", "MongoDB Developer", "Elasticsearch Engineer",
  "Analytics Engineer", "Quantitative Analyst", "Statistical Analyst",
  "Market Research Analyst", "Research Analyst", "Product Analyst",
  "Reporting Analyst", "Data Visualization Specialist", "Tableau Developer",
  "Power BI Developer", "Data Warehouse Engineer", "ETL Developer",
  // ── AI & Machine Learning ──
  "Machine Learning Engineer", "Machine Learning", "ML Engineer",
  "AI Engineer", "Artificial Intelligence", "AI Developer",
  "Deep Learning Engineer", "Deep Learning", "NLP Engineer",
  "Natural Language Processing", "Computer Vision Engineer", "Computer Vision",
  "LLM Engineer", "Generative AI Engineer", "Prompt Engineer",
  "AI Research Scientist", "Research Scientist", "Applied Scientist",
  "MLOps Engineer", "AI Intern",
  // ── DevOps, Cloud & Infrastructure ──
  "DevOps Engineer", "DevOps", "Site Reliability Engineer", "SRE",
  "Cloud Engineer", "Cloud Computing", "Cloud Architect",
  "AWS Engineer", "AWS Developer", "AWS Solutions Architect",
  "Azure Engineer", "Azure Developer", "GCP Engineer",
  "Google Cloud Engineer", "Infrastructure Engineer", "Platform Engineer",
  "Kubernetes Engineer", "Docker Engineer", "Linux Administrator",
  "Systems Administrator", "Systems Engineer", "IT Infrastructure",
  "Network Engineer", "Network Administrator", "Network Security Engineer",
  // ── Cybersecurity ──
  "Cybersecurity Engineer", "Cybersecurity Analyst", "Cybersecurity",
  "Information Security Analyst", "Information Security", "Security Engineer",
  "Penetration Tester", "Ethical Hacker", "SOC Analyst",
  "Security Operations", "Threat Intelligence Analyst", "Identity Access Management",
  // ── QA & Testing ──
  "QA Engineer", "Quality Assurance Engineer", "Quality Assurance",
  "Test Engineer", "Software Tester", "Manual Tester",
  "Automation Test Engineer", "Test Automation", "Selenium Tester",
  "Performance Test Engineer", "SDET",
  // ── Embedded & Hardware ──
  "Embedded Systems Engineer", "Embedded Developer", "Firmware Engineer",
  "Hardware Engineer", "VLSI Engineer", "FPGA Developer",
  "IoT Engineer", "Internet of Things", "Robotics Engineer",
  // ── Emerging Tech ──
  "Blockchain Developer", "Blockchain Engineer", "Blockchain",
  "Web3 Developer", "Smart Contract Developer", "Solidity Developer",
  "Game Developer", "Game Development", "Unity Developer", "Unreal Engine Developer",
  "AR/VR Developer", "Augmented Reality", "Virtual Reality", "XR Developer",
  "Metaverse Developer", "3D Developer",
  // ── Design & UX ──
  "UI/UX Designer", "UI Designer", "UX Designer", "UX Design",
  "Product Designer", "Product Design", "Interaction Designer",
  "Graphic Designer", "Graphic Design", "Visual Designer",
  "Motion Designer", "Motion Graphics", "Video Editor",
  "UX Researcher", "UX Research", "Usability Analyst",
  "Brand Designer", "Logo Designer", "Illustration Artist",
  "Figma Designer", "Adobe XD Designer", "Prototyping",
  // ── Product & Project Management ──
  "Product Manager", "Product Management", "Senior Product Manager",
  "Project Manager", "Project Management", "IT Project Manager",
  "Program Manager", "Technical Program Manager", "Delivery Manager",
  "Scrum Master", "Agile Coach", "Agile Project Management",
  "Engineering Manager", "Technical Lead", "Tech Lead",
  "CTO", "VP of Engineering", "Head of Engineering",
  "IT Consultant", "IT Manager", "IT Director",
  "Solutions Architect", "Technical Architect", "Enterprise Architect",
  // ── Marketing & Growth ──
  "Digital Marketing Manager", "Digital Marketing", "Digital Marketer",
  "SEO Specialist", "SEO Analyst", "Search Engine Optimization",
  "SEM Specialist", "Google Ads Specialist", "PPC Specialist",
  "Content Writer", "Content Marketing", "Content Strategist",
  "Copywriter", "Technical Writer", "Blog Writer",
  "Social Media Manager", "Social Media Marketing", "Community Manager",
  "Growth Hacker", "Growth Marketing", "Performance Marketing Manager",
  "Email Marketing Specialist", "CRM Manager", "Marketing Analyst",
  "Brand Manager", "Brand Marketing", "PR Manager",
  "Video Content Creator", "YouTuber", "Influencer Marketing Manager",
  // ── Sales & Business Development ──
  "Sales Executive", "Sales Representative", "Sales Manager",
  "Business Development Manager", "Business Development", "BDM",
  "Account Manager", "Account Executive", "Key Account Manager",
  "Inside Sales", "Field Sales Representative", "Pre-Sales Consultant",
  "Sales Engineer", "Solution Sales Specialist", "Channel Sales Manager",
  // ── Finance & Accounting ──
  "Financial Analyst", "Financial Analysis", "Finance Manager",
  "Investment Analyst", "Investment Banking Analyst", "Investment Banking",
  "Chartered Accountant", "Cost Accountant", "Management Accountant",
  "Auditor", "Internal Auditor", "External Auditor",
  "Tax Consultant", "Tax Analyst", "Taxation",
  "CFO", "Finance Director", "Head of Finance",
  "Risk Analyst", "Risk Management", "Credit Analyst",
  "Compliance Officer", "Compliance Analyst", "Regulatory Affairs",
  "Financial Planner", "Wealth Manager", "Insurance Analyst",
  "Equity Research Analyst", "Fund Manager", "Portfolio Manager",
  // ── HR & Recruitment ──
  "HR Manager", "Human Resources Manager", "HR Business Partner",
  "Talent Acquisition Specialist", "Talent Acquisition", "Recruiter",
  "Technical Recruiter", "IT Recruiter", "Staffing Specialist",
  "HR Generalist", "HR Executive", "Payroll Manager",
  "Learning & Development Manager", "L&D Specialist", "Training Manager",
  "Employee Relations Manager", "Compensation & Benefits Analyst",
  "Operations Manager", "Operations Analyst", "Business Operations",
  // ── Supply Chain & Logistics ──
  "Supply Chain Manager", "Supply Chain Analyst", "Supply Chain",
  "Logistics Manager", "Logistics Coordinator", "Logistics Executive",
  "Procurement Manager", "Procurement Analyst", "Procurement Executive",
  "Inventory Manager", "Warehouse Manager", "Distribution Manager",
  "Import Export Manager", "Freight Coordinator", "Fleet Manager",
  // ── Healthcare & Life Sciences ──
  "Doctor", "General Physician", "Surgeon",
  "Nurse", "Staff Nurse", "Nursing Manager",
  "Pharmacist", "Clinical Pharmacist", "Medical Officer",
  "Medical Representative", "Pharmaceutical Sales", "Healthcare Sales",
  "Clinical Research Associate", "Clinical Research", "CRA",
  "Hospital Administrator", "Healthcare Administrator", "Hospital Management",
  "Healthcare Analyst", "Health Informatics", "Medical Coding",
  "Physiotherapist", "Radiologist", "Lab Technician",
  // ── Education & Training ──
  "Teacher", "School Teacher", "Primary Teacher",
  "Professor", "Lecturer", "Assistant Professor",
  "Instructional Designer", "Curriculum Developer", "E-learning Developer",
  "EdTech Developer", "Education Technology", "Online Tutor",
  "Academic Counselor", "Career Counselor", "Education Counselor",
  "Corporate Trainer", "Soft Skills Trainer", "Life Coach",
  // ── Legal & Compliance ──
  "Lawyer", "Advocate", "Corporate Lawyer",
  "Legal Advisor", "Legal Counsel", "In-House Counsel",
  "Paralegal", "Legal Assistant", "Contract Manager",
  "Compliance Manager", "Regulatory Compliance", "Legal Compliance",
  "Intellectual Property Analyst", "Patent Analyst",
  // ── Civil, Mechanical & Electrical Engineering ──
  "Civil Engineer", "Civil Engineering", "Site Engineer",
  "Structural Engineer", "Structural Engineering", "Geotechnical Engineer",
  "Mechanical Engineer", "Mechanical Engineering", "Manufacturing Engineer",
  "Electrical Engineer", "Electrical Engineering", "Power Systems Engineer",
  "Architect", "Architecture", "Urban Planner",
  "Interior Designer", "Interior Design", "Space Planner",
  "Construction Manager", "Construction Project Manager", "Site Supervisor",
  "AutoCAD Engineer", "CAD Designer", "BIM Engineer",
  "MEP Engineer", "HVAC Engineer", "Piping Engineer",
  // ── Customer Support ──
  "Customer Support Executive", "Customer Service Representative", "Customer Service",
  "Technical Support Engineer", "Help Desk Analyst", "IT Support",
  "Customer Success Manager", "Client Relationship Manager", "CRM Specialist",
  // ── Internships & Fresher Roles ──
  "Software Intern", "Software Engineering Intern", "Development Intern",
  "ML Intern", "AI Intern",
  "Marketing Intern", "Digital Marketing Intern", "Content Intern",
  "Finance Intern", "Accounting Intern", "HR Intern",
  "Design Intern", "UI UX Intern", "Research Intern",
  "Fresher Software Engineer", "Graduate Trainee", "Management Trainee",
  "Entry Level Developer", "Junior Developer", "Junior Data Analyst",
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url: string;
  source: string;
  postedAt: string;
  requiredExperienceMonths: number | null;
  experienceText: string | null; // e.g. "4+ years of experience in data analysis"
  isRemote: boolean | null;
}

interface SavedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  status: string;
  updatedAt: string;
}


const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-gray-100 text-gray-700",
  applied: "bg-blue-100 text-blue-700",
  interviewing: "bg-yellow-100 text-yellow-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// ─── Experience Extractor ────────────────────────────────────────────────────
// Server already parsed the full description and stored the result in `experienceText`.
// This function is a lightweight display layer that formats / falls back cleanly.

function extractExperience(job: {
  requiredExperienceMonths: number | null;
  experienceText: string | null;
  description: string;
}): string {
  // Priority 1: server-extracted clean string (from qualifications or full description)
  if (job.experienceText) {
    const t = job.experienceText.trim();
    if (/fresher|no experience required/i.test(t)) return "Fresher";
    return t;
  }

  // Priority 2: numeric months from the required_experience field
  if (job.requiredExperienceMonths !== null) {
    if (job.requiredExperienceMonths === 0) return "Fresher";
    const yrs = Math.round(job.requiredExperienceMonths / 12);
    return `${yrs} year${yrs > 1 ? "s" : ""}`;
  }

  // Priority 3: lightweight regex on the (short) display description
  const preferredRe = /preferred|optional|nice[- ]to[- ]have|bonus/i;
  const sentences = job.description.split(/[.!?\n]+/);

  const patterns: { re: RegExp; fmt: (m: RegExpMatchArray) => string }[] = [
    // Range: "2-4 years" / "2 to 4 years"
    { re: /(\d+)\s*(?:–|-)\s*(\d+)\+?\s*years?/i, fmt: (m) => `${m[1]}-${m[2]} years` },
    { re: /(\d+)\s+to\s+(\d+)\+?\s*years?/i, fmt: (m) => `${m[1]}-${m[2]} years` },
    // Minimum / at least
    { re: /(?:minimum|at\s+least|min\.?)\s+(\d+)\+?\s*years?/i, fmt: (m) => `${m[1]}+ years` },
    // X+ years
    { re: /(\d+)\+\s*years?(?:\s+of)?(?:\s+\w+)?\s*experience/i, fmt: (m) => `${m[1]}+ years` },
    // X years of experience
    { re: /(\d+)\s*years?\s+of\s+(?:\w+\s+)?experience/i, fmt: (m) => `${m[1]} year${Number(m[1]) > 1 ? "s" : ""}` },
    // X years experience
    { re: /(\d+)\s*years?\s+(?:\w+\s+)?experience/i, fmt: (m) => `${m[1]} year${Number(m[1]) > 1 ? "s" : ""}` },
  ];

  // Pass 1 – required mentions only
  for (const pat of patterns) {
    for (const s of sentences) {
      const m = s.match(pat.re);
      if (m && !preferredRe.test(s)) return pat.fmt(m);
    }
  }
  // Pass 2 – accept preferred if nothing else found
  for (const pat of patterns) {
    for (const s of sentences) {
      const m = s.match(pat.re);
      if (m) return pat.fmt(m);
    }
  }

  if (/fresh(?:er)?|entry[- ]level|no[\s-]experience\s+required/i.test(job.description)) return "Fresher";

  return "Not specified";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobHuntingPage() {
  const [tab, setTab] = useState<"discover" | "saved">("discover");

  // ── Discover tab state ──
  const [query, setQuery] = useState("");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const jobInputRef = useRef<HTMLDivElement>(null);
  const [experience, setExperience] = useState("0");
  const [workMode, setWorkMode] = useState("");
  const [country, setCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  // Searchable location fields
  const [countryQuery, setCountryQuery] = useState("India");
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [workModeOpen, setWorkModeOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const workModeRef = useRef<HTMLDivElement>(null);
  const [discovering, setDiscovering] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [discoveredJobs, setDiscoveredJobs] = useState<DiscoveredJob[]>([]);
  const [discoverError, setDiscoverError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastQueryRef = useRef("");
  const lastLocationRef = useRef("");
  const lastExperienceRef = useRef("");

  // Experience options: 0 = Fresher, 1–30 years
  const EXPERIENCE_OPTIONS = [
    { value: "0", label: "Fresher" },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
    })),
  ];

  // Build experience keyword to append to query
  const experienceQuery =
    experience === "" ? "" :
      experience === "0" ? "fresher entry level" :
        `${experience} year${Number(experience) > 1 ? "s" : ""}`;

  // Work mode options
  const WORK_MODE_OPTIONS = [
    { value: "", label: "Any Work Mode" },
    { value: "remote", label: " Remote" },
    { value: "onsite", label: " On-site" },
    { value: "hybrid", label: " Hybrid" },
    { value: "fulltime", label: " Full-time" },
    { value: "parttime", label: " Part-time" },
    { value: "contract", label: " Contract" },
    { value: "internship", label: " Internship" },
  ];

  // Work mode keyword map (appended to the API search query)
  const WORK_MODE_KEYWORDS: Record<string, string> = {
    remote: "remote",
    onsite: "on-site",
    hybrid: "hybrid",
    fulltime: "full-time",
    parttime: "part-time",
    contract: "contract",
    internship: "internship",
  };


  // Helper: format experience for display on card
  const formatExp = (months: number | null): string => {
    if (months === null) return "";
    if (months === 0) return "Fresher";
    const yrs = Math.round(months / 12);
    return `${yrs} yr${yrs > 1 ? "s" : ""} exp required`;
  };

  // ── Parse minimum required years from experienceText ──
  // Returns null → "Not specified" or unknown → job always passes the filter
  const parseMinRequiredYears = (job: DiscoveredJob): number | null => {
    const text = job.experienceText?.trim() ?? "";

    // Unknown / "Not specified" → always show
    if (!text || /not specified/i.test(text)) return null;

    // Fresher / entry level → 0
    if (/fresher|entry[- ]level|no[\s-]experience/i.test(text)) return 0;

    // "X-Y years" or "X – Y years" → minimum is X
    const rangeMatch = text.match(/(\d+)\s*[-–]\s*(\d+)\s*year/i);
    if (rangeMatch) return Number(rangeMatch[1]);

    // "X to Y years" → minimum is X
    const toMatch = text.match(/(\d+)\s+to\s+(\d+)\s*year/i);
    if (toMatch) return Number(toMatch[1]);

    // "X+ years"
    const plusMatch = text.match(/(\d+)\+\s*year/i);
    if (plusMatch) return Number(plusMatch[1]);

    // "minimum X years" / "at least X years"
    const minMatch = text.match(/(?:minimum|at\s+least|min\.?)\s+(\d+)/i);
    if (minMatch) return Number(minMatch[1]);

    // "X years" (plain)
    const plainMatch = text.match(/(\d+)\s*year/i);
    if (plainMatch) return Number(plainMatch[1]);

    // Can't determine — show always
    return null;
  };

  // Client-side filter: experience + work mode
  const filteredDiscoveredJobs = discoveredJobs.filter((job) => {
    // ─ Experience filter ─
    if (experience !== "") {
      const userYears = Number(experience); // 0 = Fresher, 1–30 = years
      const minRequired = parseMinRequiredYears(job);

      // "Not specified" (null) → always show regardless of selection
      if (minRequired !== null) {
        if (userYears === 0) {
          // Fresher: show jobs requiring 0–2 years (0, 1, or 2 year minimum)
          if (minRequired > 2) return false;
        } else {
          // X years: show jobs where min required ≤ user's experience
          if (minRequired > userYears) return false;
        }
      }
    }

    if (workMode !== "") {
      if (workMode === "remote") {
        // only show if explicitly remote
        if (job.isRemote === false) return false;
      } else if (workMode === "onsite") {
        if (job.isRemote === true) return false;
      } else if (workMode === "hybrid") {
        // hybrid: not purely remote, not purely on-site — match by type keyword
        const typeStr = (job.type ?? "").toLowerCase();
        if (!typeStr.includes("hybrid") && job.isRemote !== null) return false;
      } else {
        // fulltime / parttime / contract / internship — match job.type
        const typeKeyword = WORK_MODE_KEYWORDS[workMode] ?? "";
        const typeStr = (job.type ?? "").toLowerCase();
        if (typeKeyword && !typeStr.includes(typeKeyword.replace("-", "").replace("-", ""))) return false;
      }
    }
    return true;
  });
  // Close location dropdowns on outside click — restore display value on close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCountryQuery(country); // restore to selected value
      }
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setStateOpen(false);
        setStateQuery(selectedState); // restore to selected value
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
        setCityQuery(city); // restore to selected value
      }
      if (experienceRef.current && !experienceRef.current.contains(e.target as Node)) {
        setExperienceOpen(false);
      }
      if (workModeRef.current && !workModeRef.current.contains(e.target as Node)) {
        setWorkModeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [country, selectedState, city]);

  // Close job dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (jobInputRef.current && !jobInputRef.current.contains(e.target as Node)) {
        setJobDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filtered job titles — only show dropdown when user has typed something
  const filteredTitles = query.trim()
    ? JOB_TITLES.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : [];

  // ── My Applications tab state ──
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Load saved jobs ──
  const loadSavedJobs = useCallback(async () => {
    setLoadingSaved(true);
    try {
      const res = await fetch("/api/jobs/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data.jobs ?? []);
        setSavedIds(new Set((data.jobs ?? []).map((j: SavedJob) => j.jobId)));
      }
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  // ── Remote location lists (fetched from API) ──
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Fetch countries on mount
  useEffect(() => {
    fetch("/api/locations?type=countries")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCountries(data); })
      .catch(console.error);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }
    fetch(`/api/locations?type=states&country=${encodeURIComponent(country)}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStates(data); })
      .catch(console.error);
  }, [country]);

  // Fetch cities when country or state changes
  useEffect(() => {
    if (!country || !selectedState) {
      setCities([]);
      return;
    }
    fetch(`/api/locations?type=cities&country=${encodeURIComponent(country)}&state=${encodeURIComponent(selectedState)}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCities(data); })
      .catch(console.error);
  }, [country, selectedState]);

  // Build location string from selections
  const locationString = [city, selectedState, country].filter(Boolean).join(", ");


  // ── Search jobs (fresh search, resets page) ──
  const searchJobs = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setDiscoverError("");
    setDiscovering(true);
    setHasSearched(true);
    setCurrentPage(1);
    const baseQ = query || "software engineer";
    const expPart = experienceQuery ? ` ${experienceQuery}` : "";
    const modePart = workMode ? ` ${WORK_MODE_KEYWORDS[workMode] ?? ""}` : "";
    const q = `${baseQ}${expPart}${modePart}`;
    const loc = locationString || "India";
    lastQueryRef.current = q;
    lastLocationRef.current = loc;
    lastExperienceRef.current = experienceQuery;
    try {
      const params = new URLSearchParams({ query: q, location: loc, page: "1" });
      const res = await fetch(`/api/jobs/search?${params}`);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setDiscoverError("API Rate Limit Reached: You are searching too fast or have reached your JSearch monthly quota. Please wait a minute and try again.");
        } else {
          setDiscoverError(data.error || "Failed to fetch jobs.");
        }
        return;
      }
      const jobs = data.jobs ?? [];
      setDiscoveredJobs(jobs);
      setHasMore(jobs.length >= 10);
    } catch {
      setDiscoverError("Network error. Please try again.");
    } finally {
      setDiscovering(false);
    }
  };

  // ── Load more jobs (next page, appends to existing list) ──
  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const params = new URLSearchParams({
        query: lastQueryRef.current,
        location: lastLocationRef.current,
        page: String(nextPage),
      });
      const res = await fetch(`/api/jobs/search?${params}`);
      const data = await res.json();
      if (!res.ok) return;
      const newJobs: DiscoveredJob[] = data.jobs ?? [];
      setDiscoveredJobs((prev) => {
        // deduplicate by id
        const existingIds = new Set(prev.map((j) => j.id));
        const unique = newJobs.filter((j) => !existingIds.has(j.id));
        return [...prev, ...unique];
      });
      setCurrentPage(nextPage);
      setHasMore(newJobs.length >= 10);
    } catch {
      // silently fail load more
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Save a discovered job ──
  const saveJob = async (job: DiscoveredJob) => {
    setSavingId(job.id);
    try {
      const res = await fetch("/api/jobs/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          source: job.source,
        }),
      });
      if (res.ok) {
        setSavedIds((prev) => new Set([...prev, job.id]));
        await loadSavedJobs();
      }
    } finally {
      setSavingId(null);
    }
  };

  // ── Update job status ──
  const updateStatus = async (id: string, status: JobStatus) => {
    setUpdatingId(id);
    try {
      await fetch("/api/jobs/saved", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setSavedJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status } : j))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Delete a saved job ──
  const deleteJob = async (id: string) => {
    await fetch(`/api/jobs/saved?id=${id}`, { method: "DELETE" });
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  // ── Stats ──
  const stats = {
    saved: savedJobs.filter((j) => j.status === "saved").length,
    applied: savedJobs.filter((j) => j.status === "applied").length,
    interviewing: savedJobs.filter((j) => j.status === "interviewing").length,
    offer: savedJobs.filter((j) => j.status === "offer").length,
  };

  return (
    <PageShell
      title="Job Hunting"
      description="Search real jobs from Naukri, LinkedIn, Indeed and more. Track your applications."
      maxWidth="xl"
    >
      {/* Stats bar */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {[
          { label: "Saved", value: stats.saved },
          { label: "Applied", value: stats.applied },
          { label: "Interviewing", value: stats.interviewing },
          { label: "Offers", value: stats.offer },
        ].map(({ label, value }) => (
          <Card key={label} padding="md">
            <p className="type-display-md" style={{ color: "var(--color-ink)", margin: 0 }}>{value}</p>
            <p className="type-caption" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>{label.toUpperCase()}</p>
          </Card>
        ))}
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid var(--color-hairline)", marginBottom: "32px" }}>
        {(["discover", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="type-nav"
            style={{
              padding: "12px 0",
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "1px solid var(--color-ink)" : "1px solid transparent",
              color: tab === t ? "var(--color-ink)" : "var(--color-muted)",
              cursor: "pointer",
              transition: "color 0.15s ease",
            }}
          >
            {t === "discover" ? "DISCOVER JOBS" : `MY APPLICATIONS (${savedJobs.length})`}
          </button>
        ))}
      </div>

      {/* ── DISCOVER TAB ── */}
      {tab === "discover" && (
        <div className="space-y-6">
          {/* Search form */}
          <Card padding="md">
            <form onSubmit={searchJobs} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Row 1: Job title + Experience + Work Mode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", alignItems: "end" }}>
                
                {/* Job title dropdown */}
                <div ref={jobInputRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>
                    JOB TITLE OR KEYWORDS
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setJobDropdownOpen(e.target.value.trim().length > 0); }}
                    onFocus={() => { if (query.trim().length > 0) setJobDropdownOpen(true); }}
                    placeholder="e.g. Software Engineer, Data Analyst"
                    style={{
                      display: "block",
                      width: "100%",
                      background: "transparent",
                      color: "var(--color-ink)",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                  {jobDropdownOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "240px",
                      overflowY: "auto",
                    }}>
                      {query.trim() && !JOB_TITLES.some((t) => t.toLowerCase() === query.toLowerCase()) && (
                        <button
                          type="button"
                          onMouseDown={() => { setJobDropdownOpen(false); }}
                          className="type-caption"
                          style={{
                            display: "flex",
                            width: "100%",
                            padding: "12px 16px",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--color-hairline)",
                            color: "var(--color-link)",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          SEARCH FOR "{query.toUpperCase()}"
                        </button>
                      )}
                      {filteredTitles.length > 0 ? (
                        filteredTitles.map((title, idx) => (
                          <button
                            key={`${idx}-${title}`}
                            type="button"
                            onMouseDown={() => { setQuery(title); setJobDropdownOpen(false); }}
                            className="type-body-sm"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 16px",
                              background: "transparent",
                              border: "none",
                              color: "var(--color-body)",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-body)")}
                          >
                            {title}
                          </button>
                        ))
                      ) : (
                        <p className="type-body-sm" style={{ padding: "12px 16px", color: "var(--color-muted)", margin: 0 }}>
                          No matches found.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div ref={experienceRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>
                    EXPERIENCE
                  </label>
                  <button
                    type="button"
                    onClick={() => setExperienceOpen(!experienceOpen)}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      color: "var(--color-ink)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {EXPERIENCE_OPTIONS.find((opt) => opt.value === experience)?.label || "Fresher"}
                    </span>
                    <svg width="10" height="6" fill="none" stroke="currentColor" viewBox="0 0 10 6" style={{ opacity: 0.5 }}>
                      <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
                    </svg>
                  </button>
                  {experienceOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onMouseDown={() => {
                            setExperience(opt.value);
                            setExperienceOpen(false);
                          }}
                          className="type-body-sm"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 16px",
                            background: "transparent",
                            border: "none",
                            color: opt.value === experience ? "var(--color-ink)" : "var(--color-body)",
                            cursor: "pointer",
                            textAlign: "left",
                            fontWeight: opt.value === experience ? 500 : 400,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work Mode */}
                <div ref={workModeRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>
                    WORK MODE
                  </label>
                  <button
                    type="button"
                    onClick={() => setWorkModeOpen(!workModeOpen)}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      color: "var(--color-ink)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {WORK_MODE_OPTIONS.find((opt) => opt.value === workMode)?.label || "Any Work Mode"}
                    </span>
                    <svg width="10" height="6" fill="none" stroke="currentColor" viewBox="0 0 10 6" style={{ opacity: 0.5 }}>
                      <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
                    </svg>
                  </button>
                  {workModeOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                      {WORK_MODE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onMouseDown={() => {
                            setWorkMode(opt.value);
                            setWorkModeOpen(false);
                          }}
                          className="type-body-sm"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 16px",
                            background: "transparent",
                            border: "none",
                            color: opt.value === workMode ? "var(--color-ink)" : "var(--color-body)",
                            cursor: "pointer",
                            textAlign: "left",
                            fontWeight: opt.value === workMode ? 500 : 400,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Location — country, state, city */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>

                {/* Country */}
                <div ref={countryRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>COUNTRY</label>
                  <input
                    type="text"
                    value={countryQuery}
                    onChange={(e) => { setCountryQuery(e.target.value); setCountryOpen(true); }}
                    onFocus={() => { setCountryQuery(""); setCountryOpen(true); }}
                    placeholder="Search country…"
                    style={{
                      display: "block",
                      width: "100%",
                      background: "transparent",
                      color: "var(--color-ink)",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                  {countryOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                      {countries
                        .filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()))
                        .map((c) => (
                          <button
                            key={c}
                            type="button"
                            onMouseDown={() => {
                              setCountry(c); setCountryQuery(c);
                              setSelectedState(""); setStateQuery("");
                              setCity(""); setCityQuery("");
                              setCountryOpen(false);
                            }}
                            className="type-body-sm"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 16px",
                              background: "transparent",
                              border: "none",
                              color: c === country ? "var(--color-ink)" : "var(--color-body)",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: c === country ? 500 : 400,
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      {countries.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase())).length === 0 && (
                        <p className="type-body-sm" style={{ padding: "12px 16px", color: "var(--color-muted)", margin: 0 }}>No countries found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* State */}
                <div ref={stateRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>STATE / REGION</label>
                  <input
                    type="text"
                    value={stateQuery}
                    onChange={(e) => { setStateQuery(e.target.value); setStateOpen(true); }}
                    onFocus={() => { if (country) { setStateQuery(""); setStateOpen(true); } }}
                    disabled={!country}
                    placeholder={country ? "Search state…" : "Select country first"}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "transparent",
                      color: "var(--color-ink)",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      outline: "none",
                      opacity: country ? 1 : 0.5,
                    }}
                  />
                  {stateOpen && country && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                      {stateQuery === "" && (
                        <button
                          type="button"
                          onMouseDown={() => { setSelectedState(""); setStateQuery(""); setCity(""); setCityQuery(""); setStateOpen(false); }}
                          className="type-caption"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "12px 16px",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--color-hairline)",
                            color: "var(--color-muted)",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          ALL STATES
                        </button>
                      )}
                      {states
                        .filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase()))
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={() => {
                              setSelectedState(s); setStateQuery(s);
                              setCity(""); setCityQuery("");
                              setStateOpen(false);
                            }}
                            className="type-body-sm"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 16px",
                              background: "transparent",
                              border: "none",
                              color: s === selectedState ? "var(--color-ink)" : "var(--color-body)",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: s === selectedState ? 500 : 400,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      {states.filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase())).length === 0 && (
                        <p className="type-body-sm" style={{ padding: "12px 16px", color: "var(--color-muted)", margin: 0 }}>No states found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* City */}
                <div ref={cityRef} style={{ position: "relative" }}>
                  <label className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "8px", display: "block" }}>CITY</label>
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => { setCityQuery(e.target.value); setCityOpen(true); }}
                    onFocus={() => { if (selectedState) { setCityQuery(""); setCityOpen(true); } }}
                    disabled={!selectedState}
                    placeholder={selectedState ? "Search city…" : "Select state first"}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "transparent",
                      color: "var(--color-ink)",
                      border: "none",
                      borderBottom: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0",
                      padding: "12px 0",
                      height: "44px",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      outline: "none",
                      opacity: selectedState ? 1 : 0.5,
                    }}
                  />
                  {cityOpen && selectedState && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 30,
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-hairline-strong)",
                      borderRadius: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                      {cityQuery === "" && (
                        <button
                          type="button"
                          onMouseDown={() => { setCity(""); setCityQuery(""); setCityOpen(false); }}
                          className="type-caption"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "12px 16px",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--color-hairline)",
                            color: "var(--color-muted)",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          ALL CITIES
                        </button>
                      )}
                      {cities
                        .filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
                        .map((c) => (
                          <button
                            key={c}
                            type="button"
                            onMouseDown={() => { setCity(c); setCityQuery(c); setCityOpen(false); }}
                            className="type-body-sm"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 16px",
                              background: "transparent",
                              border: "none",
                              color: c === city ? "var(--color-ink)" : "var(--color-body)",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: c === city ? 500 : 400,
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      {cities.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase())).length === 0 && (
                        <p className="type-body-sm" style={{ padding: "12px 16px", color: "var(--color-muted)", margin: 0 }}>No cities found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Location preview + Search button */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "12px" }}>
                {locationString ? (
                  <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", margin: 0 }}>
                    SEARCHING IN: <span style={{ color: "var(--color-ink)" }}>{locationString.toUpperCase()}</span>
                  </p>
                ) : (
                  <div />
                )}
                <Button type="submit" variant="primary" loading={discovering}>
                  Search Jobs
                </Button>
              </div>
            </form>
          </Card>

          {discoverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {discoverError}
              {discoverError.includes("RAPIDAPI_KEY") && (
                <p className="mt-1 font-medium">
                  Add <code className="rounded bg-red-100 px-1">RAPIDAPI_KEY=your_key</code> to your{" "}
                  <code>.env.local</code> file.
                </p>
              )}
            </div>
          )}

          {/* Initial state: no search yet */}
          {!hasSearched && !discovering && !discoverError && (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
              <p className="text-2xl">🔍</p>
              <p className="mt-2 font-medium text-[var(--color-text)]">Search for jobs above</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Results are pulled live from Naukri, LinkedIn, Indeed, and more.
              </p>
            </div>
          )}

          {/* Empty state: search completed, no results after filters */}
          {hasSearched && filteredDiscoveredJobs.length === 0 && !discovering && !discoverError && (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
              <p className="text-2xl">📭</p>
              <p className="mt-2 font-medium text-[var(--color-text)]">No jobs found</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {discovering && (
            <div className="py-16 text-center text-[var(--color-text-muted)]">
              <img src="/logo.png" alt="logo" className="mx-auto mb-4 h-16 w-16 object-contain animate-bounce" />
              Fetching live jobs…
            </div>
          )}

          {/* Results count */}
          {filteredDiscoveredJobs.length > 0 && !discovering && (
            <p className="text-sm text-[var(--color-text-muted)]">
              Showing <span className="font-medium text-[var(--color-text)]">{filteredDiscoveredJobs.length}</span>
              {filteredDiscoveredJobs.length !== discoveredJobs.length && (
                <span> (filtered from {discoveredJobs.length})</span>
              )} jobs
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDiscoveredJobs.map((job) => (
              <Card key={job.id} padding="md" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
                      {job.title.toUpperCase()}
                    </h3>
                    <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>
                      {job.company}
                    </p>
                  </div>
                  <Badge variant="default" size="sm">
                    {job.source.toUpperCase()}
                  </Badge>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {job.type && (
                    <Badge variant="secondary" size="sm">
                      {job.type.toUpperCase()}
                    </Badge>
                  )}
                  {job.isRemote !== null && (
                    <Badge variant={job.isRemote ? "success" : "default"} size="sm">
                      {job.isRemote ? "REMOTE" : "ON-SITE"}
                    </Badge>
                  )}
                </div>

                <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", margin: 0 }}>
                  {job.location}
                </p>

                <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}>
                  <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>YEARS NEEDED: </span>
                  {extractExperience(job).toUpperCase()}
                </p>

                <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", margin: 0, lineClamp: 3, WebkitLineClamp: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                  {job.description}
                </p>

                <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--color-hairline)", paddingTop: "16px", marginTop: "auto" }}>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bugatti"
                    style={{ height: "36px", padding: "0 20px", fontSize: "11px", flex: 1, textAlign: "center" }}
                  >
                    VIEW JOB
                  </a>
                  <button
                    onClick={() => saveJob(job)}
                    disabled={savedIds.has(job.id) || savingId === job.id}
                    className="btn-bugatti"
                    style={{
                      height: "36px",
                      padding: "0 20px",
                      fontSize: "11px",
                      flex: 1,
                      textAlign: "center",
                      borderColor: savedIds.has(job.id) ? "var(--color-hairline)" : undefined,
                      color: savedIds.has(job.id) ? "var(--color-muted-soft)" : undefined,
                      cursor: savedIds.has(job.id) ? "default" : "pointer",
                    }}
                  >
                    {savingId === job.id ? "SAVING…" : savedIds.has(job.id) ? "SAVED" : "SAVE"}
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {discoveredJobs.length > 0 && hasMore && !discovering && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="btn-bugatti"
                style={{ height: "44px", padding: "0 32px" }}
              >
                {loadingMore ? "LOADING MORE…" : "LOAD MORE JOBS"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MY APPLICATIONS TAB ── */}
      {tab === "saved" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loadingSaved && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--color-muted)" }}>
              <p className="type-caption" style={{ margin: 0 }}>LOADING YOUR APPLICATIONS...</p>
            </div>
          )}

          {!loadingSaved && savedJobs.length === 0 && (
            <div style={{ border: "1px dashed var(--color-hairline-strong)", padding: "64px 24px", textAlign: "center" }}>
              <p className="type-display-sm" style={{ color: "var(--color-ink)", margin: 0 }}>NO SAVED JOBS YET</p>
              <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "8px", marginBottom: "24px" }}>
                Search for jobs and click "Save" to track them here.
              </p>
              <button
                onClick={() => setTab("discover")}
                className="type-caption"
                style={{ background: "transparent", border: "none", color: "var(--color-link)", cursor: "pointer" }}
              >
                GO TO DISCOVER →
              </button>
            </div>
          )}

          {savedJobs.map((job) => (
            <Card key={job.id} padding="md">
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                    <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>{job.title.toUpperCase()}</h3>
                    <Badge variant={statusVariant[job.status as JobStatus]} size="sm">
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>{job.company}</p>
                  {job.location && (
                    <p className="type-body-sm" style={{ color: "var(--color-muted-soft)", margin: "4px 0 0" }}>{job.location}</p>
                  )}
                  <p className="type-caption" style={{ color: "var(--color-muted-soft)", marginTop: "8px", margin: 0, fontSize: "10px" }}>
                    VIA {job.source.toUpperCase()} · UPDATED {new Date(job.updatedAt).toLocaleDateString().toUpperCase()}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                  {/* Status selector */}
                  <div style={{ position: "relative" }}>
                    <select
                      value={job.status}
                      disabled={updatingId === job.id}
                      onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}
                      style={{
                        display: "block",
                        appearance: "none",
                        width: "140px",
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
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}>
                          {s.label.toUpperCase()}
                        </option>
                      ))}
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
                  
                  <Link
                    href={`/job-hunting/tailor/${job.id}`}
                    className="btn-bugatti"
                    style={{ height: "36px", padding: "0 20px", fontSize: "11px", textDecoration: "none" }}
                  >
                    AI TAILOR
                  </Link>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bugatti"
                    style={{ height: "36px", padding: "0 20px", fontSize: "11px", textDecoration: "none" }}
                  >
                    VIEW JOB
                  </a>
                  <button
                    onClick={() => deleteJob(job.id)}
                    title="Remove"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      fontSize: "24px",
                      lineHeight: "1",
                      padding: "0 8px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
