# Smart Wound-Care Concierge

**AI-driven wound monitoring with automated analysis, clinical summaries, and PDF reporting**

Smart Wound-Care Concierge is an agentic AI assistant that analyzes wound images, tracks healing trends, classifies risk, and generates clinician-ready reports.  
Built for **MumbaiHacks '25**.

---

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun** - [Install bun](https://bun.sh/)

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/SilverTech21/smart-wound-watch.git

# 2. Navigate to the project directory
cd smart-wound-watch

# 3. Install dependencies
npm install
# OR if using bun:
bun install

# 4. Start the development server
npm run dev
# OR if using bun:
bun run dev

# 5. Open your browser and visit:
# http://localhost:8080
```

The app will be running at `http://localhost:8080`

---

## Key Features

### 1. Wound Image Analysis (Perception Layer)
Client-side image processing extracts:
- Wound area (px & %)
- Redness score
- Exudate ratio
- Brightness & blur (quality control)

### 2. Risk Classification (Decision Layer)
Rule-based status classification:
- **Stable** - Wound healing normally
- **Monitor** - Requires observation
- **Concerning** - Needs attention
- **Urgent** - Immediate clinical review needed

### 3. Professional PDF Reports
Downloadable PDF reports containing:
- Wound image
- Metrics table
- Status explanation
- AI-generated summary & instructions
- Timestamp + patient context

### 4. Healing Timeline & Records
All analysis events are stored locally:
- Stored wound metrics
- Previous deltas
- Clinician notes
- Timeline visualization with charts

### 5. Clinician Dashboard
- View all patient records
- Filter urgent/concerning cases
- Download patient reports

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Navigation header
│   ├── ImageUploader.tsx
│   ├── StatusBadge.tsx
│   ├── MetricsCard.tsx
│   ├── EscalationAlert.tsx
│   ├── WoundTimeline.tsx
│   └── TrendCharts.tsx
│
├── pages/              # Application pages
│   ├── Index.tsx       # Landing page
│   ├── Upload.tsx      # Wound upload page
│   ├── Result.tsx      # Analysis results
│   ├── Timeline.tsx    # Patient timeline
│   └── Clinician.tsx   # Clinician dashboard
│
├── lib/                # Core business logic
│   ├── woundAnalysis.ts  # Image perception + decision logic
│   ├── storage.ts        # LocalStorage database
│   ├── pdfGenerator.ts   # PDF report generation
│   └── utils.ts
│
├── hooks/              # Custom React hooks
│   └── useWoundAnalysis.ts  # Analysis orchestration
│
├── types/              # TypeScript definitions
│   └── wound.ts
│
├── App.tsx             # Main application router
├── main.tsx            # Entry point
└── index.css           # Design system & styles
```

---

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Build Tool**: Vite
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Storage**: Browser LocalStorage

---

## How It Works

1. **Upload** - Patient uploads wound image with notes (pain level, symptoms, comorbidities)
2. **Analyze** - Client-side algorithms extract redness, area, exudate, and quality metrics
3. **Classify** - Rule-based engine determines status: Stable/Monitor/Concerning/Urgent
4. **Report** - Generate AI summaries and downloadable PDF reports
5. **Track** - View healing progress over time with trend charts
6. **Escalate** - Automatic alerts for urgent cases

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Demo Workflow

1. Visit the landing page
2. Click "Upload Wound Image"
3. Upload any image and fill patient context
4. View analysis results with metrics
5. Generate PDF report
6. Check timeline for historical data
7. Visit clinician dashboard to see all patients

---

## Disclaimer

This application is for **demonstration purposes only** and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for wound care.

---

## License

MIT License - Feel free to use and modify for your projects.

---

## Team

Built with ❤️ for MumbaiHacks '25
