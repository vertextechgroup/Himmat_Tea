import CustomerAuth from "@/app/pages/CustomerAuth";
import { Suspense } from "react";

export default function CustomerAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerAuth />
    </Suspense>
  );
}
