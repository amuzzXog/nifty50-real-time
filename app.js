const API_KEY = 'e3354d7df44b65d70f40902455b7e78d';
const BASE_URL = 'http://api.marketstack.com/v1';

const NIFTY50_SYMBOLS = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'KOTAKBANK', 'SBIN', 'BHARTIARTL',
    'ITC', 'LT', 'ASIANPAINT', 'AXISBANK', 'MARUTI', 'SUNPHARMA', 'ULTRACEMCO', 'NTPC',
    'NESTLEIND', 'BAJFINANCE', 'ONGC', 'POWERGRID', 'M&M', 'WIPRO', 'JSWSTEEL', 'TATAMOTORS',
    'HCLTECH', 'INDUSINDBK', 'ADANIENTS', 'COALINDIA', 'HINDALCO', 'SBILIFE', 'EICHERMOT',
    'TECHM', 'APOLLOHOSP', 'DIVISLAB', 'HDFCLIFE', 'DRREDDY', 'BRITANNIA', 'BAJAJFINSV',
    'GRASIM', 'CIPLA', 'BPCL', 'TATACONSUM', 'IOC', 'TATASTEEL', 'ADANIPORTS', 'LTIM',
    'TITAN', 'HEROMOTOCO', 'UPL', 'BAJAJ-AUTO'
];

let stockData = [];
let marketChart = null;
let performanceChart = null;
let currentSort = 'rank';
let sortDirection = 'desc';

async function fetchStockData() {
    try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return [];
    }
}

function calculateChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(price);
}

function formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

