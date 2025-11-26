<script lang="ts">
	let {
		message = 'sure?',
		action,
		children
	}: {
		message?: string;
		action?: string;
		children: any;
	} = $props();

	function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		if (!confirm(message)) {
			event.preventDefault();
		}
	}
</script>

<form method="POST" {action} onsubmit={handleSubmit}>
	<button type="submit">
		{@render children()}
	</button>
</form>
