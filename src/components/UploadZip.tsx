"use client";

import { useState } from "react";

export function UploadZip() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload-dataset", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            setMessage(`Success! Version created: ${data.versionName} with ${data.stats?.tasks || 0} tasks.`);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-card border rounded-lg shadow-sm text-card-foreground">
            <h2 className="text-xl font-semibold mb-4 text-primary">Upload Dataset Bundle (.zip)</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Select the ZIP containing DimTask.tsv, Inventory.tsv, etc. to create a new active pricing logic version.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90 transition-colors"
                />

                <button
                    type="submit"
                    disabled={!file || loading}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Processing ZIP..." : "Upload and Sync Data"}
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${message.startsWith("Error") ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-800"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}
