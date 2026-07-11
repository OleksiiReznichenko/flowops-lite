"use client";

import { getHealth, HealthResponse } from "@/lib/api/health";
import { useEffect, useState } from "react";

export function HealthStatus() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setData)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error");
        }
      });
  }, []);

  if (error) {
    return (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Backend connection failed: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-6 rounded-lg border p-4 text-gray-600">
        Checking backend connection...
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
      Backend connected: {data.status} - {data.service}
    </div>
  );
}
