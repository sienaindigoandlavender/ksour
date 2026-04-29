import { jsonLdScript } from "@/lib/schema-org";

interface Props {
  data: object;
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLdScript(data)}
    />
  );
}
