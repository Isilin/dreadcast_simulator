export interface BuildResponseDto {
  slot: number;
  snapshot: unknown;
  saved_at: string;
}

export interface UpsertBuildRequestDto {
  slot: number;
  snapshot: unknown;
}
