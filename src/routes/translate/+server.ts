import { json } from '@sveltejs/kit';
import * as deepl from 'deepl-node';

const authKey = import.meta.env.VITE_DEEPL_APIKEY;
const translator = new deepl.Translator(authKey);

export const POST = async ({ request }) => {
	const data = await request.json();

	const result = await translator.translateText(data.text, null, data.target_lang);

	return json(result);
};
