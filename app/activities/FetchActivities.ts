{/*export async function fetchActivities() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  const raw = `{
    "queryName": "$/GMA/API-IMIS/Research/Internal Dashboard/GMA Activities",
    "limit": 600,
    "offset": 0,
    "rt":  "d49^%Ygur!7Y9BLD"
  }`;

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const response = await fetch(
    "https://imiscloudapi.gmanet.com/QueryService/QueryService.asmx/RunQuery",
    requestOptions
  );
  const result = await response.text();
  const jsonRaw = result.match(/<string[^>]*>([\s\S]*?)<\/string>/)?.[1];
  if (!jsonRaw) throw new Error("Failed to extract JSON from XML.");
  return JSON.parse(jsonRaw);
}*/}


export async function fetchActivities(startDate: string, endDate: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  const limit = 500;
  let offset = 0;
  let stored = 0;
  let allRows: any[] = [];
  const startTime = Date.now();
  const rt = process.env.IMIS_RT;
  while (true) {
    const raw = `{
      "queryName": "$/GMA/API-IMIS/Research/Internal Dashboard/GMA Activities&Date=\\"${startDate}\\",\\"${endDate}\\"",
      "limit": ${limit},
      "offset": ${offset},
      "rt": "${rt}"
    }`;

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      "https://imiscloudapi.gmanet.com/QueryService/QueryService.asmx/RunQuery",
      requestOptions
    );
    const result = await response.text();
    const jsonRaw = result.match(/<string[^>]*>([\s\S]*?)<\/string>/)?.[1];
    if (!jsonRaw) throw new Error("Failed to extract JSON from XML.");

    const parsed = JSON.parse(jsonRaw);
    const rows = parsed.Items?.['$values'] ?? [];
    allRows.push(...rows);
    stored += rows.length;

    if (stored % 500 === 0) {
      const now = Date.now();
      const seconds = ((now - startTime) / 1000).toFixed(2);
      console.log(`Stored ${stored} rows in ${seconds} seconds`);
    }

    if (!parsed.HasNext || rows.length === 0) {
      break;
    }
    offset = parsed.NextOffset ?? (offset + limit);
  }

  // Print final count if not a multiple of 500
  if (stored % 500 !== 0) {
    const now = Date.now();
    const seconds = ((now - startTime) / 1000).toFixed(2);
    console.log(`Stored ${stored} rows in ${seconds} seconds`);
  }

  const endTime = Date.now();
  const seconds = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`Done! Total rows stored: ${stored} in ${seconds} seconds`);

  // Return all rows as the result (for compatibility with your app)
  return { Items: { $values: allRows } };
}