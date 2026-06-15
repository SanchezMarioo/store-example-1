export default function AuthSidePanel() {
  return (
    <section className="hidden flex-col justify-between bg-graphite p-12 lg:flex">
      <p className="font-display text-5xl uppercase leading-[0.9] tracking-tight text-bone xl:text-6xl">
        Sin temporadas.
        <br />
        Solo drops.
      </p>
      <div className="flex flex-col gap-6">
        <span className="h-2 w-24 bg-acid" />
        <p className="text-caption font-bold uppercase tracking-widest text-zinc-soft">
          Cosido en Europa. Curtido en el asfalto.
        </p>
      </div>
    </section>
  )
}
