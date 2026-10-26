import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SemifinalScreen } from "@/components/operator/semifinal-screen";
import {
  MOCK_SLOT_SEMIFINAL_1,
  MOCK_SLOT_SEMIFINAL_2,
  type MatchSlot,
} from "@/lib/mock-data";

export const Route = createFileRoute(
  "/_protected/operator/semifinal/$slotId",
)({
  component: OperatorSemifinalPage,
});

function OperatorSemifinalPage() {
  const { slotId } = Route.useParams();

  // Mock data — nanti diganti dengan fetch dari API
  const mockSlots: Record<string, MatchSlot> = {
    "slot-semi-1": MOCK_SLOT_SEMIFINAL_1,
    "slot-semi-2": MOCK_SLOT_SEMIFINAL_2,
  };

  const [slot, setSlot] = useState<MatchSlot>(
    mockSlots[slotId] || MOCK_SLOT_SEMIFINAL_1,
  );

  const handleTimerStart = () => {
    console.log("Timer start");
    // Nanti: panggil API mutasi timer start
    setSlot((prev) => ({
      ...prev,
      timer_status: "berjalan",
      timer_started_at: new Date().toISOString(),
    }));
  };

  const handleTimerPause = () => {
    console.log("Timer pause");
    setSlot((prev) => ({ ...prev, timer_status: "jeda" }));
  };

  const handleTimerReset = () => {
    console.log("Timer reset");
    setSlot((prev) => ({
      ...prev,
      timer_status: "berhenti",
      timer_remaining_ms: 90000,
    }));
  };

  const handleMatchStart = () => {
    console.log("Match start");
    setSlot((prev) => ({ ...prev, status: "berjalan" }));
  };

  const handleMatchEnd = () => {
    console.log("Match end");
    setSlot((prev) => ({ ...prev, status: "selesai" }));
  };

  const handleMatchReset = () => {
    console.log("Match reset");
    // Konfirmasi reset atomik nanti
    setSlot((prev) => ({
      ...prev,
      status: "belum_mulai",
      timer_status: "berhenti",
      timer_remaining_ms: 90000,
      current_babak_id: null,
      current_round_id: null,
    }));
  };

  const handleScoreChange = (teamId: string, delta: number) => {
    console.log("Score change", teamId, delta);
    setSlot((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.team_id === teamId ? { ...t, score: t.score + delta } : t,
      ),
    }));
  };

  return (
    <SemifinalScreen
      slot={slot}
      onTimerStart={handleTimerStart}
      onTimerPause={handleTimerPause}
      onTimerReset={handleTimerReset}
      onMatchStart={handleMatchStart}
      onMatchEnd={handleMatchEnd}
      onMatchReset={handleMatchReset}
      onScoreChange={handleScoreChange}
    />
  );
}
