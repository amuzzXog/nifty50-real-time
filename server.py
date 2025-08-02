from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import os
import random
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__, static_folder='.')
CORS(app)

NIFTY50_SYMBOLS = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'KOTAKBANK', 'SBIN', 'BHARTIARTL',
    'ITC', 'LT', 'ASIANPAINT', 'AXISBANK', 'MARUTI', 'SUNPHARMA', 'ULTRACEMCO', 'NTPC',
    'NESTLEIND', 'BAJFINANCE', 'ONGC', 'POWERGRID', 'M&M', 'WIPRO', 'JSWSTEEL', 'TATAMOTORS',
    'HCLTECH', 'INDUSINDBK', 'ADANIENTS', 'COALINDIA', 'HINDALCO', 'SBILIFE', 'EICHERMOT',
    'TECHM', 'APOLLOHOSP', 'DIVISLAB', 'HDFCLIFE', 'DRREDDY', 'BRITANNIA', 'BAJAJFINSV',
    'GRASIM', 'CIPLA', 'BPCL', 'TATACONSUM', 'IOC', 'TATASTEEL', 'ADANIPORTS', 'LTIM',
    'TITAN', 'HEROMOTOCO', 'UPL', 'BAJAJ-AUTO'
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/stocks')
def get_stocks():
    try:
        # Import scraper function
        from scraper import scrape_nse_data
        
        # Try to get real NSE data first
        stocks = scrape_nse_data()
        
        # If scraping fails, use mock data
        if not stocks:
            stocks = []
            base_prices = {
                'RELIANCE': 2500, 'TCS': 3200, 'HDFCBANK': 1600, 'INFY': 1400, 'ICICIBANK': 900,
                'KOTAKBANK': 1800, 'SBIN': 550, 'BHARTIARTL': 800, 'ITC': 450, 'LT': 2200,
                'ASIANPAINT': 3100, 'AXISBANK': 1000, 'MARUTI': 9500, 'SUNPHARMA': 1100, 'ULTRACEMCO': 8000,
                'NTPC': 200, 'NESTLEIND': 22000, 'BAJFINANCE': 6500, 'ONGC': 180, 'POWERGRID': 220,
                'M&M': 1400, 'WIPRO': 400, 'JSWSTEEL': 700, 'TATAMOTORS': 450, 'HCLTECH': 1200,
                'INDUSINDBK': 1300, 'ADANIENTS': 2200, 'COALINDIA': 200, 'HINDALCO': 400, 'SBILIFE': 1400,
                'EICHERMOT': 3200, 'TECHM': 1100, 'APOLLOHOSP': 5000, 'DIVISLAB': 3500, 'HDFCLIFE': 650,
                'DRREDDY': 5200, 'BRITANNIA': 4800, 'BAJAJFINSV': 1600, 'GRASIM': 1800, 'CIPLA': 1000,
                'BPCL': 350, 'TATACONSUM': 800, 'IOC': 120, 'TATASTEEL': 120, 'ADANIPORTS': 750,
                'LTIM': 4500, 'TITAN': 3000, 'HEROMOTOCO': 2800, 'UPL': 550, 'BAJAJ-AUTO': 5500
            }
            
            for symbol in NIFTY50_SYMBOLS:
                base_price = base_prices.get(symbol, 1000)
                change = random.uniform(-5, 5)
                current_price = base_price * (1 + change/100)
                
                stocks.append({
                    'symbol': symbol,
                    'close': round(current_price, 2),
                    'open': base_price,
                    'volume': random.randint(100000, 10000000),
                    'changePercent': round(change, 2)
                })
        
        return jsonify(stocks)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)