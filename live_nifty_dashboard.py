import streamlit as st
import pandas as pd
import requests
import time

# Updated Twelve Data API key as per user input
TWELVE_DATA_API_KEY = "0e45cd01d16e49da9f90b28bbd375f11"
# CSV file URL removed as per user request

def load_stock_list():
    # Removed CSV loading, instead using a static list of Nifty 50 symbols
    # You can update this list as needed
    symbols = [
        "RELIANCE", "TCS", "HDFCBANK", "INFY", "HINDUNILVR", "ICICIBANK", "KOTAKBANK",
        "SBIN", "BHARTIARTL", "ITC", "HDFC", "LT", "AXISBANK", "MARUTI", "BAJFINANCE",
        "ASIANPAINT", "NESTLEIND", "TITAN", "ULTRACEMCO", "HCLTECH", "M&M", "POWERGRID",
        "TECHM", "ONGC", "JSWSTEEL", "DIVISLAB", "COALINDIA", "BAJAJ-AUTO", "WIPRO",
        "GRASIM", "TATASTEEL", "ADANIGREEN", "HDFCLIFE", "DRREDDY", "EICHERMOT",
        "SBILIFE", "CIPLA", "NTPC", "TATAMOTORS", "INDUSINDBK", "SHREECEM", "BRITANNIA",
        "HINDALCO", "HEROMOTOCO", "UPL", "BAJAJFINSV", "ICICIPRULI", "JSWENERGY",
        "GAIL", "TATACONSUM", "ADANIPORTS", "BPCL", "VEDL"
    ]
    # Return as DataFrame with Symbol and Company columns (Company names can be empty or same as symbol)
    df = pd.DataFrame({"Symbol": symbols, "Company": symbols})
    return df

def fetch_live_price(symbol):
    # Twelve Data API endpoint for real-time quote
    url = f"https://api.twelvedata.com/quote?symbol={symbol}&apikey={TWELVE_DATA_API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # 'close' field contains the latest price
            price = data.get("close", None)
            if price is not None:
                return float(price)
            else:
                return None
        else:
            return None
    except Exception:
        return None

def main():
    st.set_page_config(page_title="Live Nifty 50 Stock Prices", layout="wide")
    st.title("📈 Live Nifty 50 Stock Prices Dashboard")

    stock_list = load_stock_list()
    if stock_list.empty:
        st.warning("Stock list is empty. Please check the CSV URL.")
        return

    st.sidebar.header("Settings")
    refresh_interval = st.sidebar.slider("Refresh interval (seconds)", min_value=10, max_value=300, value=60, step=10)

    st.write("Displaying live prices for Nifty 50 stocks using Twelve Data API.")

    # Prepare a dataframe to show live prices
    live_data = []
    for idx, row in stock_list.iterrows():
        symbol = row.get("Symbol") or row.get("symbol") or row.get("SYMBOL")
        if symbol:
            # Twelve Data uses NSE symbols with .NSE suffix for Indian stocks
            twelvedata_symbol = f"{symbol}.NSE"
            price = fetch_live_price(twelvedata_symbol)
            live_data.append({
                "Symbol": symbol,
                "Company": row.get("Company") or row.get("Name") or "",
                "Live Price": price if price is not None else "N/A"
            })

    live_df = pd.DataFrame(live_data)

    # Display live data with color coding for price changes
    def color_price(val):
        try:
            val = float(val)
            if val > 0:
                color = 'green'
            elif val < 0:
                color = 'red'
            else:
                color = 'black'
        except:
            color = 'black'
        return f'color: {color}'

    if 'Live Price' in live_df.columns:
        st.dataframe(live_df.style.map(color_price, subset=['Live Price']))
    else:
        st.dataframe(live_df)

    # Auto-refresh info and button
    st.info(f"Data refreshes every {refresh_interval} seconds. Please refresh the page to update.")
    if st.button("Refresh Now"):
        st.cache_data.clear()
        st.cache_resource.clear()
        import streamlit as st_module
        st_module.experimental_rerun()

if __name__ == "__main__":
    main()
