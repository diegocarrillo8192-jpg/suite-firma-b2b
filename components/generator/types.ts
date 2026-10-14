import type { SignatureData, SignatureSettings } from "@/lib/templates";

export type SetField = <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;

export type SetSetting = <K extends keyof SignatureSettings>(key: K, value: SignatureSettings[K]) => void;
