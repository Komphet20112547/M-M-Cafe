export function getApiErrorMessage(error: unknown, fallback: string) {
  const err = error as any;
  return err?.response?.data?.error || err?.message || fallback;
}

