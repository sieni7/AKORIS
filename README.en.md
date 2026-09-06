# AKORIS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm version](https://img.shields.io/npm/v/akoris.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)
![Status](https://img.shields.io/badge/status-specification-orange.svg)

> **Blue current status: Specification only**
>
> AKORIS is currently a repository of **method, governance and reference schemas**. It does not yet provide an installable CLI, an execution engine, a dashboard, an API or a complete `.akoris/` instance.
>
> Commands and components announced as "planned" belong to the ecosystem roadmap.
>
> **Architecture status:** Proposed / Architecture Draft. The Core Engine implementation and related tooling are being specified; they must not be considered available until they are present in the repository and covered by tests.
>
> **Repository:** [MIT License](LICENSE) · [Security policy](SECURITY.md) · [Contributing](CONTRIBUTING.md) · [Method overview](AKORIS.md)

> **Build software with method, not with chance.**

## 📌 Versioning

| Artefact | Version | Status |
|---|---|---|
| **AKORIS Method** (Constitution, Governance) | v1.0.1 | ✅ Frozen |
| **Registry** (schemas, agents, profiles) | v1.0.1 | ✅ Frozen |
| **Core Engine** (`@akoris/core`) | v0.1.0 (Seed) | 🔄 In development |
| **CLI** (`@akoris/cli`) | v0.1.0 (planned) | ⏳ Planned |
| **Dashboard** | v0.1.0 (planned) | ⏳ Planned |

---

## 1. What is AKORIS?

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) is a **governance method** for AI-assisted software development.

**Normative definition** (source: `constitution/00_AKORIS.md` §1):

> *A governance standard for AI-assisted software development.*

AKORIS is not a tool, a framework, an AI model, an IDE or an execution engine. It sits **above** these components and defines the framework in which they operate.

**Positioning** (source: `constitution/03_TERMINOLOGY.md` §1):

| Concept | Definition |
|---|---|
| **AKORIS** | Governance method |
| **AKORIS Ecosystem** | Tools, specifications, implementations |
| **AKORIS Instance** | Application of the method to a project |
| **`.akoris/`** | Materialization of the instance in the filesystem |

---

## 2. The problem solved

AI-assisted development brings considerable speed, but this speed can cause (source: `constitution/00_AKORIS.md` §2):

- Decisions made without context
- Inconsistent architecture
- Agents acting outside their role
- Code duplication
- Invisible technical debt
- Documentation that no longer tracks the software
- Invented or unverified information
- Lack of traceability
- Dependency on a specific AI engine

**AKORIS addresses these problems by structuring AI-assisted development.**

---

## 3. The AKORIS solution

AKORIS structures development around three mechanisms (source: `constitution/00_AKORIS.md` §3):

| Mechanism | Role |
|---|---|
| **Contracts** | Each agent (human or AI) has a defined mission, responsibilities, limits and deliverables. |
| **Rules** | Formal policies and Quality Gates control each stage of the lifecycle. |
| **State machine** | The project follows a rigorous lifecycle: Proposition → Draft → Planned → Active → Audit → Validated → Released → Archived. |

**Foundational principle** (source: `constitution/02_GOVERNANCE.md` §4.1.1):

> *The AI produces. The controls verify. The human decides.*

---

## 4. The promise

**"Build software with method, not with chance."**

Three fundamental benefits (source: `constitution/00_AKORIS.md` §4):

- **Reproducibility**: the same process produces the same result.
- **Auditability**: every action is traceable and justified.
- **Capitalization**: knowledge is preserved and shared.

---

## 5. The 4 pillars

| Pillar | Principle (source: `constitution/00_AKORIS.md` §5) |
|---|---|
| **Governance First** | Governance is the first artefact to define. |
| **Documentation First** | Documentation precedes and accompanies any implementation. |
| **Audit First** | Auditability is designed from the start of any process. |
| **Architecture Before Code** | Architecture is defined before any line of code. |

---

## 6. Normative hierarchy

AKORIS relies on a clear hierarchy (source: `README.md` §B10):

```
CONSTITUTION (01_CONSTITUTION.md)
    ↓
GOVERNANCE (02_GOVERNANCE.md)
    ↓
TERMINOLOGY (03_TERMINOLOGY.md)
    ↓
REGISTRY (registry/)
    ↓
POLICIES (registry/policies/)
    ↓
CONTRACTS (registry/contracts/)
    ↓
IMPLEMENTATION (ecosystem)
```

