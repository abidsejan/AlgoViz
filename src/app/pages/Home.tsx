import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Code2, Github, Layers3, Linkedin, Sparkles } from "lucide-react";
import { algorithmCatalog, algorithmCount } from "../data/catalog";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function Home() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filteredCatalog = algorithmCatalog
    .map((category) => ({
      ...category,
      algorithms: category.algorithms.filter((algorithm) => {
        if (!normalized) {
          return true;
        }

        return [algorithm.name, algorithm.blurb, category.title]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      }),
    }))
    .filter((category) => category.algorithms.length > 0);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f4fbff_0%,_#ecf8ff_24%,_#f8fbfd_48%,_#ffffff_100%)]">
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
      `}</style>
      <header className="border-b border-white/10 bg-[#091525]/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-white">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <Layers3 className="size-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100">AlgoViz</p>
              <h1 className="text-xl font-semibold text-white">Interactive Algorithm Explorer</h1>
            </div>
          </div>
          <Badge className="border-white/20 bg-white/10 px-3 py-1 text-slate-100">
            {algorithmCount} visual modules
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-3 sm:px-6 lg:px-8">
        <section className="relative mt-1 grid gap-6 overflow-hidden rounded-[2.6rem] bg-[linear-gradient(135deg,_#081321_0%,_#0b1c33_52%,_#123853_100%)] px-6 py-9 shadow-[0_30px_80px_rgba(8,19,33,0.18)] lg:grid-cols-[1.18fr_0.82fr] lg:px-10 lg:py-11">
          <div
            className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl"
            style={{ animation: "heroGlow 7s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute bottom-4 right-10 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
            style={{ animation: "heroGlow 8s ease-in-out infinite" }}
          />

          <div className="space-y-6 text-white" style={{ animation: "heroFadeUp 560ms ease-out both" }}>
            <Badge
              className="w-fit rounded-2xl border-cyan-300/30 bg-cyan-400/14 px-4 py-2 text-cyan-50 shadow-[0_0_0_1px_rgba(56,189,248,0.08)]"
              style={{ animation: "heroFloat 5s ease-in-out infinite" }}
            >
              <Sparkles className="size-3.5" />
              Search, sort, graph, DP, structures, and trees
            </Badge>
            <div className="space-y-5">
              <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.045em] text-white sm:text-[5.6rem] sm:leading-[0.94]">
                Learn algorithms through precise simulations, cleaner visuals, and better structure.
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                AlgoViz is organized like a premium visual reference: category-first navigation, rich
                control panels, and step-by-step modules across searching, sorting, graphs, dynamic
                programming, linear structures, and trees.
              </p>
            </div>
          </div>

          <Card
            className="border-white/10 bg-[#0c182a]/94 text-white shadow-2xl shadow-slate-950/35 backdrop-blur"
            style={{ animation: "heroFadeUp 720ms ease-out both" }}
          >
            <CardContent className="space-y-6 p-7 lg:p-8">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.34em] text-slate-300">Quick Access</p>
                <h3 className="text-[2.1rem] font-semibold tracking-tight text-white">Find a visualizer</h3>
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search algorithms, data structures, or topics"
                className="h-14 rounded-2xl border-white/10 bg-white/10 px-5 text-lg text-white placeholder:text-slate-400"
              />
              <div className="grid grid-cols-2 gap-4">
                {algorithmCatalog.map((category, index) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 text-left transition hover:bg-white/10"
                    style={{
                      animation: "heroFadeUp 760ms ease-out both",
                      animationDelay: `${index * 45}ms`,
                    }}
                  >
                    <p className="text-base font-semibold">{category.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{category.algorithms.length} items</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8 pb-10 pt-10">
          {filteredCatalog.map((category) => {
            const Icon = category.icon;

            return (
              <section key={category.id} id={category.id} className="scroll-mt-24">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-950">{category.title}</h3>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden rounded-full border-slate-300 bg-white px-3 py-1 text-slate-700 shadow-sm md:inline-flex">
                    {category.algorithms.length} modules
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {category.algorithms.map((algorithm) => (
                    <Link key={algorithm.path} to={algorithm.path} className="group">
                      <Card className={`h-full border ${category.surface} bg-white/96 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl`}>
                        <CardContent className="flex h-full flex-col gap-4 p-6">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-950">{algorithm.name}</h4>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{algorithm.blurb}</p>
                            </div>
                            {algorithm.complexity ? (
                              <Badge variant="outline" className="rounded-full border-slate-300 bg-slate-50 text-slate-700 shadow-sm">
                                {algorithm.complexity}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-auto flex items-center gap-2 text-sm font-medium text-slate-900">
                            Open visualizer
                            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {filteredCatalog.length === 0 ? (
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <Code2 className="size-10 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-900">No matches found</h3>
                <p className="max-w-md text-sm text-slate-600">
                  Try a broader search like <span className="font-medium">graph</span>,{" "}
                  <span className="font-medium">queue</span>, or{" "}
                  <span className="font-medium">sort</span>.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <footer className="mt-16 rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-950">Made by Abid Hasan</p>
              <p className="text-sm text-slate-600">Copyright reserved ©. AlgoViz project showcase and algorithm visual learning workspace.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/abidsejan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Github className="size-4" />
                 GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/abidsejan/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Linkedin className="size-4" />
                 LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
