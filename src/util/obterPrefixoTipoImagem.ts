export function getPrefix(imgBase64: string) {
    if (imgBase64.startsWith('iVBORw0K')) return 'data:image/png;base64,'
    if (imgBase64.startsWith('/9j/')) return 'data:image/jpeg;base64,'
    if (imgBase64.startsWith('R0lGOD')) return 'data:image/gif;base64,'
    if (imgBase64.startsWith('UklGR')) return 'data:image/webp;base64,'
    return 'data:image/*;base64,' // fallback genérico
}