import type { SignatureData } from "@/lib/templates";

export type SetSignatureField = <K extends keyof SignatureData>(
  key: K,
  value: SignatureData[K],
) => void;
