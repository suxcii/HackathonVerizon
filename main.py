from fastapi import FastAPI
from pydantic import BaseModel
import json
import requests

app = FastAPI()

# ── Models ──────────────────────────────────────────────
class BillRequest(BaseModel):
    bill: dict
    customer_query: str = ""

class BillResponse(BaseModel):
    summary: list[str]          # 3-bullet plain English
    intent: str                 # Billing | Technical Support | Account Management
    warm_transfer: bool         # Should we escalate to human?
    escalation_reason: str = ""

# ── Ollama helper ────────────────────────────────────────
def call_slm(prompt: str) -> str:
    """Call local Mistral via Ollama"""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        }
    )
    return response.json()["response"]

# ── Bill Summary ─────────────────────────────────────────
def summarize_bill(bill: dict) -> list[str]:
    prompt = f"""
You are a Verizon billing assistant. Given this bill data, write EXACTLY 3 bullet points
in plain English that a non-technical customer can understand.
Each bullet should start with a dash (-).
Do not use jargon. Be specific with dollar amounts.

Bill data:
{json.dumps(bill, indent=2)}

3 bullet summary:
"""
    raw = call_slm(prompt)
    bullets = [line.strip("- ").strip() for line in raw.strip().split("\n") if line.strip().startswith("-")]
    return bullets[:3] if len(bullets) >= 3 else bullets

# ── Intent Detection ─────────────────────────────────────
def detect_intent(query: str) -> tuple[str, bool]:
    if not query:
        return "Billing", False

    prompt = f"""
Classify this customer query into EXACTLY ONE of these categories:
- Billing
- Technical Support  
- Account Management

Query: "{query}"

Rules:
- Billing = questions about charges, payments, fees, overage
- Technical Support = device issues, network, connectivity
- Account Management = plan changes, upgrades, cancellations, personal info

Respond with ONLY the category name, nothing else.
"""
    intent = call_slm(prompt).strip()

    # Normalize
    for valid in ["Billing", "Technical Support", "Account Management"]:
        if valid.lower() in intent.lower():
            return valid, False

    # Couldn't classify → warm transfer
    return "Unknown", True

# ── Main Endpoint ─────────────────────────────────────────
@app.post("/analyze", response_model=BillResponse)
async def analyze_bill(req: BillRequest):
    summary = summarize_bill(req.bill)
    intent, escalate = detect_intent(req.customer_query)

    # Warm transfer logic
    warm_transfer = escalate or len(summary) < 2
    reason = ""
    if escalate:
        reason = "Could not confidently classify customer intent — routing to human agent."
    elif len(summary) < 2:
        reason = "Bill summary incomplete — human review recommended."

    return BillResponse(
        summary=summary,
        intent=intent,
        warm_transfer=warm_transfer,
        escalation_reason=reason
    )

@app.get("/health")
async def health():
    return {"status": "ok", "model": "mistral via ollama"}

@app.get("/mock-bill")
async def get_mock_bill():
    with open("data/mock_bill.json") as f:
        return json.load(f)