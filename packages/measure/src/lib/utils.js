export const validateUUID = uuid => {
	if (!uuid) return false;
	uuid = uuid.toString().toLowerCase();
	return /[0-9a-f]{8}\-?[0-9a-f]{4}\-?4[0-9a-f]{3}\-?[89ab][0-9a-f]{3}\-?[0-9a-f]{12}/.test(uuid);
};