let uid = -1;
const CHARACTERS = ['🐒', '🦍', '🦧'];

export function getUID() {
	uid += 1;
	return String(
		uid
			.toString(CHARACTERS.length)
			.split('')
			.map((char) => CHARACTERS[Number(char)])
			.join('')
	);
}
