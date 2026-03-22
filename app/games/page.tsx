import Link from "next/link";

const games = [
  {
    id: "triumvirate-arena",
    title: "Triumvirate Arena",
    subtitle: "a tactics game about balance and power",
    year: "2025",
  },
  {
    id: "odins-passage",
    title: "Odin's Passage",
    subtitle: "a journey through shifting realms",
    year: "2024",
  },
  // Add more games here as you make them
];

export default function GamesPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-2xl font-louize">games</h1>
        <p className="text-sm font-fe max-w-prose">
          small worlds, tactics, and little experiments in play. use the links
          below to jump to a specific game.
        </p>

        {/* In-page links / table of contents */}
        <nav className="mt-4">
          <ul className="flex flex-wrap gap-3 text-sm font-fe">
            {games.map((game) => (
              <li key={game.id}>
                <Link
                  href={`#${game.id}`}
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  #{game.id}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="space-y-16">
        {games.map((game) => (
          <section
            key={game.id}
            id={game.id}
            className="scroll-mt-24 border-t border-dashed border-amber-200 pt-8 space-y-3"
          >
            <h2 className="text-xl font-louize">{game.title}</h2>
            <p className="text-xs font-fe uppercase tracking-wide text-amber-200/80">
              {game.year}
            </p>
            <p className="text-sm font-fe">{game.subtitle}</p>

            {/* Placeholder for future embeds / iframes / screenshots */}
            <div className="mt-4 rounded-xl border border-dashed border-amber-200/60 p-4 text-xs font-fe text-amber-100/80">
              game details, gifs, or an embed can live here.
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

