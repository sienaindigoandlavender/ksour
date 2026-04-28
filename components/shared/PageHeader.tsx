interface Props {
  eyebrow?: string;
  title: string;
  dek?: string;
}

export default function PageHeader({ eyebrow, title, dek }: Props) {
  return (
    <header className="rule-bottom">
      <div className="mx-auto max-w-page px-6 py-16 md:py-24">
        {eyebrow ? <p className="meta mb-6">{eyebrow}</p> : null}
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-3xl">
          {title}
        </h1>
        {dek ? (
          <p className="mt-6 max-w-2xl text-lg text-secondary leading-relaxed">
            {dek}
          </p>
        ) : null}
      </div>
    </header>
  );
}
