import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample static data for your existing analytics graph
const data = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 600 },
  { name: "Mar", uv: 800 },
  { name: "Apr", uv: 700 },
  { name: "May", uv: 900 },
  { name: "Jun", uv: 1000 },
];

// Linear regression prediction function
function linearRegressionPredict(data: number[], count: number): number[] {
  if (data.length < 2) return [];
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (data[i] - yMean);
    denominator += (i - xMean) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  const predictions = [];
  for (let i = n; i < n + count; i++) {
    predictions.push(slope * i + intercept);
  }
  return predictions;
}

// CSV line parser to handle quotes and commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let token = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(token);
      token = "";
    } else {
      token += char;
    }
  }
  result.push(token);
  return result.map((s) => s.trim());
}

interface CrowdDataPoint {
  timestamp: string;
  crowd_count: number;
  place: string;
}

export default function Analytics() {
  const [places, setPlaces] = useState<string[]>([]);
  const [topPlaces, setTopPlaces] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [dataPoints, setDataPoints] = useState<CrowdDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load and parse CSV, compute top busiest places
  useEffect(() => {
    setError(null);
    fetch("/data/india_crowd_combined.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load crowd data");
        return res.text();
      })
      .then((csvText) => {
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) {
          setError("CSV file is empty or invalid");
          return;
        }
        const headers = parseCSVLine(lines[0]);
        const headerMap = headers.reduce((acc, curr, i) => {
          acc[curr.toLowerCase()] = i;
          return acc;
        }, {} as Record<string, number>);

        // Check for required columns
        const requiredColumns = ["date", "time", "place", "crowd_count (in thousands)"];
        for (const col of requiredColumns) {
          if (!(col in headerMap)) {
            setError(`CSV missing required column: ${col}`);
            return;
          }
        }

        const points: CrowdDataPoint[] = [];
        const crowdSumByPlace: Record<string, number> = {};

        for (let i = 1; i < lines.length; i++) {
          const fields = parseCSVLine(lines[i]);
          const date = fields[headerMap["date"]];
          const time = fields[headerMap["time"]];
          const placeStr = fields[headerMap["place"]];
          const crowdCountStr = fields[headerMap["crowd_count (in thousands)"]];

          if (!date || !time || !placeStr || !crowdCountStr) continue;

          const crowd_count_num = Number(crowdCountStr);
          if (isNaN(crowd_count_num)) continue;
          const crowdCountExact = crowd_count_num * 1000;
          const timestamp = `${date} ${time}`;

          points.push({
            timestamp,
            crowd_count: crowdCountExact,
            place: placeStr,
          });

          crowdSumByPlace[placeStr] = (crowdSumByPlace[placeStr] || 0) + crowdCountExact;
        }

        setDataPoints(points);

        const N = 15;
        // Sort places descending by total crowd count and pick top N
        const sortedTopPlaces = Object.entries(crowdSumByPlace)
          .sort((a, b) => b[1] - a[1])
          .slice(0, N)
          .map((entry) => entry[0]);

        setPlaces(Object.keys(crowdSumByPlace).sort());
        setTopPlaces(sortedTopPlaces);

        // Default selection is first top place if available
        if (sortedTopPlaces.length > 0) {
          setSelectedPlace(sortedTopPlaces[0]);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredData = dataPoints
    .filter((d) => d.place === selectedPlace)
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

  const lastFive = filteredData.slice(-5);
  const lastFiveCounts = lastFive.map((d) => d.crowd_count);
  const predictions = linearRegressionPredict(lastFiveCounts, 5);

  const CONGESTION_THRESHOLD = 1500000;
  const isCongested = predictions.some((p) => p > CONGESTION_THRESHOLD);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Original Analytics Graph */}
      <div className="bg-white rounded-2xl p-6 shadow mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Analytics</h2>
          <div className="text-sm text-slate-500">Overview</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive Analytics Section */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-bold mb-6">Predictive Analytics & Crowd Forecasts</h2>

        {error && <div className="text-red-600 mb-4">Error: {error}</div>}

        {!error && topPlaces.length === 0 && (
          <p>Loading data or no places found in the dataset...</p>
        )}

        {topPlaces.length > 0 && (
          <>
            <div className="mb-6">
              <label htmlFor="place-select" className="block mb-2 text-lg font-semibold">
                Select Place (Top {topPlaces.length} Busiest)
              </label>
              <select
                id="place-select"
                className="border rounded px-3 py-2 w-full max-w-md"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
              >
                {topPlaces.map((pl) => (
                  <option key={pl} value={pl}>
                    {pl}
                  </option>
                ))}
              </select>
            </div>

            {filteredData.length === 0 ? (
              <p>No data available for "{selectedPlace}".</p>
            ) : (
              <>
                <section className="mb-6">
                  <h3 className="font-semibold text-xl mb-3">
                    Recently Measured Crowd Counts (Last 5)
                  </h3>
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="border px-3 py-2">Timestamp</th>
                        <th className="border px-3 py-2">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastFive.map((point, i) => (
                        <tr key={i} className="odd:bg-gray-100">
                          <td className="border px-3 py-2">{point.timestamp}</td>
                          <td className="border px-3 py-2">{point.crowd_count.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section className="mb-6">
                  <h3 className="font-semibold text-xl mb-3">
                    Predicted Crowd Counts (Next 5 Intervals)
                  </h3>
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="border px-3 py-2">Interval</th>
                        <th className="border px-3 py-2">Predicted Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((val, i) => (
                        <tr
                          key={i}
                          className={`odd:bg-gray-100 ${
                            val > CONGESTION_THRESHOLD ? "bg-red-100" : ""
                          }`}
                        >
                          <td className="border px-3 py-2">{`+${i + 1}`}</td>
                          <td className="border px-3 py-2">{Math.round(val).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {isCongested ? (
                  <div className="bg-red-200 text-red-800 font-semibold p-4 rounded">
                    ⚠️ Warning: Potential congestion predicted! Crowd count expected to exceed {CONGESTION_THRESHOLD.toLocaleString()}.
                  </div>
                ) : (
                  <div className="bg-green-200 text-green-800 font-semibold p-4 rounded">
                    ✅ Crowd levels are predicted to be within safe limits.
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
