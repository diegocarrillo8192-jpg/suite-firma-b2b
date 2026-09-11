import { Link2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Field from "@/components/ui/Field";
import type { SignatureData } from "@/lib/templates";
import CardHeader from "./CardHeader";
import type { SetSignatureField } from "./types";

export default function SocialFields({
  data,
  onField,
}: {
  data: SignatureData;
  onField: SetSignatureField;
}) {
  return (
    <GlassCard>
      <CardHeader icon={Link2} title="Redes sociales" />
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        <Field
          label="LinkedIn"
          value={data.linkedin}
          onChange={(v) => onField("linkedin", v)}
          placeholder="linkedin.com/in/usuario"
        />
        <Field
          label="Instagram"
          value={data.instagram}
          onChange={(v) => onField("instagram", v)}
          placeholder="instagram.com/usuario"
        />
        <Field
          label="Facebook"
          value={data.facebook}
          onChange={(v) => onField("facebook", v)}
          placeholder="facebook.com/usuario"
        />
        <Field
          label="X / Twitter"
          value={data.twitter}
          onChange={(v) => onField("twitter", v)}
          placeholder="x.com/usuario"
        />
      </div>
    </GlassCard>
  );
}
