const keyCodes = {
	ESC: 27,
	backspace: 8,
	deleteKey: 46,
	enter: 13,
	space: 32,
	shiftKey: 16,
	f1: 112,
	f12: 123,
};
const keyNames = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

// This is a mapping of the incorrect keyIdentifiers generated by Webkit on Windows during keydown events to
// the correct identifiers, which are correctly generated on Mac. We require this mapping to properly handle
// these keys on Windows. See https://bugs.webkit.org/show_bug.cgi?id=19906 for more details.
const keyIdentifierCorrectionMap = {
	'U+00C0': ['U+0060', 'U+007E'], // `~
	'U+00BD': ['U+002D', 'U+005F'], // -_
	'U+00BB': ['U+003D', 'U+002B'], // =+
	'U+00DB': ['U+005B', 'U+007B'], // [{
	'U+00DD': ['U+005D', 'U+007D'], // ]}
	'U+00DC': ['U+005C', 'U+007C'], // \|
	'U+00BA': ['U+003B', 'U+003A'], // ;:
	'U+00DE': ['U+0027', 'U+0022'], // '"
	'U+00BC': ['U+002C', 'U+003C'], // ,<
	'U+00BE': ['U+002E', 'U+003E'], // .>
	'U+00BF': ['U+002F', 'U+003F'], // /?
};

let platform;
if (navigator.userAgent.indexOf('Mac') !== -1) platform = 'Mac';
else if (navigator.userAgent.indexOf('Linux') !== -1) platform = 'Linux';
else platform = 'Windows';

function getKeyChar(event) {
	// Not a letter
	if (event.keyIdentifier.slice(0, 2) !== 'U+') {
		// Named key
		if (keyNames[event.keyCode]) {
			return keyNames[event.keyCode];
		}
		// F-key
		if (event.keyCode >= keyCodes.f1 && event.keyCode <= keyCodes.f12) {
			return 'f' + (1 + event.keyCode - keyCodes.f1);
		}
		return '';
	}
	let keyIdentifier = event.keyIdentifier;
	// On Windows, the keyIdentifiers for non-letter keys are incorrect. See
	// https://bugs.webkit.org/show_bug.cgi?id=19906 for more details.
	if (
		(platform === 'Windows' || platform === 'Linux') &&
		keyIdentifierCorrectionMap[keyIdentifier]
	) {
		let correctedIdentifiers = keyIdentifierCorrectionMap[keyIdentifier];
		keyIdentifier = event.shiftKey
			? correctedIdentifiers[0]
			: correctedIdentifiers[1];
	}
	const unicodeKeyInHex = '0x' + keyIdentifier.substring(2);
	return String.fromCharCode(parseInt(unicodeKeyInHex)).toLowerCase();
}

function isPrimaryModifierKey(event) {
	if (platform === 'Mac') return event.metaKey;
	else return event.ctrlKey;
}

function isEscape(event) {
	return (
		event.keyCode === keyCodes.ESC ||
		(event.ctrlKey && getKeyChar(event) === '[')
	); // c-[ is mapped to ESC in Vim by default.
}
