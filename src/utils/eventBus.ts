import { type Component } from 'vue';

// Event types
export enum EventChannel {
  FORM = 'form',
  GLOBAL = 'global',
  COMPONENT = 'component'
}

export enum EventAction {
  FOCUS = 'focus',
  BLUR = 'blur',
  UPDATE = 'update',
  CHANGE = 'change',
  SUBMIT = 'submit',
  RESET = 'reset'
}

export interface EventData {
  channel?: EventChannel;
  action: EventAction;
  data: unknown;
}

// App events interface for popup compatibility
export interface AppEvents {
  'app:key': { key: string }
  'app:popup-open': { component: Component | string; id?: string; props?: Record<string, unknown> }
  'app:popup-close': { id?: string }
  'app:popup-force-close': never
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  // Legacy channel-based methods
  onChannel(channel: EventChannel, callback: EventCallback) {
    if (!this.events.has(channel)) {
      this.events.set(channel, []);
    }
    const callbacks = this.events.get(channel)!;
    callbacks.push(callback);
  }

  offChannel(channel: EventChannel, callback: EventCallback) {
    const callbacks = this.events.get(channel);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emitChannel(channel: EventChannel, data: unknown) {
    const callbacks = this.events.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // String-based event methods for popup compatibility
  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    const callbacks = this.events.get(event)!;
    callbacks.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: unknown) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  clear(key?: string | EventChannel) {
    if (key) {
      this.events.delete(key as string);
    } else {
      this.events.clear();
    }
  }
}

// Export a singleton instance
export const eventBus = new EventBus();

// Vue 3 composable for event bus (tiko/core compatibility)
export function useEventBus() {
  return eventBus;
}