# SkillBridge: An AI-Driven Adaptive Career Readiness & Predictive Roadmap Platform

## 🎓 Academic Project Overview

- **Project Title:** SkillBridge: An Adaptive Talent Triage and Predictive Career Roadmap Engine Utilizing Large Language Models (LLMs) and Persistent Distributed State Management
- **Academic Domain:** Applied Artificial Intelligence, Cloud Data Architecture, Human-Computer Interaction (HCI)
- **Author:** Simbiat Lawal – Final-Year Computer Science Candidate, Unilorin.

---

## 1. Abstract & System Statement

Traditional Applicant Tracking Systems (ATS) and talent portals rely on static keywords and rigid, non-adaptive testing taxonomies. This architectural limitation creates information asymmetry, leaving graduating students misaligned with the dynamic competencies required by local and global industries.

**SkillBridge** resolves this paradigm by introducing an automated talent triage engine that leverages Client-Side Document Object Model (DOM) parsing and contextual Generative AI orchestration. The application ingests unstructured data via an un-bundled asynchronous stream parser (`PDF.js`), normalizes academic and professional vectors, maps individual skill clusters, and executes adaptive multiple-choice assessments (MCQs).

Using a custom mathematical volume matrix based on array cardinality ($|S|$), the platform dynamically scopes evaluation depth, computes cross-entropy match tolerances, creates localized multi-month learning timelines, and mirrors distributed mutations across a cloud data infrastructure.

---

## 2. Theoretical Architecture & Mathematical Formulations

The core execution loop of SkillBridge relies on translating discrete user skills or unstructured textual data into deterministic parameters for large language model evaluation.

### 2.1. Adaptive Question Volume Scoping

Let $S$ represent the set of distinct technical competencies selected by the student during the Interactive Skill Triage phase ($S = \{s_1, s_2, \dots, s_n\}$). The total number of evaluation questions generated, denoted as $Q_{\text{total}}$, is determined by an inverse scale function designed to prevent user fatigue while maintaining statistical testing rigor:

$$Q_{\text{total}} = |S| \times f(|S|)$$

Where the question multiplier function $f(|S|)$ is defined as:

$$
f(|S|) = \begin{cases}
5 & \text{if } |S| \le 2 \\
3 & \text{if } |S| \ge 3
\end{cases}
$$

This mathematical constraint ensures that localized topic deep-dives are executed on narrow matrices (e.g., 2 skills yield 10 targeted criteria questions) while wider arrays remain highly balanced (e.g., 5 skills limit the evaluation path to 15 questions total).

### 2.2. Scoring Accuracy & Suitability Mapping

The verified matching accuracy score ($A$) is calculated as the ratio of correct selections against the absolute size of the dynamic question array:

$$A = \left( \frac{\sum_{i=1}^{Q_{\text{total}}} X_i}{Q_{\text{total}}} \right) \times 100$$

Where $X_i \in \{0, 1\}$ represents the objective correctness of the user selection for question $i$. This calculated percentage acts as a critical metadata input variable for the secondary career recommendation pipe.

---

## 3. Technology Stack & Technical Justification

The system architecture is engineered with a strict decoupling of the UI layer, state caching management, and persistent distributed backend engines.

### 3.1. Core Frontend Framework & Bundling Engine

- **React 19.2 (Vite SPA Engine):** Chosen for its concurrent rendering capabilities, lightweight asset compilation overhead, and lightning-fast local hot-module replacement (HMR).
- **Tailwind CSS v4.1 & Prettier-Plugin-TailwindCSS:** Provides a performant utility-first styling pipeline compiling completely through the PostCSS layer via Vite, ensuring optimized bento-grid presentation spaces.
- **Motion (formerly Framer Motion) 12.3:** Powers fluid, non-blocking asynchronous state changes, handling route transition masks and responsive navigation frameworks.

### 3.2. Asynchronous State Caching & Form Management

- **TanStack React Query v5.100:** Eliminates redundant network transactions by enforcing strict declarative query state caches (`staleTime`, `invalidateQueries`), serving as the single source of truth between local browser state and the cloud architecture.
- **React Hook Form v7.76:** Implements uncontrolled form tracking through reference pointers (`refs`), eliminating unnecessary component re-renders during input loops and validating confirm-password strings securely on-demand using `getValues()`.

### 3.3. Downstream AI & Infrastructure Layer

