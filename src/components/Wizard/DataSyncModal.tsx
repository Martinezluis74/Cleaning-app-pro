"use client";

import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DataSyncModal() {
    const { state, setState } = useWizard();
    const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setStatus('ready');
        setMessage(`Listo para cargar: ${file.name}`);
    };

    const processFile = async () => {
        if (!selectedFile) {
            setStatus('error');
            setMessage('Por favor, selecciona un archivo primero.');
            return;
        }

        setStatus('processing');
        setMessage('Extrayendo Bundle...');

        try {
            const zip = await JSZip.loadAsync(selectedFile);
            let extractedTasks: Array<{ taskId: string; priceValue: number }> = [];

            const allFiles = Object.keys(zip.files);
            console.log("Archivos encontrados en el ZIP:", allFiles);

            // Look for DimTask flexibly (stripping underscores so DIM_TASK matches dimtask)
            const taskFile = allFiles.find(name => {
                const cleanName = name.toLowerCase().replace(/_/g, '');
                const isCorrectExtension = cleanName.endsWith('.tsv') || cleanName.endsWith('.csv') || cleanName.endsWith('.txt');
                return cleanName.includes('dimtask') && isCorrectExtension && !zip.files[name].dir;
            });

            // Aligned hook for Inventory (optional extraction as requested by the user's logic rule)
            const inventoryFile = allFiles.find(name => {
                const cleanName = name.toLowerCase().replace(/_/g, '');
                const isExt = cleanName.endsWith('.tsv') || cleanName.endsWith('.csv') || cleanName.endsWith('.txt');
                return cleanName.includes('inventory') && isExt && !zip.files[name].dir;
            });

            if (taskFile) {
                const textContent = await zip.files[taskFile].async('text');
                const parsed = Papa.parse(textContent, { header: true, skipEmptyLines: true });

                parsed.data.forEach((row: any) => {
                    // Sanitize keys to handle "ProductionRate", "Production_Rate", "Production Rate"
                    const cleanRow: any = {};
                    Object.keys(row).forEach(k => {
                        const cleanKey = k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        cleanRow[cleanKey] = row[k];
                    });

                    // Handle multiple variations for Task ID
                    const taskId = cleanRow['taskid']?.toString().trim() ||
                        cleanRow['task']?.toString().trim() ||
                        cleanRow['id']?.toString().trim();

                    // Handle multiple variations for Production Rate
                    const rawRate = cleanRow['productionrate'] ||
                        cleanRow['rate'] ||
                        cleanRow['laborrate'];

                    if (taskId && rawRate !== undefined) {
                        // Clean the string before parsing a float (e.g. if it has "$15.5" -> 15.5)
                        const numericRate = parseFloat(rawRate.toString().replace(/[^0-9.]/g, ''));

                        if (!isNaN(numericRate)) {
                            extractedTasks.push({
                                taskId: taskId,
                                priceValue: numericRate
                            });
                        }
                    }
                });

                if (extractedTasks.length > 0) {
                    setState((prev: any) => ({
                        ...prev,
                        pricingModel: {
                            ...prev.pricingModel,
                            taskPrices: extractedTasks,
                            assumptions: prev.pricingModel?.assumptions || []
                        }
                    }));

                    setStatus('success');
                    setMessage(`Success! ${extractedTasks.length} tasks loaded 🎉`);
                } else {
                    setStatus('error');
                    setMessage(`El archivo ${taskFile} fue encontrado pero no contenía datos de tarifas de labor legibles.`);
                }
            } else {
                setStatus('error');
                setMessage('No se encontró ningún archivo DimTask (.tsv, .csv, .txt) en el ZIP. Revisa la consola para ver qué archivos hay.');
            }

        } catch (error) {
            console.error("Sync Error:", error);
            setStatus('error');
            setMessage('Error procesando el archivo ZIP. Verifique que no esté corrupto.');
        }
    };

    return (
        <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-sm mb-8 space-y-4">
            <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-widest">Configuración de Lógica</h3>
                <p className="text-sm font-bold text-slate-700">Selecciona el ZIP que contiene DimTask.tsv, Inventory.tsv, etc. para crear una nueva versión activa de lógica de precios.</p>
            </div>

            <div className={`relative border-4 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${status === 'error' ? 'border-red-600 bg-red-50' :
                status === 'success' ? 'border-green-600 bg-green-50' :
                    status === 'ready' ? 'border-black bg-slate-100' :
                        'border-black bg-slate-50 hover:bg-slate-100'
                }`}>
                <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={status === 'processing' || status === 'success'}
                />

                {(status === 'idle' || status === 'ready') && (
                    <>
                        <UploadCloud className="w-12 h-12 text-black mb-3" />
                        <span className="font-black text-black text-lg uppercase tracking-widest">
                            {status === 'ready' ? message : 'Upload Dataset Bundle (.zip)'}
                        </span>
                        <span className="text-xs font-bold text-slate-600 mt-2">Haz clic aquí o arrastra un archivo</span>
                    </>
                )}

                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="font-black text-black text-lg uppercase">Processing...</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center text-green-700">
                        <CheckCircle2 className="w-12 h-12 mb-3" />
                        <span className="font-black text-xl uppercase tracking-widest">DATA SYNCED SUCCESSFULLY</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center text-red-700">
                        <AlertCircle className="w-12 h-12 mb-3" />
                        <span className="font-black text-xl uppercase tracking-widest text-center">{message}</span>
                    </div>
                )}
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={processFile}
                disabled={status === 'idle' || status === 'processing' || status === 'success' || status === 'error'}
                className={`w-full font-black uppercase tracking-widest text-lg p-4 rounded-xl border-4 shadow-lg transition-transform ${status === 'ready'
                    ? 'bg-black text-white hover:bg-slate-800 border-black active:scale-95 cursor-pointer'
                    : status === 'processing'
                        ? 'bg-slate-800 text-white border-black cursor-not-allowed opacity-80'
                        : 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-50'
                    }`}
            >
                {status === 'processing' ? 'Processing...' : status === 'success' ? 'DATA SYNCED SUCCESSFULLY' : 'Upload and Sync Data'}
            </button>
        </div>
    );
}
