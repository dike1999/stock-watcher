/// <reference types="vite/client" />

interface ElectronAPI {
  ipcRenderer: {
    on(
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
    ): void;
    off(
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
    ): void;
    send(channel: string, ...args: unknown[]): void;
    invoke(channel: string, ...args: unknown[]): Promise<unknown>;
  };
}

declare global {
  interface Window {
    ipcRenderer: ElectronAPI['ipcRenderer'];
  }
}

export {};
