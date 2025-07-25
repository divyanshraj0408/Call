import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@call/ui/components/card";
import { Button } from "@call/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import { FiPhone } from "react-icons/fi";
import { useRouter } from "next/navigation";
// import { es } from "date-fns/locale";

interface Call {
  id: string;
  name: string;
  joinedAt: string;
}

export function CallHistory() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch("http://localhost:1284/api/calls/participated", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch calls");
        const data = await res.json();
        setCalls(data.calls);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading calls");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-12 bg-muted"></CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>Error: {error}</p>
        <p className="mt-2">Please try again later</p>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No call history yet
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full mx-auto  flex flex-wrap items-center">
      {calls.map((call) => (
        <Card
          key={call.id}
          className="transition-shadow hover:shadow-lg border border-muted/60 bg-muted/40 px-8 py-7 mx-auto min-w-[340px]"
        >
          <CardHeader className="p-0 border-0 bg-transparent">
            <div className="flex flex-col items-center gap-4 w-full">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
                <FiPhone size={28} />
              </span>
              <h3 className="text-xl font-semibold leading-tight break-words text-center">{call.name}</h3>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span className="font-mono">ID: {call.id}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1 text-xs"
                  title="Copy Call ID"
                  onClick={() => navigator.clipboard.writeText(call.id)}
                >
                  📋
                </Button>
              </div>
              <time className="text-xs text-muted-foreground mt-3">
                {formatDistanceToNow(new Date(call.joinedAt), { addSuffix: true })}
              </time>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
} 