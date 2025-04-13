import React from 'react';

interface SettingsPanelProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    fitToWidth: boolean;
    onToggleFitToWidth: () => void;
    defaultZoom: number;
    onSetDefaultZoom: (z: number) => void;
    onResetAll: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                         isDarkMode,
                                                         onToggleDarkMode,
                                                         fitToWidth,
                                                         onToggleFitToWidth,
                                                         defaultZoom,
                                                         onSetDefaultZoom,
                                                         onResetAll,
                                                     }) => {
    return (
        <div className="p-4 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <h2 className="text-md font-semibold mb-4 text-black dark:text-white">⚙️ Settings</h2>

            <div className="flex flex-col gap-3 text-sm text-black dark:text-white">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={fitToWidth} onChange={onToggleFitToWidth}/>
                    Fit to Width by Default
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isDarkMode} onChange={onToggleDarkMode}/>
                    Enable Dark Mode
                </label>

                <div className="flex items-center gap-2">
                    <label>Default Zoom:</label>
                    <select
                        value={defaultZoom}
                        onChange={(e) => onSetDefaultZoom(Number(e.target.value))}
                        className="px-2 py-1 rounded border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                    >
                        <option value={0.5}>50%</option>
                        <option value={0.75}>75%</option>
                        <option value={1}>100%</option>
                        <option value={1.25}>125%</option>
                        <option value={1.5}>150%</option>
                    </select>
                </div>
            </div>
            <hr className="my-4 border-gray-300 dark:border-gray-600"/>

            <button
                onClick={onResetAll}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                🔄 Reset All Settings
            </button>

        </div>
    );
};

export default SettingsPanel;
