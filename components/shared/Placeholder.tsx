interface Props {
  note?: string;
}

export default function Placeholder({ note }: Props) {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <p className="meta mb-3">Status</p>
      <p className="text-secondary leading-relaxed">
        {note ?? "This section is scaffolded. Content will be populated from the Supabase corpus once seed data is loaded."}
      </p>
    </div>
  );
}
