
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function calculateScoreToPar(score: number, par: number): string {
  const diff = score - par;
  if (diff === 0) return 'E';
  return diff > 0 ? `+${diff}` : `${diff}`;
}