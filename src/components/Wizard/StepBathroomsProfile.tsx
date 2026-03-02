"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RestroomGroup } from '@/types/wizard';

export default function StepBathroomsProfile() {
    const { state, updateSite } = useWizard();
    const { site } = state;
    const restrooms = site.restrooms || [];

    const addRestroom = () => {
        const newGroup: RestroomGroup = {
            id: Date.now().toString(),
            name: `Baño ${restrooms.length + 1}`,
            toilets: 0,
            urinals: 0,
            sinks: 0,
            trafficLevel: 'Low',
            restockingOnly: false
        };
        updateSite({ restrooms: [...restrooms, newGroup] });
    };

    const removeRestroom = (id: string) => {
        updateSite({ restrooms: restrooms.filter(r => r.id !== id) });
    };

    const updateGroup = (id: string, field: keyof RestroomGroup, value: any) => {
        updateSite({
            restrooms: restrooms.map(r => r.id === id ? { ...r, [field]: value } : r)
        });
    };

    return (
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 3: Auditoría de Higiene y Baños</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Agrupa los baños por conjuntos (ej. Hombres L1, Mujeres Ejecutivo). Define el nivel de tráfico para ajustar el tiempo dinámico de limpieza.
                </CardDescription>
            </div>

            <div className="space-y-4">
                <Label className="text-black font-black uppercase tracking-widest text-lg border-b-2 border-black pb-2 block">
                    1. Inventario de Baños (Restroom Sets)
                </Label>

                <div className="space-y-3">
                    {restrooms.map((group) => (
                        <div key={group.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white border-2 border-black rounded-lg shadow-sm items-end">
                            {/* Name */}
                            <div className="md:col-span-3 space-y-1">
                                <Label className="text-xs font-black uppercase">Nombre / Ubicación</Label>
                                <Input
                                    className="border-2 border-black font-bold h-10"
                                    value={group.name}
                                    onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                                />
                            </div>

                            {/* Fixtures */}
                            <div className="md:col-span-1 space-y-1">
                                <Label className="text-xs font-black uppercase">Toilets</Label>
                                <Input type="number" min="0" className="border-2 border-black font-bold h-10 text-center"
                                    value={group.toilets || ''}
                                    onChange={(e) => updateGroup(group.id, 'toilets', Number(e.target.value) || 0)} />
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <Label className="text-xs font-black uppercase">Urinal</Label>
                                <Input type="number" min="0" className="border-2 border-black font-bold h-10 text-center"
                                    value={group.urinals || ''}
                                    onChange={(e) => updateGroup(group.id, 'urinals', Number(e.target.value) || 0)} />
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <Label className="text-xs font-black uppercase">Sinks</Label>
                                <Input type="number" min="0" className="border-2 border-black font-bold h-10 text-center"
                                    value={group.sinks || ''}
                                    onChange={(e) => updateGroup(group.id, 'sinks', Number(e.target.value) || 0)} />
                            </div>

                            {/* Modifiers */}
                            <div className="md:col-span-2 space-y-1">
                                <Label className="text-xs font-black uppercase text-blue-800">Tráfico</Label>
                                <Select value={group.trafficLevel} onValueChange={(val) => updateGroup(group.id, 'trafficLevel', val)}>
                                    <SelectTrigger className="border-2 border-blue-900 font-bold h-10 bg-blue-50 text-blue-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Bajo (x1.0)</SelectItem>
                                        <SelectItem value="Medium">Medio (x1.15)</SelectItem>
                                        <SelectItem value="High">Alto (x1.30)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-1 flex flex-col justify-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer border-2 border-slate-300 p-2 rounded h-10 bg-slate-50 hover:bg-slate-100">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-black"
                                        checked={group.restockingOnly}
                                        onChange={(e) => updateGroup(group.id, 'restockingOnly', e.target.checked)}
                                    />
                                    <span className="text-xs font-bold uppercase whitespace-nowrap">Solo Repone (-80%)</span>
                                </label>
                            </div>

                            {/* Delete */}
                            <div className="md:col-span-2 flex justify-end">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeRestroom(group.id)}
                                    className="h-10 w-10 border-2 border-red-900 flex-shrink-0"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={addRestroom}
                        variant="outline"
                        className="w-full border-2 border-dashed border-black h-12 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Agregar Grupo de Baños
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-black font-black uppercase tracking-widest text-lg border-b-2 border-black pb-2 block">
                    2. Otros Accesorios Globales & Basura
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border-2 border-black rounded-xl shadow-sm">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase text-black whitespace-nowrap">Duchas (Showers)</Label>
                        <Input
                            type="number" min="0" placeholder="0"
                            value={state.site.fixtures?.showers || 0}
                            onChange={e => updateSite({
                                fixtures: {
                                    ...(state.site.fixtures || { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 }),
                                    showers: Number(e.target.value) || 0
                                }
                            })}
                            className="h-16 text-center text-3xl bg-white border-2 border-black shadow-sm font-black text-black focus-visible:ring-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase text-black block">Canecas de Basura</Label>
                        <Input
                            type="number" min="0" placeholder="Ej. 10"
                            value={state.site.trashCans || 0}
                            onChange={e => updateSite({ trashCans: Number(e.target.value) || 0 })}
                            className="h-16 text-center text-3xl bg-white border-2 border-black shadow-sm font-black text-black focus-visible:ring-black"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
