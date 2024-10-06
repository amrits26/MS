    // Load and parse CSV content
    fetch('https://raw.githubusercontent.com/amrits26/MS/refs/heads/main/data_sample.csv')
    .then(res => res.text())
    .then(csvData => {
        const rows = csvData.split('\n').slice(1); 
        const tableBody = document.getElementById('inventoryData');
        
        rows.forEach(row => {
            const cols = row.split(',');
            const date = new Date(cols[0]);
            const formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const projectedCost = parseFloat(cols[1]);
            const materialCost = parseFloat(cols[2]);
            const laborCost = parseFloat(cols[3]);
            const storageCost = parseFloat(cols[4]);

            if (!isNaN(projectedCost) && !isNaN(materialCost) && !isNaN(laborCost) && !isNaN(storageCost)) {
                const totalCost = materialCost + laborCost + storageCost;
                const salePrice = projectedCost * 1.15;
                const profitMargin = salePrice - totalCost;
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${projectedCost.toFixed(2)}</td>
                    <td>${materialCost.toFixed(2)}</td>
                    <td>${laborCost.toFixed(2)}</td>
                    <td>${storageCost.toFixed(2)}</td>
                    <td>${totalCost.toFixed(2)}</td>
                    <td>${salePrice.toFixed(2)}</td>
                    <td>${profitMargin.toFixed(2)}</td>
                `;
                tableBody.appendChild(newRow);
            }
        });
    })
    .catch(err => console.error('Error loading data:', err));
