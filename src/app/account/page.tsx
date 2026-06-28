import CustomerAccount from "@/app/pages/CustomerAccount";
import { Suspense } from "react";

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading account...</div>}>
      <CustomerAccount />
    </Suspense>
  );
}
