# issue-analyser

CLI that fetches GitHub issues and produces an LLM-powered digest so contributors can understand a project's issue landscape without scrolling through hundreds of threads.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated
- OpenAI API key

```bash
gh auth login
cp .env.example .env   # then set OPENAI_API_KEY in .env
```

## Install

```bash
npm install
npm run build
```

## Usage

```bash
# Analyze open issues (default limit: 50)
npm run dev -- analyze vercel/next.js

# Limit issues and filter by label
npm run dev -- analyze vercel/next.js --limit 10 --label "good first issue"

# Save markdown digest to file
npm run dev -- analyze vercel/next.js --limit 20 --out digest.md

# JSON output for dashboard
npm run dev -- analyze vercel/next.js --limit 10 --format json --out digest.json
```

## Web dashboard

A [RetroUI](https://retroui.dev)-styled dashboard with GitHub-like colors visualizes digest JSON.

```bash
# From repo root
npm run web:dev

# Open http://localhost:3000
# Upload digest.json or click "View sample digest"
```

Generate JSON from the CLI, then upload it in the dashboard:

```bash
npm run dev -- analyze genesis-kb/transcription_engine --limit 10 --format json --out digest.json
npm run web:dev
```

After building, use the binary directly:

```bash
npx issue-analyser analyze owner/repo
```

## Output

The digest has four levels:

1. **Snapshot** — quick health overview and stats
2. **Themes** — semantic clusters (e.g. auth bugs, docs gaps)
3. **Start here** — top 5 issues ranked for new contributors
4. **Catalog** — every issue as a card, grouped by workType × difficulty

Each issue card includes a plain-English summary, normalized taxonomy, original GitHub labels, and a link back to the issue.

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--state` | `open`, `closed`, or `all` | `open` |
| `--limit` | Max issues to fetch | `50` |
| `--label` | Filter by GitHub label | — |
| `--since` | Only issues updated since (e.g. `90d`, ISO date) | — |
| `--format` | `markdown` or `json` | `markdown` |
| `--out` | Write to file instead of stdout only | — |
| `--model` | OpenAI model | `gpt-4o-mini` |
| `--token` | GitHub token override | `gh` auth / `GITHUB_TOKEN` |
| `--api-key` | OpenAI key override | `OPENAI_API_KEY` |

## Development

```bash
npm test
npm run build
```
