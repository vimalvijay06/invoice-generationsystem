document.getElementById('invoice-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const getFieldValue = (id) => document.getElementById(id).value;
    const getItems = () => Array.from(document.querySelectorAll('.item')).map(item => ({
        description: item.querySelector('[name="item-description[]"]').value,
        quantity: parseInt(item.querySelector('[name="item-quantity[]"]').value),
        price: parseFloat(item.querySelector('[name="item-price[]"]').value)
    }));

    const customerDetails = {
        name: getFieldValue('customer-name'),
        address: getFieldValue('customer-address'),
        salesperson: getFieldValue('salesperson'),
        paymentTerms: getFieldValue('payment-terms')
    };

    const taxRate = parseFloat(getFieldValue('tax-rate'));
    const items = getItems();
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    document.getElementById('invoice-details').innerHTML = `
        <p><strong>To:</strong> ${customerDetails.name}</p>
        <p><strong>Address:</strong> ${customerDetails.address}</p>
        <p><strong>Salesperson:</strong> ${customerDetails.salesperson}</p>
        <p><strong>Payment Terms:</strong> ${customerDetails.paymentTerms}</p>
    `;

    const itemsTable = document.querySelector('#invoice-items tbody');
    itemsTable.innerHTML = items.map(item => `
        <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('invoice-totals').innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (${taxRate}%): $${taxAmount.toFixed(2)}</p>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
    `;

    document.getElementById('form-container').style.display = 'none';
    document.getElementById('invoice-container').style.display = 'block';
});

document.getElementById('add-item').addEventListener('click', function () {
    const itemsContainer = document.getElementById('items-container');
    const newItem = document.createElement('div');
    newItem.className = 'item';

    newItem.innerHTML = `
        <label>Item Description:</label><br>
        <input type="text" name="item-description[]" required><br>
        <label>Quantity:</label><br>
        <input type="number" name="item-quantity[]" value="1" min="1" required><br>
        <label>Price per Unit:</label><br>
        <input type="number" name="item-price[]" step="0.01" min="0" required><br><br>
    `;

    itemsContainer.appendChild(newItem);
});

document.getElementById('print-invoice').addEventListener('click', () => window.print());

document.getElementById('download-invoice').addEventListener('click', () => {
    const blob = new Blob([document.getElementById('invoice').outerHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.html';
    link.click();
});