function updateStats(data) {
    const gainers = data.filter(stock => stock.changePercent > 0);
    const losers = data.filter(stock => stock.changePercent < 0);
    
    document.getElementById('totalStocks').textContent = data.length;
    document.getElementById('gainersCount').textContent = gainers.length;
    document.getElementById('losersCount').textContent = losers.length;
    document.getElementById('marketStatus').textContent = 'Open';
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

function displayTopGainers(data) {
    const gainers = data
        .filter(stock => stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5);
    
    const container = document.getElementById('topGainers');
    container.innerHTML = gainers.map(stock => `
        <div class="stock-item">
            <div>
                <div class="stock-symbol">${stock.symbol}</div>
                <div style="font-size: 0.9em; color: #666;">${formatPrice(stock.close)}</div>
            </div>
            <div class="stock-price positive">
                ${formatChange(stock.changePercent)}
            </div>
        </div>
    `).join('');
}

function displayTopLosers(data) {
    const losers = data
        .filter(stock => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 5);
    
    const container = document.getElementById('topLosers');
    container.innerHTML = losers.map(stock => `
        <div class="stock-item">
            <div>
                <div class="stock-symbol">${stock.symbol}</div>
                <div style="font-size: 0.9em; color: #666;">${formatPrice(stock.close)}</div>
            </div>
            <div class="stock-price negative">
                ${formatChange(stock.changePercent)}
            </div>
        </div>
    `).join('');
}

function displayAllStocks(data) {
    const allStocks = NIFTY50_SYMBOLS.map(symbol => {
        const stockData = data.find(stock => stock.symbol === symbol);
        if (stockData) {
            return {
                ...stockData,
                high: stockData.high || stockData.close * 1.02,
                low: stockData.low || stockData.close * 0.98
            };
        } else {
            return {
                symbol: symbol,
                close: 0,
                open: 0,
                volume: 0,
                changePercent: 0,
                high: 0,
                low: 0,
                unavailable: true
            };
        }
    });
    
    const sortedData = sortStockData(allStocks, currentSort, sortDirection);
    const tableBody = document.getElementById('allStocksTable');
    
    tableBody.innerHTML = sortedData.map((stock, index) => {
        const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
        const changeValue = stock.close - stock.open;
        const rank = index + 1;
        
        if (stock.unavailable) {
            return `
                <tr class="stock-row" style="opacity: 0.5;">
                    <td class="stock-rank">${rank}</td>
                    <td><strong>${stock.symbol}</strong></td>
                    <td>Data unavailable</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            `;
        }
        
        return `
            <tr class="stock-row">
                <td class="stock-rank">${rank}</td>
                <td><strong>${stock.symbol}</strong></td>
                <td>${formatPrice(stock.close)}</td>
                <td class="${changeClass}">${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}</td>
                <td class="${changeClass}">${formatChange(stock.changePercent)}</td>
                <td>${stock.volume ? stock.volume.toLocaleString() : 'N/A'}</td>
                <td>${formatPrice(stock.high)} / ${formatPrice(stock.low)}</td>
            </tr>
        `;
    }).join('');
}

function sortStockData(data, sortBy, direction) {
    return data.sort((a, b) => {
        let aVal, bVal;
        
        switch(sortBy) {
            case 'symbol':
                aVal = a.symbol;
                bVal = b.symbol;
                break;
            case 'price':
                aVal = a.close;
                bVal = b.close;
                break;
            case 'change':
                aVal = a.changePercent;
                bVal = b.changePercent;
                break;
            case 'volume':
                aVal = a.volume || 0;
                bVal = b.volume || 0;
                break;
            default:
                aVal = a.changePercent;
                bVal = b.changePercent;
        }
        
        if (typeof aVal === 'string') {
            return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
}

function sortStocks(sortBy) {
    if (currentSort === sortBy) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort = sortBy;
        sortDirection = 'desc';
    }
    
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="sortStocks('${sortBy}')"]`).classList.add('active');
    
    displayAllStocks(stockData);
}

function searchStocks() {
    const searchTerm = document.getElementById('stockSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#allStocksTable .stock-row');
    
    rows.forEach(row => {
        const symbol = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = symbol.includes(searchTerm) ? '' : 'none';
    });
}

async function loadStockData() {
    try {
        document.getElementById('topGainers').innerHTML = '<div class="loading">Loading...</div>';
        document.getElementById('topLosers').innerHTML = '<div class="loading">Loading...</div>';
        
        const rawData = await fetchStockData();
        
        if (rawData.length === 0) {
            throw new Error('No data received');
        }
        
        stockData = rawData.map(stock => ({
            ...stock,
            changePercent: calculateChange(stock.close, stock.open)
        }));
        
        updateStats(stockData);
        displayTopGainers(stockData);
        displayTopLosers(stockData);
        updateCharts(stockData);
        
    } catch (error) {
        console.error('Error loading stock data:', error);
        document.getElementById('topGainers').innerHTML = '<div class="loading">Error loading data</div>';
        document.getElementById('topLosers').innerHTML = '<div class="loading">Error loading data</div>';
    }
}

async function loadAllStocksTable() {
    try {
        document.getElementById('allStocksTable').innerHTML = '<tr><td colspan="7" class="loading">Loading stock data...</td></tr>';
        
        const rawData = await fetchStockData();
        
        if (rawData.length === 0) {
            throw new Error('No data received');
        }
        
        const processedData = rawData.map(stock => ({
            ...stock,
            changePercent: calculateChange(stock.close, stock.open)
        }));
        
        displayAllStocks(processedData);
        
    } catch (error) {
        console.error('Error loading stock data:', error);
        document.getElementById('allStocksTable').innerHTML = '<tr><td colspan="7" class="loading">Error loading data. Please try again.</td></tr>';
    }
}

// Auto-refresh gainers/losers every 2 seconds
setInterval(loadStockData, 2000);

function updateCharts(data) {
    updateMarketChart(data);
    updatePerformanceChart(data);
}

function updateMarketChart(data) {
    const gainers = data.filter(stock => stock.changePercent > 0).length;
    const losers = data.filter(stock => stock.changePercent < 0).length;
    const neutral = data.length - gainers - losers;

    const ctx = document.getElementById('marketChart').getContext('2d');
    
    if (marketChart) {
        marketChart.destroy();
    }
    
    marketChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gainers', 'Losers', 'Neutral'],
            datasets: [{
                data: [gainers, losers, neutral],
                backgroundColor: ['#27ae60', '#e74c3c', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updatePerformanceChart(data) {
    const topPerformers = data
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 10);
    
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPerformers.map(stock => stock.symbol),
            datasets: [{
                label: 'Change %',
                data: topPerformers.map(stock => stock.changePercent),
                backgroundColor: topPerformers.map(stock => 
                    stock.changePercent >= 0 ? '#27ae60' : '#e74c3c'
                )
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStockData();
    loadAllStocksTable();
    document.getElementById('stockSearch').addEventListener('input', searchStocks);
});