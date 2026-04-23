import type { AuthUser } from '../api/auth';

export const avatarForName = (_firstName: string, _lastName: string) => (
	'https://api.dicebear.com/9.x/notionists/svg?seed=fintrack-default-user-avatar'
);

export const getProfileDisplayName = (profile: Pick<AuthUser, 'firstName' | 'lastName'>) => (
	`${profile.firstName} ${profile.lastName}`.trim()
);

export const formatMemberSince = (createdAt: string) => {
	const parsedDate = new Date(createdAt);

	if (Number.isNaN(parsedDate.getTime())) {
		return 'Unknown';
	}

	return parsedDate.toLocaleDateString(undefined, {
		month: 'long',
		year: 'numeric',
	});
};