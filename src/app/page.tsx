import { UploadZip } from "@/components/UploadZip";
import { WalkthroughWizard } from "@/components/Wizard/WalkthroughWizard";
import { WizardProvider } from "@/context/WizardContext";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 text-center pb-24 bg-slate-50">

            {/* PREMIUM HEADER */}
            <div className="mt-16 mb-8">
                <h1 className="text-5xl font-black tracking-tighter lg:text-7xl text-slate-900 mb-4 drop-shadow-sm">
                    Cleaning <span className="text-blue-600">Pro</span> Quotes
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-bold tracking-widest uppercase">
                    Professional Walkthrough Wizard
                </p>
            </div>

            {/* M5 LIVE WIZARD (State context provided here) */}
            <div className="w-full">
                <WizardProvider>
                    <WalkthroughWizard />
                </WizardProvider>
            </div>

            {/* M3 UPLOAD ENGINE (Admin View) */}
            <div className="w-full max-w-lg text-left mx-auto mt-24 pt-12 border-t border-slate-200">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="text-center text-xs text-slate-500 font-black uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full ring-1 ring-slate-200 shadow-sm">
                        Admin / Datasets
                    </div>
                    <p className="text-slate-500 text-sm mt-3">Upload TSV Data ZIP to update calculation rules</p>
                </div>
                <div className="bg-white ring-1 ring-slate-200 p-6 rounded-2xl shadow-sm">
                    <UploadZip />
                </div>
            </div>

        </div>
    );
}
