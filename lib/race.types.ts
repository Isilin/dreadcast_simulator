export interface RaceResponseDto {
  type:
    | 'Humain'
    | 'Elfe'
    | 'Nain'
    | 'Orc'
    | 'Troll'
    | 'Outrilien'
    | 'Vautour'
    | 'Gobelin'
    | 'Kobold'
    | 'Gnoll'
    | 'Androide';
  strength: number;
  agility: number;
  robustness: number;
  perception: number;
  stealth: number;
  computing: number;
  medicine: number;
  engineering: number;
  health: number;
  stamina: number;
}
