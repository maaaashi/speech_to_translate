<script lang="ts">
	import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
	import { Textarea, Select, Spinner } from 'flowbite-svelte';
	import FaMicrophone from 'svelte-icons/fa/FaMicrophone.svelte';
	import { list } from '../lib/lang_list';

	let prev_text: string = '';
	let plus_text: string = '';
	$: text = prev_text + plus_text
	let mic = false;
	let timer = 0;

	const apikey = import.meta.env.VITE_SPEECH_KEY;
	const region = import.meta.env.VITE_SPEECH_REGION;
	const speechConfig = sdk.SpeechConfig.fromSubscription(apikey, region);
	speechConfig.speechRecognitionLanguage = 'ja-JP';
	let audioConfig = sdk.AudioConfig.fromMicrophoneInput();
	let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

	speechRecognizer.recognized = (sender: sdk.Recognizer, event: sdk.SpeechRecognitionEventArgs) => {
		if (event.result.text) {
			plus_text = ''
			prev_text += event.result.text;
		}
	};

	speechRecognizer.recognizing = (sender: sdk.Recognizer, event: sdk.SpeechRecognitionEventArgs) => {
		plus_text = event.result.text
	};

	setInterval(() => {
		timer++
		if (timer === 30) {
			speechRecognizer.stopContinuousRecognitionAsync();
		}
	}, 1000)

	speechRecognizer.sessionStarted = () => {
		mic = true;
		timer = 0;
	};

	speechRecognizer.sessionStopped = () => {
		mic = false;
	};

	const switchSTT = () => {
		if (mic) {
			speechRecognizer.stopContinuousRecognitionAsync();
		} else {
			prev_text = '';
			plus_text = '';
			text = '';
			speechRecognizer.startContinuousRecognitionAsync();
		}
	};

	interface Language {
		value: string;
		name: string;
	}

	let selectLang = 'EN-US';
	const languages: Language[] = list;

	let translate_text = '';
	let loading = false;

	const translate = async () => {
		loading = true;
		const body = {
			text: text,
			target_lang: selectLang
		};
		const response = await fetch('/translate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		const json_response = await response.json();

		translate_text = json_response.text;
		loading = false;
	};
</script>

<div class="grid grid-cols-5">
	<button on:click={switchSTT} class:mic class="mic-btn mt-6">
		<FaMicrophone />
	</button>
	<div class="col-span-4">
		{#if mic}
			<span class="inline-block">
				<Spinner size={"4"}/>
			</span>
			{timer}
		{:else}
			0
		{/if}??? / 30???
		<Textarea bind:value={text} rows={3} placeholder="???????????????????????????????????????" />
	</div>
</div>

{#if text}
	<div class="flex my-5">
		<Select class="w-4/12" items={languages} bind:value={selectLang} />
		<button disabled={loading} on:click={translate} class="border p-5 rounded-lg ml-2 bg-blue-300">
			{#if loading}
				<Spinner />
			{:else}
				??????
			{/if}
		</button>
	</div>

	{#if translate_text}
		<Textarea
			bind:value={translate_text}
			readonly
			rows={3}
			placeholder="?????????????????????????????????????????????"
		/>
	{/if}
{/if}

<style scoped>
	.mic-btn {
		height: 80px;
		margin-right: 5px;
		border: 2px solid black;
		border-radius: 20px;
		padding: 20px;
	}

	.mic {
		background-color: rgb(130, 191, 130);
	}
</style>
