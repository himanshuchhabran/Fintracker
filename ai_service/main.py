
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

class RiskProfile(BaseModel):
    risk_profile: str

# Define some sample investment recommendations for the Indian context
RECOMMENDATIONS: Dict[str, Dict[str, List[Dict[str, str]]]] = {
    "Conservative": {
        "description": "Focuses on capital preservation with minimal risk.",
        "portfolio": [
            {"instrument": "Fixed Deposit (FD)", "allocation": "50%", "details": "Safe, guaranteed returns from a bank."},
            {"instrument": "Public Provident Fund (PPF)", "allocation": "30%", "details": "Government-backed long-term savings scheme."},
            {"instrument": "Debt Mutual Funds (Liquid Funds)", "allocation": "20%", "details": "Low-risk funds investing in short-term government securities."}
        ]
    },
    "Moderate": {
        "description": "A balanced approach aiming for steady growth with manageable risk.",
        "portfolio": [
            {"instrument": "NIFTY 50 Index Fund", "allocation": "40%", "details": "Diversified investment in India's top 50 companies."},
            {"instrument": "Hybrid Mutual Funds", "allocation": "30%", "details": "A mix of stocks and bonds for balanced growth."},
            {"instrument": "Gold ETFs / Sovereign Gold Bonds", "allocation": "15%", "details": "Hedge against inflation and market volatility."},
            {"instrument": "Fixed Deposit (FD)", "allocation": "15%", "details": "Provides stability to the portfolio."}
        ]
    },
    "Aggressive": {
        "description": "Aims for high long-term growth by taking on higher market risk.",
        "portfolio": [
            {"instrument": "Equity Mutual Funds (Mid & Small Cap)", "allocation": "60%", "details": "High growth potential from smaller, dynamic companies."},
            {"instrument": "NIFTY 50 Index Fund", "allocation": "25%", "details": "Core of the portfolio with exposure to large-cap stocks."},
            {"instrument": "International Stocks (e.g., via NASDAQ 100 ETF)", "allocation": "15%", "details": "Diversification across global markets."}
        ]
    }
}

@app.post("/api/recommendations")
async def get_recommendations(data: RiskProfile):
    """
    Returns a predefined investment portfolio based on the user's risk profile.
    """
    profile = data.risk_profile
    if profile not in RECOMMENDATIONS:
        raise HTTPException(status_code=400, detail="Invalid risk profile provided.")
    
    return RECOMMENDATIONS[profile]

@app.get("/")
def read_root():
    return {"message": "Mudra-Plan AI Service is running."}