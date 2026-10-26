// Struktur data & mock entitas pertandingan Gebyar Matematika Arena
// Mengacu pada PRD Bagian 6 (Database Schema) & Bagian 3 (Aturan Lomba)

export type Jenjang = "SD" | "SMP" | "SMA";
export type Fase = "semifinal" | "final";
export type JenisSlot = "semifinal_1" | "semifinal_2" | "final";
export type MatchStatus = "belum_mulai" | "berjalan" | "jeda" | "selesai";
export type TimerStatus = "berhenti" | "berjalan" | "jeda";
export type FormatBabak = "mystery_box" | "redzone" | "detective" | "estafet" | "rebutan";
export type JenisBabak = "reguler" | "tambahan";
export type StatusBabakRonde = "menunggu" | "aktif" | "selesai";
export type BasisHitung = "per_babak" | "per_box";
export type MediaType = "gambar" | "grafik" | "tabel" | "ilustrasi";
export type Theme = "light" | "dark";

export interface CompetitionSession {
  id: string;
  name: string;
  jenjang: Jenjang;
  fase: Fase;
  nomor_sesi: number;
  jumlah_slot_semifinal: number;
  status_kesiapan: "draft" | "siap";
  is_archived: boolean;
  archived_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  school: string;
  jenjang: Jenjang;
  created_at: string;
}

export interface SlotTeam {
  id: string;
  slot_id: string;
  team_id: string;
  team?: Team;
  position: number; // 1, 2, 3, 4
  score: number; // Boleh negatif
  updated_at: string;
}

export interface RoundLimit {
  id: string;
  fase: Fase;
  format: FormatBabak;
  max_round: number;
  basis_hitung: BasisHitung;
}

export interface TimerConfig {
  id: string;
  fase: Fase;
  jenis_babak: JenisBabak;
  format: FormatBabak;
  stage: number | null; // null untuk reguler, 1|2|3 untuk Estafet Final
  duration_seconds: number;
  is_default: boolean;
}

export interface ScoreRule {
  id: string;
  fase: Fase;
  jenis_babak: JenisBabak;
  format: FormatBabak;
  delta_benar: number;
  delta_salah: number;
  taruhan_min: number | null;
  taruhan_max: number | null;
  taruhan_step: number | null;
  allowed_bets?: number[];
  wajib_alasan_koreksi: boolean;
}

export interface MatchRound {
  id: string;
  babak_id: string;
  round_number: number;
  box_code: string | null;
  is_additional: boolean;
  label: string | null;
  status: StatusBabakRonde;
  created_at: string;
}

export interface MatchBabak {
  id: string;
  slot_id: string;
  fase: Fase;
  jenis: JenisBabak;
  format: FormatBabak;
  urutan: number;
  label: string;
  round_limit_id: string | null;
  score_rule_id: string;
  status: StatusBabakRonde;
  rounds?: MatchRound[];
  created_at: string;
}

export interface MysteryBoxPick {
  id: string;
  round_id: string;
  slot_team_id: string;
  box_code: string;
  canceled_at: string | null;
  correction_reason: string | null;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  session_id: string;
  title: string;
  type: MediaType;
  file_url: string;
  created_by: string;
  created_at: string;
}

export interface MatchSlot {
  id: string;
  session_id: string;
  slot_number: number;
  jenis_slot: JenisSlot;
  current_babak_id: string | null;
  current_round_id: string | null;
  status: MatchStatus;
  timer_config_id: string | null;
  timer_status: TimerStatus;
  timer_remaining_ms: number;
  timer_started_at: string | null;
  timer_deadline_at: string | null;
  timer_finished_at: string | null;
  timer_stage: number | null; // 1, 2, 3 untuk Estafet
  active_media_id: string | null;
  theme: Theme;
  version: number;
  teams: SlotTeam[];
  babaks: MatchBabak[];
  updated_at: string;
}

export interface AuditLog {
  id: number;
  session_id: string;
  slot_id: string;
  user_id: string;
  action: string;
  entity: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
}

