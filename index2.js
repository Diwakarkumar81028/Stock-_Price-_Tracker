let trackedStocks = [];

document.getElementById('searchBtn').addEventListener('click', function () {
  const symbol = document.getElementById('stockSymbol').value.toUpperCase().trim();
  if (symbol && !trackedStocks.includes(symbol)) {
    trackedStocks.push(symbol);
    fetchStockPrice(symbol);
    document.getElementById('stockSymbol').value = ''; // Clear input
  } else {
    alert('Please enter a valid stock symbol.');
  }
});

async function fetchStockPrice(symbol) {
  const apiKey = '7S5REYYGH9DQ2500'; // Your API key
  const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const stockData = data['Global Quote'];
      const price = parseFloat(stockData['05. price']).toFixed(2);
      const change = parseFloat(stockData['09. change']).toFixed(2);
      const changePercent = stockData['10. change percent'];
      updateStockTable(symbol, price, change, changePercent);
    } else {
      alert(`Stock symbol ${symbol} not found.`);
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Error fetching stock data. Please try again later.');
  }
}

function updateStockTable(symbol, price, change, changePercent) {
  const stockDataDiv = document.getElementById('stockData');
  let table = document.querySelector('#stockData table');

  if (!table) {
    table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price ($)</th>
          <th>Change ($)</th>
          <th>Change (%)</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    stockDataDiv.appendChild(table);
  }

  const tbody = table.querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${symbol}</td>
    <td>$${price}</td>
    <td>${change}</td>
    <td>${changePercent}</td>
  `;
  tbody.appendChild(row);
}
