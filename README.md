# Smart Wound-Care Concierge  
**AI-driven wound monitoring with automated analysis, clinical summaries, and PDF reporting**

Smart Wound-Care Concierge is an agentic AI assistant that analyzes wound images, tracks healing trends, classifies risk, and generates clinician-ready reports.  
Built for **MumbaiHacks ’25**.

---

## Key Features

### 1. Wound Image Analysis (Perception Layer)
Using `perception.py`, the system extracts:
- Wound area (px & %)
- Redness score
- Exudate ratio
- Brightness & blur (quality control)
- Optional wound mask

### 2. Risk Classification (Decision Layer)
`decision.py` assigns wound status using rule-based logic + trends:
- **Stable**
- **Monitor**
- **Concerning**
- **Urgent**

### 3. Professional PDF Reports (Action Layer)
`action.py` generates downloadable PDF reports using **ReportLab**, containing:
- Wound image  
- Metrics table  
- Status explanation  
- LLM-generated summary & instructions  
- Timestamp + patient context  

###  4. Healing Timeline & Records
All analysis events are logged in SQLite:
- Stored wound metrics  
- Previous deltas  
- Clinician notes  
- Timeline visualization in the UI  

---

## Project Architecture
root/
│
├── app.py # Streamlit UI + workflow orchestration
├── perception.py # Image processing and wound feature extraction
├── decision.py # Status classification + optional LLM reasoning
├── action.py # Save images, DB logging, PDF generation
│
├── data/
│ ├── uploads/ # Saved wound photos
│ └── wound_records.db # SQLite database
│
└── README.md



