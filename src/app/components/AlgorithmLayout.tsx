import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  Gauge,
  Home,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { algorithmCatalog } from "../data/catalog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";

interface AlgorithmLayoutProps {
  title: string;
  children: ReactNode;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBack?: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  complexity?: {
    time: string;
    space: string;
  };
  description?: string;
  code?: string;
}

export default function AlgorithmLayout({
  title,
  children,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  speed,
  onSpeedChange,
  complexity,
  description,
  code,
}: AlgorithmLayoutProps) {
  const location = useLocation();
  const activeCategory = algorithmCatalog.find((category) =>
    category.algorithms.some((algorithm) => algorithm.path === location.pathname),
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_28%,_#e2e8f0_28%,_#f8fafc_100%)]">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Home className="mr-2 size-4" />
                  Home
                </Button>
              </Link>
              {activeCategory ? (
                <Badge className="border-white/10 bg-white/10 text-slate-100">
                  {activeCategory.title}
                </Badge>
              ) : null}
            </div>
            {complexity ? (
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge className="border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-emerald-100">
                  Time: {complexity.time}
                </Badge>
                <Badge className="border-sky-300/30 bg-sky-400/10 px-3 py-1 text-sky-100">
                  Space: {complexity.space}
                </Badge>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            {description ? (
              <p className="max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card className="border-white/10 bg-slate-900/90 text-white shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {onStepBack ? (
                  <Button variant="outline" size="sm" onClick={onStepBack} disabled={isPlaying} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <SkipBack className="size-4" />
                  </Button>
                ) : null}
                {isPlaying ? (
                  <Button size="sm" onClick={onPause} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                    <Pause className="mr-2 size-4" />
                    Pause
                  </Button>
                ) : (
                  <Button size="sm" onClick={onPlay} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                    <Play className="mr-2 size-4" />
                    Play
                  </Button>
                )}
                {onStepForward ? (
                  <Button variant="outline" size="sm" onClick={onStepForward} disabled={isPlaying} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <SkipForward className="size-4" />
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" onClick={onReset} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <RotateCcw className="mr-2 size-4" />
                  Reset
                </Button>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <Gauge className="size-4" />
                    Playback speed
                  </span>
                  <span className="font-medium text-white">{speed}x</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(values) => onSpeedChange(values[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          {activeCategory ? (
            <Card className="border-slate-200 bg-white/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-950">{activeCategory.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeCategory.algorithms.map((algorithm) => {
                  const isActive = algorithm.path === location.pathname;

                  return (
                    <Link
                      key={algorithm.path}
                      to={algorithm.path}
                      className={`block rounded-xl border px-4 py-3 transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-medium">{algorithm.name}</p>
                      <p className={`mt-1 text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                        {algorithm.blurb}
                      </p>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </aside>

        <section className="min-w-0">
          <Card className="border-slate-200 bg-white/90 shadow-lg shadow-slate-200/60">
            <CardContent className="p-5 sm:p-6">{children}</CardContent>
          </Card>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {code ? (
            <Card className="overflow-hidden border-slate-950 bg-slate-950 text-slate-100 shadow-xl">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-base text-white">Reference Code</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="max-h-[560px] overflow-auto p-4 text-xs leading-6 text-slate-300">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </main>
    </div>
  );
}
