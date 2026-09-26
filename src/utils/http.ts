const helpers = {
  'Content-Type': 'application/json',
};

export const GET = (url: string, signal?: AbortSignal) =>
  fetch(url, {
    method: 'GET',
    headers: helpers,
    signal,
  });
