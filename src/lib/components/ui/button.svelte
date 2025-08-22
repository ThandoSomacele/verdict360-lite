<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  
  interface Props extends HTMLButtonAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    class?: string;
  }
  
  let {
    variant = 'default',
    size = 'default',
    class: className = '',
    children,
    onclick,
    ...restProps
  }: Props = $props();
  
  const variantStyles = {
    default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    link: 'text-primary-500 underline-offset-4 hover:underline'
  };
  
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  let classes = $derived(cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    className
  ));
</script>

<button
  class={classes}
  {onclick}
  {...restProps}
>
  {@render children?.()}
</button>