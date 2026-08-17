export type FacilityPhotoSource = {
  name: string
  photo_url: string | null
  photos: string[] | null
}

export function resolveFacilityPhotos(
  facility: FacilityPhotoSource | null,
  fallback: string,
  jarFallbackPhotos: string[],
): string[] {
  const databasePhotos = Array.from(new Set(
    [facility?.photo_url, ...(facility?.photos ?? [])]
      .filter((photo): photo is string => Boolean(photo)),
  ))
  if (databasePhotos.length > 0) return databasePhotos

  if (facility?.name.toLowerCase().includes('jar') && jarFallbackPhotos.length > 0) {
    return jarFallbackPhotos
  }
  return [fallback]
}
