import { resolveImageUrl } from './images';

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function normalizeTeamMember(member) {
  if (!member) return null;

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio || '',
    email: member.email || '',
    photoUrl: member.photo_url ? resolveImageUrl(member.photo_url) : null,
    sortOrder: member.sort_order ?? 0,
    isPublished: member.is_published ?? true,
  };
}

export function toTeamPayload(form) {
  return {
    name: form.name,
    role: form.role,
    bio: form.bio || null,
    email: form.email || null,
    sort_order: form.sortOrder !== '' ? Number(form.sortOrder) : 0,
    is_published: form.isPublished,
  };
}
