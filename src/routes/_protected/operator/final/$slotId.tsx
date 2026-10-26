import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FinalScreen } from "@/components/operator/final-screen";
import { MOCK_SLOT_FINAL, type MatchSlot } from "@/lib/mock-data";

export const Route = createFileRoute("/_protected/operator/final/$slotId")({
  component: OperatorFinalPage,
});

function OperatorFinalPage() {
  const { slotId } = Route.useParams();

  const mockSlots: Record<string, MatchSlot> = {
    "slot-final": MOCK_SLOT_FINAL,
  };

  const [slot, setSlot] = useState<MatchSlot>(
    mockSlots[slotId] || MOCK_SLOT_FINAL,
  );

  const handleTimerStart = () => {
    console.log("Timer start (Final)");
    setSlot((prev) => ({
      ...prev,
      timer_status: "berjalan",
      timer_started_at: new Date().toISOString(),
    }));
  };

  const handleTimerPause = () => {
    console.log("Timer pause (Final)");
    setSlot((prev) => ({ ...prev, timer_status: "jeda" }));
  };

  const handleTimerReset = () => {
    console.log("Timer reset (Final)");
    setSlot((prev) => ({
      ...prev,
      timer_status: "berhenti",
      timer_remaining_ms: 40000, // Estafet Peserta 1: 40s
      timer_stage: 1,
    }));
  };

  const handleTimerNextStage = () => {
    console.log("Timer next stage (Estafet)");
    const nextStage = (slot.timer_stage || 1) + 1;
    const stageDurations = { 1: 40000, 2: 30000, 3: 20000 };
    setSlot((prev) => ({
      ...prev,
      timer_stage: nextStage as 1 | 2 | 3,
      timer_remaining_ms: stageDurations[nextStage as 1 | 2 | 3] || 20000,
      timer_status: "berhenti",
    }));
  };

  const handleMatchStart = () => {
    console.log("Match start (Final)");
    setSlot((prev) => ({ ...prev, status: "berjalan" }));
  };

  const handleMatchEnd = () => {
    console.log("Match end (Final)");
    setSlot((prev) => ({ ...prev, status: "selesai" }));
  };

  const handleMatchReset = () => {
    console.log("Match reset (Final)");
    setSlot((prev) => ({
      ...prev,
      status: "belum_mulai",
      timer_status: "berhenti",
      timer_remaining_ms: 40000,
      timer_stage: 1,
      current_babak_id: null,
      current_round_id: null,
    }));
  };

  const handleScoreChange = (teamId: string, delta: number) => {
    console.log("Score change (Final)", teamId, delta);
    setSlot((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.team_id === teamId ? { ...t, score: t.score + delta } : t,
      ),
    }));
  };

  return (
    <FinalScreen
      slot={slot}
      onTimerStart={handleTimerStart}
      onTimerPause={handleTimerPause}
      onTimerReset={handleTimerReset}
      onTimerNextStage={handleTimerNextStage}
      onMatchStart={handleMatchStart}
      onMatchEnd={handleMatchEnd}
      onMatchReset={handleMatchReset}
      onScoreChange={handleScoreChange}
    />
  );
}
