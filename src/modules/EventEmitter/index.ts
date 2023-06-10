export default class EventEmitter {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  on(type: string, callback: Function) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  emit(type: string, args?: any) {
    if (this.events[type]) {
      this.events[type].forEach((callback) => callback(args));
    }
  }
}
