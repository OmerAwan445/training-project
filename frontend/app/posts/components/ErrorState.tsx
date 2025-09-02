import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-2">⚠️ Error</div>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
