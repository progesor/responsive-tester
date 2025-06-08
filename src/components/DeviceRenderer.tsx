import React from 'react';
import { DevicePreset } from '../types/devices';
import DeviceFrame from './DeviceFrame';

interface Props {
    layout: 'grid' | 'tab';
    devices: DevicePreset[];
    activeTabId: string;
    url: string;
    fitToWidth: boolean;
    autoReload: boolean;
    onRotate: (id: string) => void;
    onRemove: (id: string) => void;
    onZoomChange: (id: string, zoom: number) => void;
    onSelectTab: (id: string) => void;
}

const DeviceRenderer: React.FC<Props> = ({
                                             layout,
                                             devices,
                                             activeTabId,
                                             url,
                                             fitToWidth,
                                             autoReload,
                                             onRotate,
                                             onRemove,
                                             onZoomChange,
                                             onSelectTab,
                                         }) => {
    if (layout === 'tab') {
        return (
            <>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {devices.map((device) => (
                        <button
                            key={device.id}
                            className={`px-3 py-1 rounded ${
                                activeTabId === device.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                            }`}
                            onClick={() => onSelectTab(device.id)}
                        >
                            {device.name}
                        </button>
                    ))}
                </div>

                {devices
                    .filter((d) => d.id === activeTabId)
                    .map((device) => (
                        <DeviceFrame
                            key={device.id}
                            {...device}
                            url={url}
                            fitToWidth={fitToWidth}
                            autoReload={autoReload}
                            onRotate={() => onRotate(device.id)}
                            onRemove={() => onRemove(device.id)}
                            onZoomChange={(z) => onZoomChange(device.id, z)}
                        />
                    ))}
            </>
        );
    }

    // Grid layout
    return (
        <div className="flex flex-col items-center gap-6">
            {devices.map((device) => (
                <div key={device.id} className="flex justify-center">
                    <DeviceFrame
                        {...device}
                        url={url}
                        fitToWidth={fitToWidth}
                        autoReload={autoReload}
                        onRotate={() => onRotate(device.id)}
                        onRemove={() => onRemove(device.id)}
                        onZoomChange={(z) => onZoomChange(device.id, z)}
                    />
                </div>
            ))}
        </div>
    );
};

export default DeviceRenderer;
