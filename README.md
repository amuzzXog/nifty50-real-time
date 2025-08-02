# NIFTY 50 Live Dashboard

Real-time web dashboard displaying all 50 NIFTY stocks with live price updates, interactive charts, and market analytics.

## 🚀 Features

- **Real-time Updates** - Price changes every 2 seconds
- **Complete NIFTY 50** - All 50 stocks with live data
- **Top Gainers/Losers** - Top 5 performers in each category
- **Interactive Charts** - Market overview & performance visualization
- **Market Statistics** - Live count of gainers, losers, and neutral stocks
- **Responsive Design** - Works on desktop and mobile
- **Auto-refresh** - Continuous data updates

## 📊 Dashboard Sections

1. **Market Stats** - Total stocks, gainers, losers count
2. **Charts** - Doughnut chart (market overview) + Bar chart (top performers)
3. **Top Gainers** - 5 best performing stocks
4. **Top Losers** - 5 worst performing stocks
5. **Complete Table** - All 50 NIFTY stocks with price, change, volume

## 🛠️ Installation

1. **Clone/Download** the project files

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the server:**
```bash
python server.py
```

4. **Open browser:** `http://localhost:5000`

## 📁 Project Structure

```
NIFTY 50/
├── index.html      # Main dashboard UI
├── app.js          # Frontend JavaScript
├── server.py       # Flask backend server
├── scraper.py      # NSE data scraper (optional)
├── requirements.txt # Python dependencies
└── README.md       # This file
```

## 🔧 Technical Details

- **Frontend:** HTML5, CSS3, JavaScript, Chart.js
- **Backend:** Flask (Python)
- **Data Source:** Mock real-time data (demo mode)
- **Update Frequency:** 2 seconds
- **Stocks Covered:** All 50 NIFTY stocks

## 📈 NIFTY 50 Stocks Included

RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, KOTAKBANK, SBIN, BHARTIARTL, ITC, LT, ASIANPAINT, AXISBANK, MARUTI, SUNPHARMA, ULTRACEMCO, NTPC, NESTLEIND, BAJFINANCE, ONGC, POWERGRID, M&M, WIPRO, JSWSTEEL, TATAMOTORS, HCLTECH, INDUSINDBK, ADANIENTS, COALINDIA, HINDALCO, SBILIFE, EICHERMOT, TECHM, APOLLOHOSP, DIVISLAB, HDFCLIFE, DRREDDY, BRITANNIA, BAJAJFINSV, GRASIM, CIPLA, BPCL, TATACONSUM, IOC, TATASTEEL, ADANIPORTS, LTIM, TITAN, HEROMOTOCO, UPL, BAJAJ-AUTO

## 🌐 Usage

1. **Auto-refresh:** Dashboard updates every 2 seconds automatically
2. **Manual refresh:** Click "🔄 Refresh Data" button
3. **View charts:** Interactive charts show market distribution and top performers
4. **Sort data:** Stocks are sorted by performance (highest gainers first)
5. **Mobile friendly:** Responsive design works on all devices

## ⚙️ Configuration

- **Update interval:** Change `2000` in `app.js` (line with `setInterval`)
- **Stock list:** Modify `NIFTY50_SYMBOLS` array in both `app.js` and `server.py`
- **Port:** Change `port=5000` in `server.py`

## 🔄 Data Sources

- **Demo Mode:** Uses mock real-time data with realistic price fluctuations
- **Live Data:** Optional `scraper.py` for actual NSE data
- **API Integration:** Can be connected to real-time stock APIs

## 🚨 Notes

- Current version uses simulated data for demonstration
- For production use, integrate with actual stock data APIs
- Ensure compliance with data provider terms of service
- Consider rate limiting for API calls