interface RepositoryErrorParams {
  code: string;
  message: string;
  status?: number;
  cause?: unknown;
}

export class RepositoryError extends Error {
  code: string;
  status?: number;

  constructor({ code, message, status, cause }: RepositoryErrorParams) {
    super(message, { cause });
    this.name = 'RepositoryError';
    this.code = code;
    this.status = status;
  }
}

export const createRepositoryErrorClass = (name: string) => {
  class CustomRepositoryError extends RepositoryError {
    constructor(params: RepositoryErrorParams) {
      super(params);
      this.name = name;
    }
  }
  return CustomRepositoryError;
};
