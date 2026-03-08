export const helpers = {
  'Content-Type': 'application/json',
};

export const GET = (url: string, signal?: AbortSignal) =>
  fetch(url, {
    method: 'GET',
    headers: helpers,
    signal,
  });

export const POST = (url: string, body: unknown, signal?: AbortSignal) =>
  fetch(url, {
    method: 'POST',
    headers: helpers,
    body: JSON.stringify(body),
    signal,
  });

export const PUT = (url: string, body: unknown, signal?: AbortSignal) =>
  fetch(url, {
    method: 'PUT',
    headers: helpers,
    body: JSON.stringify(body),
    signal,
  });

export const PATCH = (url: string, body: unknown, signal?: AbortSignal) =>
  fetch(url, {
    method: 'PATCH',
    headers: helpers,
    body: JSON.stringify(body),
    signal,
  });

export const DELETE = (url: string, signal?: AbortSignal) =>
  fetch(url, {
    method: 'DELETE',
    headers: helpers,
    signal,
  });