- **Google Gen AI SDK (`@google/genai` v2.3):** Establishes structured connectivity to the advanced `gemini-3.5-flash` model, forcing raw JSON string schemas via explicit instructional prompts to ensure seamless serialization into user interfaces.
- **Supabase Client (`@supabase/supabase-js` v2.105):** Orchestrates relational data syncs across storage buckets (`avatars`), user account lifecycle mutations (`auth`), and structured entries over low-latency WebSockets.

---

## 4. Architectural Implementation & Deep Dive

### 4.1. Un-Bundled Local Document Parsing Pipeline

To avoid expensive backend processing of large resume files, SkillBridge performs text extraction directly inside the browser thread using a dynamic entry technique with **PDF.js**:

```javascript
const pdfjs =
  await import('[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs)');
pdfjs.GlobalWorkerOptions.workerSrc =
  '[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs)';

const arrayBuffer = await file.arrayBuffer();
const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
const pdf = await loadingTask.promise;
```

This maps binary data arrays securely, iterates page-by-page to collect raw text fragments, and transfers the compiled output text directly to the Gemini ATS engine.

### 4.2. Database Schema Blueprint

The application relies on three core relational tables designed with strict structural dependencies (ON DELETE CASCADE) to support absolute account wipes:

```sql
-- 1. Profiles Sync Table (Triggered automatically upon Auth signup)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    university TEXT DEFAULT 'Kwara State University',
    avatar_url TEXT,
    updated_at TIMESTAMPTZ
);

-- 2. Assessments Performance Storage Table
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    tested_discipline TEXT NOT NULL,
    selected_skills TEXT[] NOT NULL,
    verified_match_score INT NOT NULL,
    generated_recommendations JSONB,
    raw_performance_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Adaptive Roadmap Tracking Table
CREATE TABLE public.roadmaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    assessment_id UUID REFERENCES public.assessments ON DELETE CASCADE NOT NULL,
    target_career_title TEXT NOT NULL,
    suitability_percentage INT NOT NULL,
    verified_strengths TEXT[] NOT NULL,
    identified_gaps TEXT[] NOT NULL,
    timeline_milestones_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.3. Real-Time Distributed Mutation State Sync

When a student toggles a monthly learning goal checkbox, the application updates the local state array immediately to ensure a highly responsive user experience. It then pushes the updated payload asynchronously to the cloud database using a TanStack Query mutation:

```javascript
export function useUpdateRoadmapProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roadmapId, updatedMilestones }) => {
      const { data, error } = await supabase
        .from('roadmaps')
        .update({ timeline_milestones_json: updatedMilestones })
        .eq('id', roadmapId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['activeRoadmap', data.user_id, data.target_career_title],
      });
    },
  });
}
```

## 5. Security Protocols & Operational Guard Gates

1. **Client-Side Navigation Controls**: Private workspace dashboards are wrapped within a protective `<ProtectedRoute />` wrapper that checks user authorization via Supabase before rendering child nodes. If unauthorized, users are instantly redirected back to the public `/login` portal.

2. **Destructive Reset Workflows (GDPR/Compliance Alignment)**: When an account is flagged for deletion on the settings dashboard, an RPC database trigger (`delete_user_self`) clears the internal authentication row, cascading to wipe out all metadata, test logs, images, and roadmaps instantly across the cloud.

3. **Cross-Origin Isolation**: All API transaction tokens, credentials, and cryptographic connection hooks are bound entirely to `VITE\_` injection scopes, preventing runtime variables from bleeding into public scripts.

## 6. Installation & Local Environment Replication

Ensure your machine has Node.js (>= 20.0.0) and npm configured locally before continuing.

### 1. Clone & Core Dependency Provisioning

```
git clone git@github.com:YuzStack/skillbridge.git
cd skillbridge
npm install
```

### 2. Configure Environment Configurations
Create a .env file in the root project directory:

```
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Execute Local Development Server

```
npm run dev
```

## 7. Production Compilation & Vercel Edge Deployment

### 1. Production Compilation Layer

To verify code accuracy and generate highly optimized static assets, run the build compiler:

```
npm run build
```

This bundles your modules, processes Tailwind utility styles, and exports your production assets directly into the /dist output folder.

### 2. Vercel Cloud Server Routing Rules

To prevent broken page URLs (`404 Errors`) during page refreshes on single-page applications, the application includes a `vercel.json` rewrite configuration that securely routes edge transactions back through the root document element:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Deploy the project by importing your repository into Vercel and linking your three configuration environment variables (VITE_GEMINI_API_KEY, VITE_SUPABASE_URL, and VITE_SUPABASE_PUBLISHABLE_KEY) to launch the live application.
