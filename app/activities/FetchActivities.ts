export async function fetchActivities() {
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
}