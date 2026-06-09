import { DigestViewState } from "@/components/dashboard/DigestViewState";
import { SiteHeader } from "@/components/SiteHeader";

export default function IssuesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <DigestViewState page="issues" />
      </main>
    </>
  );
}
