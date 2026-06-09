import { SiteHeader } from "@/components/SiteHeader";
import { UploadPanel } from "@/components/UploadPanel";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <UploadPanel />
      </main>
    </>
  );
}
