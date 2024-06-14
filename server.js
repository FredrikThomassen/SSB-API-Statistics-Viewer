const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Hjelpefunksjon for å beregne statistikk
function calculateStatistics(values) {
    values = values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length || 0;
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { average, median, max, min };
}

// Hovedfunksjon for å transformere og beregne statistikk
function transformAndCalculateStatistics(data) {
    if (!data.dimension || !data.dimension.Region || !data.dimension.Tid || !data.value) {
        throw new Error('Datastruktur fra API stemmer ikke, sjekk API respons');
    }

    const regionLabels = data.dimension.Region.category.label;
    const timeLabels = data.dimension.Tid.category.label;
    const regionIndices = data.dimension.Region.category.index;
    const timeIndices = data.dimension.Tid.category.index;
    const values = data.value;

    const transformed = {};
    const statistics = {};

    Object.keys(regionIndices).forEach(regionCode => {
        const regionIndex = regionIndices[regionCode];
        const regionValues = [];

        transformed[regionLabels[regionCode]] = {};

        Object.keys(timeIndices).forEach(time => {
            const timeIndex = timeIndices[time];
            const valueIndex = regionIndex * Object.keys(timeIndices).length + timeIndex;
            const value = values[valueIndex] || null;
            regionValues.push(value);
            transformed[regionLabels[regionCode]][time] = value;
        });

        statistics[regionLabels[regionCode]] = calculateStatistics(regionValues);
    });

    return { transformed, statistics };
}
// API-endepunkt som håndterer statistikk-forespørsler
app.post('/api/statistikk', async (req, res) => {
    const apiUrl = 'https://data.ssb.no/api/v0/no/table/11342/';
    const query = {
        "query": [
            {
                "code": "Region",
                "selection": {
                    "filter": "vs:Kommune",
                    "values": ["3030", "0301", "1506"] // Lillestrøm, Oslo, Molde
                }
            },
            {
                "code": "ContentsCode",
                "selection": {
                    "filter": "item",
                    "values": ["FolkeLandArealKm2"] // Innbyggere per km² landareal
                }
            },
            {
                "code": "Tid",
                "selection": {
                    "filter": "item",
                    "values": ["2020", "2021", "2022", "2023"]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    try {
        const response = await axios.post(apiUrl, query);
        const { transformed, statistics } = transformAndCalculateStatistics(response.data);
        res.json({ data: transformed, statistics: statistics });
    } catch (error) {
        console.error('Det oppstod en feil ved henting av data: ', error);
        res.status(500).send('Serverfeil');
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});