---

## 7. Repository structure

```
AKORIS/
├── AKORIS.md                # Method overview
├── README.md                # Repository overview
├── LICENSE                  # MIT License
├── SECURITY.md              # Security policy
├── CONTRIBUTING.md          # Contribution guide
├── CHANGELOG.md             # Version history
├── .gitignore               # Ignore rules
├── constitution/            # Constitutional documents
│   ├── 00_AKORIS.md         # Constitutional manifesto
│   ├── 01_CONSTITUTION.md   # Mission, vision, 10 principles
│   ├── 02_GOVERNANCE.md     # Rules, roles, lifecycle
│   ├── 03_TERMINOLOGY.md    # Normative glossary
│   └── 04_LICENSING.md      # MIT license and contribution
├── registry/                # Governance repository
│   ├── state-machine.json   # State machine (11 states)
│   ├── policies/            # Governance policies
│   ├── profiles/            # Lite/Standard/Critical profiles
│   ├── schemas/             # JSON validation schemas
│   └── contracts/           # Agent contracts (coming soon)
├── docs/                    # User documentation
│   └── guides/
│       └── 00_GETTING_STARTED.md
├── packages/                # Source code (future)
│   └── core/                # Core Engine (being specified)
└── .akoris/                 # Reference instance (coming soon)
```

**Boundary rule** (source: `constitution/00_AKORIS.md` §8.1):

> Governance information belongs to `.akoris/`. Software-explaining information belongs to `docs/`.

---

## 8. Installation (planned)

The AKORIS CLI is under development. The installation command will be:

```bash
npm install -g akoris
```

> ⚠️ **This command is not yet available.** The repository is currently a method specification.

---

## 9. First project

```bash
akoris init mon-projet
cd mon-projet
akoris status
```

> **⚠️ These commands are planned for the future ecosystem.** They are not yet executable in this repository.

---

## 10. Documentation

| Document | Content |
|---|---|
| [AKORIS.md](AKORIS.md) | General method overview |
| [00_AKORIS.md](constitution/00_AKORIS.md) | Constitutional manifesto |
| [01_CONSTITUTION.md](constitution/01_CONSTITUTION.md) | Mission, vision, 10 principles, amendments |
| [02_GOVERNANCE.md](constitution/02_GOVERNANCE.md) | Rules, roles, lifecycle, Quality Gates |
| [03_TERMINOLOGY.md](constitution/03_TERMINOLOGY.md) | Normative glossary (60+ entries) |
| [04_LICENSING.md](constitution/04_LICENSING.md) | MIT license and contribution terms |
| [00_GETTING_STARTED.md](docs/guides/00_GETTING_STARTED.md) | Complete getting started guide |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide |
| [SECURITY.md](SECURITY.md) | Security policy |
| [Core Engine Specification](docs/specifications/CORE-ENGINE-SPECIFICATION.md) | Core Engine Architecture Draft |

---

## 11. Proportional governance

AKORIS adapts its governance depth to the project risk level (source: `registry/profiles/`):

| Profile | Use | Evidence | Quality Gates | Audit | Decision Gate |
|---|---|---|---|---|---|
| **Lite** | Prototype / Solo | E1 | Essentials | Deferred | Optional |
| **Standard** | Professional project | E1 + E2 | Full cycle | Scheduled | Mandatory |
| **Critical** | Sensitive / Finance / Security | E1 + E2 + E3 | Full cycle + reinforced | Mandatory + external | Mandatory + multiple |

---

## 12. Planned ecosystem (future)

The following commands are documented as **milestones** of the AKORIS ecosystem (source: `constitution/02_GOVERNANCE.md` §11):

| Command | Function |
|---|---|
| `akoris doctor` | Check the integrity of the instance |
| `akoris registry validate` | Validate Registry consistency |
| `akoris state transition` | Run a state transition according to `state-machine.json` |

---

## 13. License

AKORIS is distributed under the **MIT** license exclusively (source: `constitution/04_LICENSING.md` §1.1).

```text
Copyright (c) 2026 OULAÏ SIÉNI (sieni7@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

> **"Build software with method, not with chance."**

---

*AKORIS v1.0.1 — 2026-09-05*