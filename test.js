const testAPI = async () => {
    console.log("----------------------------------------");
    console.log("🚀 TESTING SCHOOL MANAGEMENT API");
    console.log("----------------------------------------\n");

    try {
        // 1. Add School 1
        console.log("POST /api/addSchool -> Adding 'Springfield Elementary'");
        const add1 = await fetch("http://localhost:3000/api/addSchool", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Springfield Elementary",
                address: "123 Apple St, Springfield",
                latitude: 39.78,
                longitude: -89.65
            })
        });
        const add1Data = await add1.json();
        console.log("Response:", add1Data, "\n");

        // 2. Add School 2
        console.log("POST /api/addSchool -> Adding 'Shelbyville High'");
        const add2 = await fetch("http://localhost:3000/api/addSchool", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Shelbyville High",
                address: "456 Orange Ave, Shelbyville",
                latitude: 39.80, // slightly further
                longitude: -89.60
            })
        });
        const add2Data = await add2.json();
        console.log("Response:", add2Data, "\n");

        // 3. List Schools
        console.log("GET /api/listSchools -> Finding schools near lat: 39.78, lon: -89.65");
        console.log("Expected: Springfield Elementary should be closest (Distance: 0 km)\n");
        const list = await fetch("http://localhost:3000/api/listSchools?latitude=39.78&longitude=-89.65");
        const listData = await list.json();

        console.log("🎯 SORTED RESULTS:");
        console.table(listData.map(school => ({
            Name: school.name,
            Distance: roundTo(school.distance, 2) + " km"
        })));

    } catch (e) {
        console.error("Error connecting to API. Is the server running?", e.message);
    }
};

const roundTo = (n, digits) => {
    let negative = false;
    if (digits === undefined) { digits = 0; }
    if (n < 0) { negative = true; n = n * -1; }
    let multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) { n = (n * -1).toFixed(digits); }
    return n;
}

testAPI();
