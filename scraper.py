import requests
from bs4 import BeautifulSoup
import json
import time

def scrape_nse_data():
    """Scrape NSE data for NIFTY 50 stocks"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        
        # NSE API endpoint for NIFTY 50 data
        url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050"
        
        session = requests.Session()
        session.headers.update(headers)
        
        # First request to get cookies
        session.get("https://www.nseindia.com")
        
        # Get NIFTY 50 data
        response = session.get(url)
        
        if response.status_code == 200:
            data = response.json()
            stocks = []
            
            for stock in data.get('data', []):
                stocks.append({
                    'symbol': stock.get('symbol'),
                    'close': float(stock.get('lastPrice', 0)),
                    'open': float(stock.get('open', 0)),
                    'high': float(stock.get('dayHigh', 0)),
                    'low': float(stock.get('dayLow', 0)),
                    'volume': int(stock.get('totalTradedVolume', 0)),
                    'change': float(stock.get('change', 0)),
                    'changePercent': float(stock.get('pChange', 0))
                })
            
            return stocks
        else:
            return []
            
    except Exception as e:
        print(f"Error scraping NSE data: {e}")
        return []

if __name__ == "__main__":
    data = scrape_nse_data()
    print(json.dumps(data, indent=2))