import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { DevicePreset, defaultDevices } from '../types/devices';
import usePersistedState from '../hooks/usePersistedState';
import Toolbar from '../components/Toolbar';
import CustomDeviceForm from '../components/CustomDeviceForm';
import DeviceRenderer from '../components/DeviceRenderer';
import PresetModal from "../components/PresetModal";
import SettingsPanel from '../components/SettingsPanel';
import toast from "react-hot-toast";

interface LayoutPreset {
    name: string;
    url: string;
    layout: 'grid' | 'tab';
    fitToWidth: boolean;
    devices: DevicePreset[];
}

const PreviewPage: React.FC = () => {
    const [url, setUrl] = usePersistedState('responsive-url', 'https://example.com');
    const [layout, setLayout] = usePersistedState<'grid' | 'tab'>('responsive-layout', 'grid');
    const [devices, setDevices] = usePersistedState<DevicePreset[]>('responsive-devices', defaultDevices);
    const [fitToWidth, setFitToWidth] = useState(false);
    const [activeTab, setActiveTab] = useState(devices[0]?.id || '');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [presets, setPresets] = usePersistedState<LayoutPreset[]>('responsive-presets', []);
    const [lastUsedPreset, setLastUsedPreset] = usePersistedState<string | null>('responsive-last-preset', null);
    const [showPresetModal, setShowPresetModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [defaultZoom, setDefaultZoom] = usePersistedState<number>('default-zoom', 1);
    const [autoReload, setAutoReload] = usePersistedState<boolean>('responsive-auto-reload', false);

    // Ensure active tab always refers to an existing device
    useEffect(() => {
        if (!devices.some((d) => d.id === activeTab)) {
            setActiveTab(devices[0]?.id || '');
        }
    }, [devices, activeTab]);



    // Auto-restore last used preset
    useEffect(() => {
        if (lastUsedPreset && presets.length > 0) {
            const preset = presets.find((p) => p.name === lastUsedPreset);
            if (preset) {
                setUrl(preset.url);
                setLayout(preset.layout);
                setFitToWidth(preset.fitToWidth);
                setDevices(preset.devices);
            }
        }
    }, []);

    // Theme toggle
    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    // Device Actions
    const rotateDevice = (id: string) => {
        setDevices((prev) =>
            prev.map((dev) =>
                dev.id === id ? { ...dev, isLandscape: !dev.isLandscape } : dev
            )
        );
    };

    const removeDevice = (id: string) => {
        setDevices((prev) => prev.filter((dev) => dev.id !== id));
    };

    const updateZoom = (id: string, zoom: number) => {
        setDevices((prev) =>
            prev.map((dev) => (dev.id === id ? { ...dev, zoom } : dev))
        );
    };

    const addDevice = (preset: DevicePreset) => {
        const newId = `${preset.id}-${nanoid(5)}`;
        setDevices((prev) => [
            ...prev,
            { ...preset, id: newId, zoom: defaultZoom },
        ]);
    };

    // Preset Actions
    const saveCurrentPreset = () => {
        const name = prompt('Enter a name for this preset:');
        if (!name) return;
        const newPreset: LayoutPreset = {
            name,
            url,
            layout,
            fitToWidth,
            devices,
        };
        setPresets((prev) => [...prev.filter((p) => p.name !== name), newPreset]);
    };

    const loadPreset = (name: string) => {
        const selected = presets.find((p) => p.name === name);
        if (selected) {
            setUrl(selected.url);
            setLayout(selected.layout);
            setFitToWidth(selected.fitToWidth);
            setDevices(selected.devices);
            setActiveTab(selected.devices[0]?.id || '');
            setLastUsedPreset(name);
        }
    };

    const renamePreset = (oldName: string) => {
        const newName = prompt('Enter new name:', oldName);
        if (!newName || oldName === newName) return;
        setPresets((prev) =>
            prev.map((p) => (p.name === oldName ? { ...p, name: newName } : p))
        );
        if (lastUsedPreset === oldName) setLastUsedPreset(newName);
    };

    const deletePreset = (name: string) => {
        if (!confirm(`Delete preset "${name}"?`)) return;
        setPresets((prev) => prev.filter((p) => p.name !== name));
        if (lastUsedPreset === name) setLastUsedPreset(null);
    };

    const exportPreset = (preset: LayoutPreset) => {
        const data = JSON.stringify(preset, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${preset.name}.json`;
        link.click();
    };

    const handleImportPreset = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string) as LayoutPreset;
                if (!parsed.name || !parsed.devices || !parsed.layout || !parsed.url) {
                    // alert('Invalid preset file.');
                    toast.error('Invalid preset file.');
                    return;
                }

                const existing = presets.find(p => p.name === parsed.name);
                let finalName = parsed.name;

                if (existing) {
                    const renamed = prompt(`A preset named "${parsed.name}" already exists. Enter a new name:`, `${parsed.name}-copy`);
                    if (!renamed) return;
                    finalName = renamed;
                }

                const newPreset = { ...parsed, name: finalName };
                setPresets((prev) => [...prev.filter(p => p.name !== finalName), newPreset]);
                // alert(`Preset "${finalName}" imported!`);
                toast.success(`Preset "${finalName}" imported!`);
            } catch (e) {
                // alert('Error reading preset file.');
                toast.error('Error reading preset file.');
            }
        };

        reader.readAsText(file);
    };

    const resetAll = () => {
        if (confirm('Are you sure you want to reset all settings?')) {
            localStorage.clear();
            window.location.reload();
        }
    };


    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
            <Toolbar
                url={url}
                onUrlChange={setUrl}
                layout={layout}
                onToggleLayout={() => setLayout(layout === 'grid' ? 'tab' : 'grid')}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                fitToWidth={fitToWidth}
                onToggleFitToWidth={() => setFitToWidth(!fitToWidth)}
                onSavePreset={saveCurrentPreset}
                onOpenPresetModal={() => setShowPresetModal(true)}
                onToggleSettings={() => setShowSettings((prev) => !prev)}

            />

            {showSettings && (
                <div className="p-4">
                    <SettingsPanel
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={toggleDarkMode}
                        fitToWidth={fitToWidth}
                        onToggleFitToWidth={() => setFitToWidth(!fitToWidth)}
                        defaultZoom={defaultZoom}
                        onSetDefaultZoom={setDefaultZoom}
                        autoReload={autoReload}
                        onToggleAutoReload={() => setAutoReload(!autoReload)}
                        onResetAll={resetAll}
                    />
                </div>
            )}

            <DeviceRenderer
                layout={layout}
                devices={devices}
                activeTabId={activeTab}
                url={url}
                fitToWidth={fitToWidth}
                autoReload={autoReload}
                onRotate={rotateDevice}
                onRemove={removeDevice}
                onZoomChange={updateZoom}
                onSelectTab={setActiveTab}
            />

            <div className="p-4">
                <h3 className="text-sm font-medium mb-2">Add Device</h3>
                <div className="flex gap-2 flex-wrap mb-6">
                    {defaultDevices.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => addDevice(preset)}
                            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            ➕ {preset.name}
                        </button>
                    ))}
                </div>

                <CustomDeviceForm
                    defaultZoom={defaultZoom}
                    onAddDevice={({ name, width, height }) => {
                        const newDevice: DevicePreset = {
                            id: `custom-${name}-${nanoid(5)}`,
                            name,
                            width,
                            height,
                            zoom: defaultZoom, // ✅ Use it here
                        };
                        setDevices((prev) => [...prev, newDevice]);
                    }}
                />

            </div>

            <PresetModal
                isOpen={showPresetModal}
                onClose={() => setShowPresetModal(false)}
                presets={presets}
                onLoad={(name) => {
                    loadPreset(name);
                    setShowPresetModal(false);
                }}
                onRename={renamePreset}
                onDelete={deletePreset}
                onExport={exportPreset}
                onImportFile={handleImportPreset}
            />

        </div>
    );
};

export default PreviewPage;
