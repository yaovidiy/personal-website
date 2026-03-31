import { getContext, setContext } from 'svelte';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

class ToastState {
	#toasts = $state<Toast[]>([]);

	get toasts() {
		return this.#toasts;
	}

	add(message: string, type: ToastType = 'info', duration = 4000) {
		const id = Math.random().toString(36).slice(2);
		this.#toasts.push({ id, message, type });

		if (duration > 0) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}
	}

	remove(id: string) {
		this.#toasts = this.#toasts.filter((t) => t.id !== id);
	}
}

const TOAST_KEY = Symbol('toast');

export function initToastState() {
	const state = new ToastState();
	setContext(TOAST_KEY, state);
	return state;
}

export function getToastState() {
	return getContext<ToastState>(TOAST_KEY);
}
