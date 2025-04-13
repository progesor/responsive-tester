export interface DevicePreset {
    id: string;
    name: string;
    width: number;
    height: number;
    isLandscape?: boolean;
    zoom?: number;
}

export interface LayoutPreset {
    name: string;
    url: string;
    layout: 'grid' | 'tab';
    fitToWidth: boolean;
    devices: DevicePreset[];
}


export const defaultDevices: DevicePreset[] = [
    { id: 'widescreen', name: 'Widescreen', width: 1920, height: 1080 },
    { id: 'desktop', name: 'Desktop', width: 1440, height: 900 },
    { id: 'laptop', name: 'Laptop', width: 1366, height: 768 },
    { id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
    { id: 'mobile', name: 'Mobile', width: 375, height: 667 },
];
