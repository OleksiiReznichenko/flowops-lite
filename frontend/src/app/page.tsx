import { HealthStatus } from "@/components/HealthStatus";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold">FlowOps Lite</h1>
      <p className="mt-2 text-grey-600">Frontend is running.</p>

      <HealthStatus />
    </main>
  );
}
