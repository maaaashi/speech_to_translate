<script>
	import '../app.postcss';
	import Header from '../components/Header.svelte';
</script>

<div class="border-b-2">
	<Header />
</div>

<main class="mx-auto w-4/5 mt-10">
	<slot />
</main>
