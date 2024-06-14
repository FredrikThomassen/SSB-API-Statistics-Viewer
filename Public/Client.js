document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/statistikk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nettverkssvar var ikke ok.');
        }
        return response.json();
    })
    .then(result => {
        console.log(result);  
        const statsBody = document.getElementById('statsBody');
        statsBody.innerHTML = ''; // Tømmer eksisterende innhold før nye legges til/inn

        // Genererer tabellrader
        for (const region in result.data) {
            if (result.data.hasOwnProperty(region)) {
                const stats = result.statistics[region]; // Henter ut statistikk for region
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${region}</td>
                    <td>${result.data[region]['2020'] || 'N/A'}</td>
                    <td>${result.data[region]['2021'] || 'N/A'}</td>
                    <td>${result.data[region]['2022'] || 'N/A'}</td>
                    <td>${result.data[region]['2023'] || 'N/A'}</td>
                    <td>${stats.average || 'N/A'}</td>
                    <td>${stats.median || 'N/A'}</td>
                    <td>${stats.max || 'N/A'}</td>
                    <td>${stats.min || 'N/A'}</td>
                `;
                statsBody.appendChild(row);
            }
        }
    })
    .catch(error => {
        console.error('Feil ved henting av data:', error);
        const statsBody = document.getElementById('statsBody');
        statsBody.innerHTML = '<tr><td colspan="9">Kunne ikke laste data.</td></tr>';
    });
});