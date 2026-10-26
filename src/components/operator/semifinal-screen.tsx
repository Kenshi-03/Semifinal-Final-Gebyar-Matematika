import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MatchSlot } from "@/lib/mock-data";
import { useTimer } from "@/lib/use-timer";
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  FlagOff,
  MonitorPlay,
  Users,
  Trophy,
} from "lucide-react";

interface SemifinalScreenProps {
  slot: MatchSlot;
  onTimerStart: () => void;
  onTimerPause: () => void;
  onTimerReset: () => void;
  onMatchStart: () => void;
  onMatchEnd: () => void;
  onMatchReset: () => void;
  onScoreChange: (teamId: string, delta: number) => void;
}

export function SemifinalScreen({
  slot,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  onMatchStart,
  onMatchEnd,
  onMatchReset,
  onScoreChange,
}: SemifinalScreenProps) {
  const statusColors = {
    belum_mulai: "bg-gray-500",
    berjalan: "bg-green-500",
    jeda: "bg-yellow-500",
    selesai: "bg-blue-500",
  };

  const timerStatusColors = {
    berhenti: "bg-gray-500",
    berjalan: "bg-green-500",
    jeda: "bg-yellow-500",
  };

  const currentBabak = slot.babaks.find((b) => b.id === slot.current_babak_id);
  const currentRound = currentBabak?.rounds?.find(
    (r) => r.id === slot.current_round_id,
  );

  const { formattedTime, isTimeout } = useTimer({
    initialMs: slot.timer_remaining_ms,
    isRunning: slot.timer_status === "berjalan",
    onTimeout: () => {
      console.log("Timer habis!");
      // Nanti: trigger event server timer_habis
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Informasi Pertandingan */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Layar Operator Semifinal - Slot {slot.slot_number}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola pertandingan slot ini dengan kontrol skor, timer, dan
              babak/ronde
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={`${statusColors[slot.status]} text-white`}
              variant="default"
            >
              {slot.status === "belum_mulai" && "Belum Mulai"}
              {slot.status === "berjalan" && "Berjalan"}
              {slot.status === "jeda" && "Jeda"}
              {slot.status === "selesai" && "Selesai"}
            </Badge>
            <Badge variant="outline">Versi {slot.version}</Badge>
            <Button variant="outline" size="sm" asChild>
              <a href={`/proyektor/semifinal/${slot.id}`} target="_blank" rel="noopener noreferrer">
                <MonitorPlay className="size-4" />
                Buka Proyektor
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Panel 4 Tim Semifinal */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Tim Peserta</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {slot.teams
            .sort((a, b) => a.position - b.position)
            .map((slotTeam) => (
              <Card key={slotTeam.id} className="border-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        #{slotTeam.position}
                      </Badge>
                      <h3 className="font-semibold">
                        {slotTeam.team?.name || "Tim Tidak Dikenal"}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {slotTeam.team?.school || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold tabular-nums ${slotTeam.score < 0 ? "text-red-600" : ""}`}
                    >
                      {slotTeam.score < 0 && "−"}
                      {Math.abs(slotTeam.score)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onScoreChange(slotTeam.team_id, 100)}
                    disabled={slot.status !== "berjalan"}
                  >
                    +100
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onScoreChange(slotTeam.team_id, -50)}
                    disabled={slot.status !== "berjalan"}
                  >
                    −50
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onScoreChange(slotTeam.team_id, -100)}
                    disabled={slot.status !== "berjalan"}
                  >
                    −100
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel Babak & Ronde */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Babak & Ronde</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Babak Aktif</p>
              <p className="text-base font-semibold">
                {currentBabak?.label || "—"}
              </p>
              <Badge variant="secondary" className="mt-1">
                {currentBabak?.format.replace("_", " ").toUpperCase() || "—"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ronde Aktif</p>
              <p className="text-base font-semibold">
                {currentRound?.label || "—"}
              </p>
              {currentRound?.box_code && (
                <Badge variant="outline" className="mt-1">
                  Box {currentRound.box_code}
                </Badge>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={slot.status !== "berjalan"}
              >
                Ronde Berikutnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={slot.status !== "berjalan"}
              >
                Babak Berikutnya
              </Button>
            </div>
          </div>
        </Card>

        {/* Panel Timer Server */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Timer</h2>
            <Badge
              className={`${timerStatusColors[slot.timer_status]} text-white`}
            >
              {slot.timer_status === "berhenti" && "Berhenti"}
              {slot.timer_status === "berjalan" && "Berjalan"}
              {slot.timer_status === "jeda" && "Jeda"}
            </Badge>
          </div>
          <div className="mb-6 text-center">
            <div
              className={`text-6xl font-bold tabular-nums ${isTimeout ? "text-red-600" : ""}`}
            >
              {formattedTime}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {slot.timer_stage && `Tahap ${slot.timer_stage} (Estafet)`}
              {isTimeout && " — Waktu Habis!"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="default"
              onClick={onTimerStart}
              disabled={
                slot.timer_status === "berjalan" || slot.status !== "berjalan"
              }
            >
              <Play className="size-4" />
              Mulai
            </Button>
            <Button
              variant="secondary"
              onClick={onTimerPause}
              disabled={
                slot.timer_status !== "berjalan" || slot.status !== "berjalan"
              }
            >
              <Pause className="size-4" />
              Jeda
            </Button>
            <Button
              variant="outline"
              onClick={onTimerReset}
              disabled={slot.status !== "berjalan"}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* Kontrol Pertandingan */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Kontrol Pertandingan</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={onMatchStart}
            disabled={slot.status !== "belum_mulai"}
          >
            <Flag className="size-4" />
            Mulai Pertandingan
          </Button>
          <Button
            variant="secondary"
            onClick={onMatchEnd}
            disabled={slot.status !== "berjalan"}
          >
            <FlagOff className="size-4" />
            Akhiri Pertandingan
          </Button>
          <Button
            variant="outline"
            onClick={onMatchReset}
            disabled={slot.status === "belum_mulai"}
          >
            <RotateCcw className="size-4" />
            Reset Pertandingan
          </Button>
        </div>
      </Card>
    </div>
  );
}
