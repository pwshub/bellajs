# AI Assistant Configuration

## Purpose
This directory contains configuration and guidelines for AI assistants working on this project.

## Structure

```
.ai/
├── README.md # This file
├── CODING_STANDARDS.md # Coding rules (JSDocs, style, etc.)
├── SECURITY_POLICY.md # Security & privacy
├── AGENT_SKILLS.md # External skills references
├── CONTEXT.md # Template for Session context
├── PROGRESS.md # Template for Progress tracking
└── sessions/ # Session logs (runtime data, ignored by Git)
   └── CONTEXT.md # last session context
   └── PROGRESS.md # current progress tracking
```

## Usage
1. At begining of each session
  - Read `sessions/CONTEXT.md` if present
  - Read `sessions/PROGRESS.md` if present
2. Read `CODING_STANDARDS.md` for best practices
3. Read `AGENT_SKILLS.md` for advanced knowledge
4. Read `SECURITY_POLICY.md` for security & privacy
5. At end of each session
  - Update `sessions/CONTEXT.md` (template: `CONTEXT.md`)
  - Update `sessions/PROGRESS.md` (template: `PROGRESS.md`)
