import React from 'react';

interface ToolbarProps {
    url: string;
    onUrlChange: (url: string) => void;
    layout: 'grid' | 'tab';
    onToggleLayout: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    fitToWidth: boolean;
    onToggleFitToWidth: () => void;
    onSavePreset: () => void;
    onOpenPresetModal: () => void;
    onToggleSettings: () => void;
}


const Toolbar: React.FC<ToolbarProps> = ({
                                             url,
                                             onUrlChange,
                                             layout,
                                             onToggleLayout,
                                             isDarkMode,
                                             onToggleDarkMode,
                                             fitToWidth,
                                             onToggleFitToWidth,
                                             onSavePreset,
                                             onOpenPresetModal,
                                             onToggleSettings,
                                         }) => {
    return (
        <div
            className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-4 flex flex-wrap items-center gap-3">
            <input
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 min-w-[200px] border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />

            <button
                onClick={onToggleLayout}
                className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
                {layout === 'grid' ? '🧱 Tabs' : '📐 Grid'}
            </button>

            <button
                onClick={onToggleDarkMode}
                className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
            >
                {isDarkMode ? '🌞 Light' : '🌙 Dark'}
            </button>

            {/*<label className="flex items-center gap-1 text-sm">*/}
            {/*    <input*/}
            {/*        type="checkbox"*/}
            {/*        checked={fitToWidth}*/}
            {/*        onChange={onToggleFitToWidth}*/}
            {/*    />*/}
            {/*    Fit to Width*/}
            {/*</label>*/}

            <button
                onClick={onSavePreset}
                className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
                💾 Save
            </button>

            <button
                onClick={onOpenPresetModal}
                className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
                📁 Presets
            </button>
            <button
                onClick={onToggleSettings}
                className="px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
                ⚙️ Settings
            </button>

        </div>
    );
};

export default Toolbar;
