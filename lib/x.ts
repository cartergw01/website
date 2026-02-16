export function buildXShareUrl(params: { title: string; url: string }) {
  const text = encodeURIComponent(`${params.title}`);
  const target = encodeURIComponent(params.url);
  return `https://twitter.com/intent/tweet?text=${text}&url=${target}`;
}