// ==========================================
// KONFIGURASI STANDAR PRD
// ==========================================

export const MOCK_ROUND_LIMITS: RoundLimit[] = [
  { id: "rl-semi-mb", fase: "semifinal", format: "mystery_box", max_round: 3, basis_hitung: "per_box" },
  { id: "rl-semi-rz", fase: "semifinal", format: "redzone", max_round: 3, basis_hitung: "per_babak" },
  { id: "rl-semi-det", fase: "semifinal", format: "detective", max_round: 10, basis_hitung: "per_babak" },
  { id: "rl-fin-est", fase: "final", format: "estafet", max_round: 8, basis_hitung: "per_babak" },
  { id: "rl-fin-rz", fase: "final", format: "redzone", max_round: 4, basis_hitung: "per_babak" },
  { id: "rl-fin-reb", fase: "final", format: "rebutan", max_round: 15, basis_hitung: "per_babak" },
];

export const MOCK_TIMER_CONFIGS: TimerConfig[] = [
  { id: "tc-semi-mb", fase: "semifinal", jenis_babak: "reguler", format: "mystery_box", stage: null, duration_seconds: 90, is_default: true },
  { id: "tc-semi-rz", fase: "semifinal", jenis_babak: "reguler", format: "redzone", stage: null, duration_seconds: 240, is_default: true },
  { id: "tc-semi-det", fase: "semifinal", jenis_babak: "reguler", format: "detective", stage: null, duration_seconds: 30, is_default: true },
  // Estafet Final: 3 tahap (40s, 30s, 20s)
  { id: "tc-fin-est-1", fase: "final", jenis_babak: "reguler", format: "estafet", stage: 1, duration_seconds: 40, is_default: true },
  { id: "tc-fin-est-2", fase: "final", jenis_babak: "reguler", format: "estafet", stage: 2, duration_seconds: 30, is_default: true },
  { id: "tc-fin-est-3", fase: "final", jenis_babak: "reguler", format: "estafet", stage: 3, duration_seconds: 20, is_default: true },
  { id: "tc-fin-rz", fase: "final", jenis_babak: "reguler", format: "redzone", stage: null, duration_seconds: 210, is_default: true },
  { id: "tc-fin-reb", fase: "final", jenis_babak: "reguler", format: "rebutan", stage: null, duration_seconds: 60, is_default: true },
  { id: "tc-tambahan", fase: "semifinal", jenis_babak: "tambahan", format: "mystery_box", stage: null, duration_seconds: 120, is_default: true },
];

export const MOCK_SCORE_RULES: ScoreRule[] = [
  {
    id: "sr-semi-mb",
    fase: "semifinal",
    jenis_babak: "reguler",
    format: "mystery_box",
    delta_benar: 100,
    delta_salah: 0,
    taruhan_min: null,
    taruhan_max: null,
    taruhan_step: null,
    wajib_alasan_koreksi: true,
  },
  {
    id: "sr-semi-rz",
    fase: "semifinal",
    jenis_babak: "reguler",
    format: "redzone",
    delta_benar: 0, // dihitung dari taruhan
    delta_salah: 0,
    taruhan_min: 50,
    taruhan_max: 150,
    taruhan_step: 25,
    allowed_bets: [50, 75, 100, 125, 150],
    wajib_alasan_koreksi: true,
  },
  {
    id: "sr-semi-det",
    fase: "semifinal",
    jenis_babak: "reguler",
    format: "detective",
    delta_benar: 100,
    delta_salah: -50,
    taruhan_min: null,
    taruhan_max: null,
    taruhan_step: null,
    wajib_alasan_koreksi: true,
  },
  {
    id: "sr-fin-est",
    fase: "final",
    jenis_babak: "reguler",
    format: "estafet",
    delta_benar: 100,
    delta_salah: 0,
    taruhan_min: null,
    taruhan_max: null,
    taruhan_step: null,
    wajib_alasan_koreksi: true,
  },
  {
    id: "sr-fin-rz",
    fase: "final",
    jenis_babak: "reguler",
    format: "redzone",
    delta_benar: 0,
    delta_salah: 0,
    taruhan_min: 0,
    taruhan_max: 200,
    taruhan_step: 50,
    allowed_bets: [0, 50, 100, 150, 200],
    wajib_alasan_koreksi: true,
  },
  {
    id: "sr-fin-reb",
    fase: "final",
    jenis_babak: "reguler",
    format: "rebutan",
    delta_benar: 100,
    delta_salah: -100,
    taruhan_min: null,
    taruhan_max: null,
    taruhan_step: null,
    wajib_alasan_koreksi: true,
  },
];

