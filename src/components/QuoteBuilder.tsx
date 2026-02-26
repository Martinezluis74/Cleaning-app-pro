"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, Calculator, CheckCircle2, Download, AlertCircle } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ProposalPDF } from "@/components/ProposalPDF";

export function QuoteBuilder() {
    const [sqft, setSqft] = useState<number>(5000);
    const [frequency, setFrequency] = useState<string>("Weekly");
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchQuote = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sqft, frequency }),
                });
                const data = await res.json();
                if (res.ok) setQuote(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (sqft >= 100) fetchQuote();
        }, 400);

        return () => clearTimeout(timer);
    }, [sqft, frequency]);

    return (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 px-6">

            {/* LEFT COLUMN: Input Form */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-slate-800 bg-slate-900 shadow-2xl overflow-hidden rounded-2xl">
                    <CardHeader className="bg-slate-900/50 border-b border-slate-800 pb-8 pt-8 px-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-700/20 rounded-xl">
                                <Building2 className="w-6 h-6 text-blue-500" />
                            </div>
                            <CardTitle className="text-2xl text-slate-100 font-bold tracking-tight">Facility Details</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400 text-base">Enter the workspace specifics to calculate a live quote instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8 px-8 pb-8">
                        <div className="space-y-3">
                            <Label htmlFor="sqft" className="text-sm font-bold text-slate-300 uppercase tracking-widest">Cleanable Square Footage</Label>
                            <div className="relative group">
                                <Input
                                    id="sqft"
                                    type="number"
                                    value={sqft}
                                    onChange={(e) => setSqft(Number(e.target.value))}
                                    className="pl-12 text-2xl h-16 bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all rounded-xl font-mono shadow-inner"
                                    min={100}
                                />
                                <span className="absolute left-4 top-5 text-slate-500 group-focus-within:text-blue-500 transition-colors">⛶</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="frequency" className="text-sm font-bold text-slate-300 uppercase tracking-widest">Service Frequency</Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger id="frequency" className="text-lg h-16 bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl px-4">
                                    <SelectValue placeholder="Select Frequency" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
                                    <SelectItem value="Daily" className="focus:bg-blue-700 focus:text-white py-3">Daily (5x/week)</SelectItem>
                                    <SelectItem value="Weekly" className="focus:bg-blue-700 focus:text-white py-3">Weekly (1x/week)</SelectItem>
                                    <SelectItem value="Bi-Weekly" className="focus:bg-blue-700 focus:text-white py-3">Bi-Weekly (Every 2 weeks)</SelectItem>
                                    <SelectItem value="Monthly" className="focus:bg-blue-700 focus:text-white py-3">Monthly (1x/month)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Highlighted Corporate Investment Card */}
            <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
                {quote ? (
                    <Card className="border-0 shadow-2xl flex-grow flex flex-col overflow-hidden bg-white rounded-2xl ring-1 ring-slate-200">
                        {/* HER0 HEADER FOR THE PRICE */}
                        <div className="bg-blue-700 text-white p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                            {loading && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest bg-blue-800/50 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div> Re-calculating...
                                </div>
                            )}

                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 mb-4 drop-shadow-sm">Estimated Investment</h2>
                            <div className="text-7xl lg:text-8xl font-black tracking-tighter mb-6 drop-shadow-xl text-white">
                                {quote.costs.totalMonthlyPrice}
                                <span className="text-3xl font-medium text-blue-200 tracking-normal">/mo</span>
                            </div>
                            <div className="flex gap-4 text-sm font-semibold bg-blue-900/40 px-6 py-3 rounded-full backdrop-blur-md border border-blue-500/30">
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-300" /> {quote.frequency}</span>
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-300" /> {quote.workspace}</span>
                            </div>
                        </div>

                        <CardContent className="p-8 space-y-8 flex-grow bg-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Visits / Month</div>
                                    <div className="text-2xl font-bold text-slate-900">{quote.visitsPerMonth}</div>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Labor / Visit</div>
                                    <div className="text-2xl font-bold text-slate-900">{quote.perVisitLaborHours} <span className="text-sm font-medium text-slate-500">hrs</span></div>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Subtotal</div>
                                    <div className="text-2xl font-bold text-slate-900">{quote.costs.subTotal}</div>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">HST (13%)</div>
                                    <div className="text-2xl font-bold text-slate-900">{quote.costs.taxes}</div>
                                </div>
                            </div>

                            {/* TRACEABILITY ACCORDION */}
                            <Accordion type="single" collapsible className="w-full border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm">
                                <AccordionItem value="traceability" className="border-b-0">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-100 transition-colors rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="w-6 h-6 text-blue-600" />
                                            <span className="font-bold text-slate-800 text-lg">View Calculation Traceability</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6 pt-2">
                                        <div className="rounded-lg border border-slate-200 overflow-hidden shadow-inner">
                                            <div className="bg-slate-200/50 p-3 grid grid-cols-12 text-[10px] font-black uppercase text-slate-600 border-b border-slate-200 tracking-widest">
                                                <div className="col-span-6 pl-2">Task Scope</div>
                                                <div className="col-span-2 text-right">Mins/Visit</div>
                                                <div className="col-span-4 text-right pr-2">TSV Target Row</div>
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto bg-white">
                                                {quote.traceabilityLog.map((log: any, i: number) => (
                                                    <div key={i} className={`p-4 grid grid-cols-12 text-sm border-b border-slate-100 last:border-0 items-center transition-colors hover:bg-slate-50 ${log.status === 'NEEDS_INPUT' ? 'bg-red-50/50' : ''}`}>
                                                        <div className="col-span-6 font-semibold text-slate-700 flex items-center gap-3">
                                                            {log.status === 'NEEDS_INPUT' ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> : <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>}
                                                            {log.task}
                                                        </div>
                                                        <div className="col-span-2 text-right text-slate-500 font-mono font-medium">
                                                            {log.minutes || '--'}
                                                        </div>
                                                        <div className="col-span-4 text-right text-[11px] text-slate-400 truncate" title={log.reason || log.sourceRef}>
                                                            {log.status === 'NEEDS_INPUT' ? (
                                                                <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded-md">MISSING TSV</span>
                                                            ) : (
                                                                log.sourceRef
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>

                        <CardFooter className="bg-slate-50 p-8 border-t border-slate-200 flex justify-end">
                            {isClient && (
                                <PDFDownloadLink
                                    document={<ProposalPDF quote={quote} />}
                                    fileName={`CleaningPro_Quote_${sqft}sqft.pdf`}
                                    className="w-full sm:w-auto"
                                >
                                    {/* @ts-ignore */}
                                    {({ blob, url, loading: pdfLoading, error }) => (
                                        <Button size="lg" className="w-full font-bold text-lg h-14 px-8 bg-blue-700 hover:bg-blue-800 text-white shadow-xl shadow-blue-700/30 rounded-xl transition-all hover:scale-105 active:scale-95" disabled={pdfLoading}>
                                            {pdfLoading ? "Generating Document..." : (
                                                <>
                                                    <Download className="w-5 h-5 mr-3" />
                                                    Generate PDF Quote
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            )}
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="border-slate-200 shadow-xl h-full min-h-[500px] flex items-center justify-center bg-white rounded-2xl">
                        <div className="flex flex-col items-center text-slate-400">
                            <Calculator className="w-24 h-24 mb-6 text-slate-200" />
                            <p className="text-xl font-medium tracking-tight">Awaiting facility details...</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
