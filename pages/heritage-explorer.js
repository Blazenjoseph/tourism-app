import { useState } from "react";
import { AppShell, ToolIntro } from "@/components/app-shell";

export default function HeritageExplorer() {
  const [preview, setPreview] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setExplanation("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!preview) return;
    setLoading(true);
    setError("");
    setExplanation("");

    try {
      const [header, base64Data] = preview.split(",");
      const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";

      const res = await fetch("/api/heritage-explorer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setExplanation(data.explanation);
      }
    } catch (err) {
      setError("Failed to reach the server. Please try again.");
    }

    setLoading(false);
  }

  return (
    <AppShell>
      <ToolIntro eyebrow="Point. Snap. Time-travel." title="Heritage Explorer" description="Upload a monument, statue, or heritage-site photo and let AI unpack the story behind it." />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="tm-surface p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Your photo</p>
          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-neutral-950 bg-orange-50 px-5 py-10 text-center transition-colors hover:bg-pink-100">
            <span className="text-3xl">📷</span>
            <span className="mt-3 font-black">Choose a heritage image</span>
            <span className="mt-1 text-sm font-semibold text-neutral-500">JPG, PNG, or anything your camera loves.</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Uploaded preview"
              className="mt-5 h-72 w-full rounded-2xl border-2 border-neutral-950 object-cover"
            />
          )}

          {preview && (
            <button
              onClick={handleAnalyze}
              className="mt-5 w-full rounded-2xl border-2 border-neutral-950 bg-violet-300 px-5 py-3.5 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Explain this heritage site"}
            </button>
          )}
        </div>

        {error && (
          <p className="rounded-2xl border-2 border-red-600 bg-red-50 p-4 font-bold text-red-700">Error: {error}</p>
        )}

        {explanation && (
          <div className="tm-surface h-fit whitespace-pre-wrap p-6 text-[15px] font-medium leading-7 text-neutral-700 sm:p-8">
            <p className="mb-5 text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">The story behind the scene</p>
            {explanation}
          </div>
        )}
      </div>
    </AppShell>
  );
}
