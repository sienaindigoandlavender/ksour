interface Props {
  html: string;
}

export default function EntityBody({ html }: Props) {
  if (!html?.trim()) return null;
  return (
    <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
