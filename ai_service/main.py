from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# --- THIS IS THE FIX ---
# Import the CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- THIS IS THE FIX ---
# Define the list of allowed origins (your Node.js server's URL)
# The "*" allows all origins, which is acceptable for this project.
# For higher security, you would replace "*" with your actual Node.js Render URL.
origins = [
    "*",
]

# Add the CORS middleware to your application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)


class RiskProfileRequest(BaseModel):
    answers: List[int]

class RecommendationRequest(BaseModel):
    risk_profile: str

@app.get("/")
def read_root():
    return {"message": "Mudra-Plan AI Service is running."}

@app.post("/api/risk-profile")
def get_risk_profile(request: RiskProfileRequest):
    score = sum(request.answers)
    profile = "Conservative"
    if 10 <= score <= 15:
        profile = "Moderate"
    elif score > 15:
        profile = "Aggressive"
    return {"risk_profile": profile, "score": score}

@app.post("/api/recommendations")
def get_recommendations(request: RecommendationRequest):
    profile = request.risk_profile
    if profile == "Conservative":
        recommendations = {
            "description": "Focus on capital preservation and low-risk, stable returns.",
            "portfolio": [
                {"instrument": "Fixed Deposits (FDs) / Debt Funds", "allocation": "60%", "details": "Low-risk, guaranteed returns. Provides stability."},
                {"instrument": "Large-Cap Equity Mutual Funds", "allocation": "30%", "details": "Investments in stable, well-established companies."},
                {"instrument": "Gold / Sovereign Gold Bonds", "allocation": "10%", "details": "A hedge against inflation and market volatility."}
            ]
        }
    elif profile == "Moderate":
        recommendations = {
            "description": "A balanced approach aiming for steady growth with manageable risk.",
            "portfolio": [
                {"instrument": "Diversified Equity Mutual Funds (Large & Mid-Cap)", "allocation": "50%", "details": "A mix of stability and growth potential."},
                {"instrument": "Debt Funds / Corporate Bonds", "allocation": "40%", "details": "Provides regular income and lowers portfolio risk."},
                {"instrument": "International Equity ETF", "allocation": "10%", "details": "Diversification across global markets."}
            ]
        }
    else: # Aggressive
        recommendations = {
            "description": "Aiming for high long-term growth by taking on higher market risk.",
            "portfolio": [
                {"instrument": "Mid & Small-Cap Equity Mutual Funds", "allocation": "60%", "details": "High growth potential, but also higher volatility."},
                {"instrument": "Large-Cap Stocks / Index Funds", "allocation": "20%", "details": "Core holdings in established market leaders."},
                {"instrument": "International / Sectoral Funds (e.g., Tech)", "allocation": "20%", "details": "Targeted investments in high-growth areas."}
            ]
        }
    return recommendations
