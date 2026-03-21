export interface CreateSharedBuildRequestDto {
  slot: number;
}

export interface SharedBuildLinkResponseDto {
  id: string;
  slot: number;
  created_at: string;
}

export interface SharedBuildResponseDto {
  id: string;
  slot: number;
  snapshot: unknown;
  saved_at: string;
  created_at: string;
}