// ==========================================
// MOCK DATA TIM
// ==========================================

export const MOCK_TEAMS: Team[] = [
  { id: "team-1", name: "Euler Alpha", school: "SMA Negeri 1 Denpasar", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-2", name: "Gauss Prime", school: "SMA Negeri 3 Denpasar", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-3", name: "Newton Delta", school: "SMA Taruna Nusantara", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-4", name: "Riemann Sigma", school: "SMA Katolik Rajawali", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-5", name: "Fibonacci Vector", school: "SMA Negeri 8 Jakarta", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-6", name: "Pythagoras Theta", school: "SMA Pradita Dirgantara", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-7", name: "Archimedes Pi", school: "SMA Negeri 1 Surakarta", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
  { id: "team-8", name: "Pascal Matrix", school: "SMA Negeri 5 Surabaya", jenjang: "SMA", created_at: "2027-01-10T08:00:00Z" },
];

// ==========================================
// MOCK DATA SESI & SLOT
// ==========================================

export const MOCK_SESSION_SEMIFINAL: CompetitionSession = {
  id: "session-semi-sma-1",
  name: "Semifinal Sesi 1 - SMA",
  jenjang: "SMA",
  fase: "semifinal",
  nomor_sesi: 1,
  jumlah_slot_semifinal: 2,
  status_kesiapan: "siap",
  is_archived: false,
  archived_at: null,
  created_by: "user-admin",
  created_at: "2027-02-01T07:00:00Z",
  updated_at: "2027-02-01T07:30:00Z",
};

export const MOCK_SESSION_FINAL: CompetitionSession = {
  id: "session-final-sma",
  name: "Final - SMA",
  jenjang: "SMA",
  fase: "final",
  nomor_sesi: 1,
  jumlah_slot_semifinal: 0,
  status_kesiapan: "siap",
  is_archived: false,
  archived_at: null,
  created_by: "user-admin",
  created_at: "2027-02-02T07:00:00Z",
  updated_at: "2027-02-02T07:30:00Z",
};

export const MOCK_BABAKS_SEMIFINAL_SLOT_1: MatchBabak[] = [
  {
    id: "babak-semi-1-mb",
    slot_id: "slot-semi-1",
    fase: "semifinal",
    jenis: "reguler",
    format: "mystery_box",
    urutan: 1,
    label: "Babak 1: Mystery Box",
    round_limit_id: "rl-semi-mb",
    score_rule_id: "sr-semi-mb",
    status: "aktif",
    created_at: "2027-02-01T07:30:00Z",
    rounds: [
      { id: "round-semi-1-mb-1", babak_id: "babak-semi-1-mb", round_number: 1, box_code: "A", is_additional: false, label: "Ronde 1 (Box A)", status: "selesai", created_at: "2027-02-01T08:00:00Z" },
      { id: "round-semi-1-mb-2", babak_id: "babak-semi-1-mb", round_number: 2, box_code: "B", is_additional: false, label: "Ronde 2 (Box B)", status: "aktif", created_at: "2027-02-01T08:15:00Z" },
      { id: "round-semi-1-mb-3", babak_id: "babak-semi-1-mb", round_number: 3, box_code: "C", is_additional: false, label: "Ronde 3 (Box C)", status: "menunggu", created_at: "2027-02-01T08:30:00Z" },
    ],
  },
  {
    id: "babak-semi-1-rz",
    slot_id: "slot-semi-1",
    fase: "semifinal",
    jenis: "reguler",
    format: "redzone",
    urutan: 2,
    label: "Babak 2: Redzone",
    round_limit_id: "rl-semi-rz",
    score_rule_id: "sr-semi-rz",
    status: "menunggu",
    created_at: "2027-02-01T07:30:00Z",
    rounds: [],
  },
  {
    id: "babak-semi-1-det",
    slot_id: "slot-semi-1",
    fase: "semifinal",
    jenis: "reguler",
    format: "detective",
    urutan: 3,
    label: "Babak 3: Detektif",
    round_limit_id: "rl-semi-det",
    score_rule_id: "sr-semi-det",
    status: "menunggu",
    created_at: "2027-02-01T07:30:00Z",
    rounds: [],
  },
];

export const MOCK_SLOT_SEMIFINAL_1: MatchSlot = {
  id: "slot-semi-1",
  session_id: "session-semi-sma-1",
  slot_number: 1,
  jenis_slot: "semifinal_1",
  current_babak_id: "babak-semi-1-mb",
  current_round_id: "round-semi-1-mb-2",
  status: "berjalan",
  timer_config_id: "tc-semi-mb",
  timer_status: "berjalan",
  timer_remaining_ms: 64000,
  timer_started_at: "2027-02-01T08:20:00Z",
  timer_deadline_at: "2027-02-01T08:21:04Z",
  timer_finished_at: null,
  timer_stage: null,
  active_media_id: null,
  theme: "dark",
  version: 12,
  teams: [
    { id: "st-1", slot_id: "slot-semi-1", team_id: "team-1", position: 1, score: 200, team: MOCK_TEAMS[0], updated_at: "2027-02-01T08:18:00Z" },
    { id: "st-2", slot_id: "slot-semi-1", team_id: "team-2", position: 2, score: 100, team: MOCK_TEAMS[1], updated_at: "2027-02-01T08:16:00Z" },
    { id: "st-3", slot_id: "slot-semi-1", team_id: "team-3", position: 3, score: 0, team: MOCK_TEAMS[2], updated_at: "2027-02-01T08:00:00Z" },
    { id: "st-4", slot_id: "slot-semi-1", team_id: "team-4", position: 4, score: -50, team: MOCK_TEAMS[3], updated_at: "2027-02-01T08:19:00Z" }, // demonstrasi skor negatif sah
  ],
  babaks: MOCK_BABAKS_SEMIFINAL_SLOT_1,
  updated_at: "2027-02-01T08:20:00Z",
};

export const MOCK_SLOT_SEMIFINAL_2: MatchSlot = {
  id: "slot-semi-2",
  session_id: "session-semi-sma-1",
  slot_number: 2,
  jenis_slot: "semifinal_2",
  current_babak_id: null,
  current_round_id: null,
  status: "belum_mulai",
  timer_config_id: "tc-semi-mb",
  timer_status: "berhenti",
  timer_remaining_ms: 90000,
  timer_started_at: null,
  timer_deadline_at: null,
  timer_finished_at: null,
  timer_stage: null,
  active_media_id: null,
  theme: "light",
  version: 1,
  teams: [
    { id: "st-5", slot_id: "slot-semi-2", team_id: "team-5", position: 1, score: 0, team: MOCK_TEAMS[4], updated_at: "2027-02-01T07:30:00Z" },
    { id: "st-6", slot_id: "slot-semi-2", team_id: "team-6", position: 2, score: 0, team: MOCK_TEAMS[5], updated_at: "2027-02-01T07:30:00Z" },
    { id: "st-7", slot_id: "slot-semi-2", team_id: "team-7", position: 3, score: 0, team: MOCK_TEAMS[6], updated_at: "2027-02-01T07:30:00Z" },
    { id: "st-8", slot_id: "slot-semi-2", team_id: "team-8", position: 4, score: 0, team: MOCK_TEAMS[7], updated_at: "2027-02-01T07:30:00Z" },
  ],
  babaks: [],
  updated_at: "2027-02-01T07:30:00Z",
};

export const MOCK_SLOT_FINAL: MatchSlot = {
  id: "slot-final",
  session_id: "session-final-sma",
  slot_number: 1,
  jenis_slot: "final",
  current_babak_id: "babak-fin-est",
  current_round_id: "round-fin-est-1",
  status: "berjalan",
  timer_config_id: "tc-fin-est-1",
  timer_status: "jeda",
  timer_remaining_ms: 22000,
  timer_started_at: null,
  timer_deadline_at: null,
  timer_finished_at: null,
  timer_stage: 1, // Peserta 1 (tahap 40 detik)
  active_media_id: null,
  theme: "dark",
  version: 5,
  teams: [
    { id: "st-f1", slot_id: "slot-final", team_id: "team-1", position: 1, score: 100, team: MOCK_TEAMS[0], updated_at: "2027-02-02T09:05:00Z" },
    { id: "st-f2", slot_id: "slot-final", team_id: "team-2", position: 2, score: 0, team: MOCK_TEAMS[1], updated_at: "2027-02-02T09:00:00Z" },
    { id: "st-f3", slot_id: "slot-final", team_id: "team-5", position: 3, score: 100, team: MOCK_TEAMS[4], updated_at: "2027-02-02T09:07:00Z" },
    { id: "st-f4", slot_id: "slot-final", team_id: "team-7", position: 4, score: 0, team: MOCK_TEAMS[6], updated_at: "2027-02-02T09:00:00Z" },
  ],
  babaks: [
    {
      id: "babak-fin-est",
      slot_id: "slot-final",
      fase: "final",
      jenis: "reguler",
      format: "estafet",
      urutan: 1,
      label: "Babak 1: Estafet",
      round_limit_id: "rl-fin-est",
      score_rule_id: "sr-fin-est",
      status: "aktif",
      created_at: "2027-02-02T08:30:00Z",
      rounds: [
        { id: "round-fin-est-1", babak_id: "babak-fin-est", round_number: 1, box_code: null, is_additional: false, label: "Ronde 1", status: "aktif", created_at: "2027-02-02T09:00:00Z" },
      ],
    },
    {
      id: "babak-fin-rz",
      slot_id: "slot-final",
      fase: "final",
      jenis: "reguler",
      format: "redzone",
      urutan: 2,
      label: "Babak 2: Redzone",
      round_limit_id: "rl-fin-rz",
      score_rule_id: "sr-fin-rz",
      status: "menunggu",
      created_at: "2027-02-02T08:30:00Z",
      rounds: [],
    },
    {
      id: "babak-fin-reb",
      slot_id: "slot-final",
      fase: "final",
      jenis: "reguler",
      format: "rebutan",
      urutan: 3,
      label: "Babak 3: Rebutan",
      round_limit_id: "rl-fin-reb",
      score_rule_id: "sr-fin-reb",
      status: "menunggu",
      created_at: "2027-02-02T08:30:00Z",
      rounds: [],
    },
  ],
  updated_at: "2027-02-02T09:10:00Z",
};

// ==========================================
// MOCK MEDIA ASSETS
// ==========================================

export const MOCK_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media-1",
    session_id: "session-semi-sma-1",
    title: "Bangun Geometri Ruang - Irisan Balok",
    type: "bangun_geometri" as unknown as MediaType,
    file_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80",
    created_by: "user-admin",
    created_at: "2027-02-01T07:00:00Z",
  },
  {
    id: "media-2",
    session_id: "session-semi-sma-1",
    title: "Grafik Fungsi Polinomial Orde 4",
    type: "grafik",
    file_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    created_by: "user-admin",
    created_at: "2027-02-01T07:05:00Z",
  },
  {
    id: "media-3",
    session_id: "session-semi-sma-1",
    title: "Tabel Matriks Frekuensi Relatif",
    type: "tabel",
    file_url: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&q=80",
    created_by: "user-admin",
    created_at: "2027-02-01T07:10:00Z",
  },
];
