<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  
  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
  }
  
  let { class: className = '', children, ...restProps }: Props = $props();
</script>

<div
  class={cn(
    'rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>