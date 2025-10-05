"use client";

import { useState, useEffect } from "react";

interface HealthData {
  status: string;
  timestamp: string;
  [key: string]: unknown;
}

export default function Home() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://xfbodnnieh.execute-api.eu-north-1.amazonaws.com/dev/";
      const response = await fetch(`${backendUrl}/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">Connection Error</div>
          <button
            onClick={() => {
              setLoading(true);
              checkHealth();
            }}
            className="text-blue-500 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-green-600 mb-4">✓ Connected</div>
        <pre className="bg-black p-4 rounded text-left text-sm mb-4 overflow-x-auto">
          {JSON.stringify(healthData, null, 2)}
        </pre>
        <button
          onClick={() => {
            setLoading(true);
            checkHealth();
          }}
          className="text-blue-500 text-sm underline"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
