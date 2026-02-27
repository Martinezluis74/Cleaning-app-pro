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



        </div>
    );
}
