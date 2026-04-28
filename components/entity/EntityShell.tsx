import type { ReactNode } from "react";

interface Props {
  header: ReactNode;
  body: ReactNode;
  side: ReactNode;
}

export default function EntityShell({ header, body, side }: Props) {
  return (
    <article className="mx-auto max-w-page px-6 py-12 md:py-16">
      <div className="max-w-3xl">{header}</div>
      <hr className="mt-10 mb-12 border-rule" />
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-8">{body}</div>
        <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8 space-y-10">
          {side}
        </aside>
      </div>
    </article>
  );
}
