import type { PrivateContent } from "@/hooks/usePrivateContent";

/**
 * Filenames excluded from the public-facing archive. Media bytes live on the
 * separately hosted archive, so this prevents rendering/referencing them
 * without changing the external archive itself.
 */
export function isRemovedImage(value: string | null | undefined): boolean {
  if (!value || !value.trim()) return true;
  let path = value;
  try { path = decodeURIComponent(path); } catch { /* Preserve raw filename. */ }
  const file = path.split(/[?#]/, 1)[0].split(/[/\\]/).pop() || "";
  return /^memori[-_]?0*1(?:\.[a-z\d]+)?$/i.test(file);
}

export function cleanPrivateMedia(data: PrivateContent): PrivateContent {
  const keptIndices = (data.photos ?? [])
    .map((file, index) => (!isRemovedImage(file) ? index : -1))
    .filter((index) => index >= 0);

  const captions = data.captions
    ? Object.fromEntries(
        Object.entries(data.captions).map(([lang, list]) => [
          lang,
          Array.isArray(list) ? keptIndices.map((i) => list[i]).filter(Boolean) : list,
        ]),
      ) as PrivateContent["captions"]
    : undefined;

  return {
    ...data,
    photos: data.photos?.filter((file) => !isRemovedImage(file)),
    captions,
    specialPhotos: data.specialPhotos?.filter((p) => !isRemovedImage(p.file)),
    journey: data.journey?.filter((p) => !isRemovedImage(p.file)),
    momentImages: data.momentImages?.filter((file) => !isRemovedImage(file)),
    mediaConfig: data.mediaConfig
      ? {
          ...data.mediaConfig,
          heroImageUrl: isRemovedImage(data.mediaConfig.heroImageUrl)
            ? ""
            : data.mediaConfig.heroImageUrl,
        }
      : undefined,
    songs: data.songs?.map((song) => ({
      ...song,
      thumb: isRemovedImage(song.thumb) ? undefined : song.thumb,
    })),
  };
}
