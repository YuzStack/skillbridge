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
