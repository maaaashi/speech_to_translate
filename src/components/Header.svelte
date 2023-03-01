<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import rep from '../lib/rep.jpg'
</script>

<Navbar>
	<NavBrand href="/">
		<img
			src={rep}
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Speech To Translate
		</span>
	</NavBrand>
</Navbar>
