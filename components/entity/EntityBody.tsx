interface Props {
  html: string;
}

export default function EntityBody({ html }: Props) {
  if (!html.trim()) return null;
  return (
    <div
      className="prose-body text-ink"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
