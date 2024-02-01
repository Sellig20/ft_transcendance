import { createCipheriv, createHash, randomBytes, scrypt } from "crypto";
import { createDecipheriv } from 'crypto';
import { jwtConstants } from "./constant";

const key = createHash('sha512')
	.update(jwtConstants.secretForHash)
	.digest('base64')
	.substring(0, 32)


function hash(text: string): string {
	let iv = randomBytes(16);
	let cipher = createCipheriv(
		"aes-256-cbc",
		Buffer.from(key),
		iv
	);

	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decipher(text: string): string {
	let textParts = text.split(":");
	let iv = Buffer.from(textParts.shift(), "hex");
	let encryptedText = Buffer.from(textParts.join(":"), "hex");
	let decipher = createDecipheriv(
		"aes-256-cbc",
		Buffer.from(key),
		iv
	);

	decipher.setAutoPadding(false);

	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}

export default {
	hash,
	decipher
}