import { Suspense } from "react";

import VerifyEmailClient from "@/components/VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fbf9ff] dark:bg-[#0d0d12]" />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
