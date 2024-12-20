const form = document.getElementById('add-stock-form');
const tableBody = document.getElementById('portfolio-table').querySelector('tbody');
const portfolioValueDisplay = document.getElementById('portfolio-value');
const topStockDisplay = document.getElementById('top-stock');
const distributionList = document.getElementById('distribution-list');

let portfolioValue = 0;
let stocks = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const stockName = document.getElementById('stock-name').value;
    const stockQuantity = parseInt(document.getElementById('stock-quantity').value);
    const stockPrice = parseFloat(document.getElementById('stock-price').value);
    const totalValue = (stockQuantity * stockPrice).toFixed(2);

    portfolioValue += parseFloat(totalValue);
    stocks.push({ name: stockName, quantity: stockQuantity, price: stockPrice, total: parseFloat(totalValue) });
    updateDashboard();

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${stockName}</td>
        <td>${stockQuantity}</td>
        <td>${stockPrice.toFixed(2)}</td>
        <td>${totalValue}</td>
        <td class="actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;

    const deleteButton = row.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        portfolioValue -= parseFloat(totalValue);
        stocks = stocks.filter(stock => stock.name !== stockName);
        updateDashboard();
        row.remove();
    });

    const editButton = row.querySelector('.edit');
    editButton.addEventListener('click', () => {
        document.getElementById('stock-name').value = stockName;
        document.getElementById('stock-quantity').value = stockQuantity;
        document.getElementById('stock-price').value = stockPrice;
        portfolioValue -= parseFloat(totalValue);
        stocks = stocks.filter(stock => stock.name !== stockName);
        updateDashboard();
        row.remove();
    });

    tableBody.appendChild(row);
    form.reset();
});

function updateDashboard() {
    portfolioValueDisplay.textContent = portfolioValue.toFixed(2);

    // Update top-performing stock
    if (stocks.length > 0) {
        const topStock = stocks.reduce((max, stock) => (stock.total > max.total ? stock : max));
        topStockDisplay.textContent = `${topStock.name} ($${topStock.total.toFixed(2)})`;
    } else {
        topStockDisplay.textContent = 'N/A';
    }

    // Update portfolio distribution
    distributionList.innerHTML = '';
    stocks.forEach(stock => {
        const li = document.createElement('li');
        const percentage = ((stock.total / portfolioValue) * 100).toFixed(2);
        li.textContent = `${stock.name}: ${percentage}%`;
        distributionList.appendChild(li);
    });
}
