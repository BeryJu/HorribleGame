/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 22:26:56
*/

module HG.Core {

	export class EventDispatcher {

		// holds all event eventHandlers like
		//{ name: [cb1, cb2 ] }
		private _events: {} = {};
		private globalEvents: any[] = [];
		// holds events available to subscribe to
		// if subscribed to an event not in there,
		// there will be a warning
		events: string[] = [];

		constructor(events?: string[]) {
			this.events = events || [];
		}

		resolve(raw: any): string {
			var result: string;
			if (typeof raw === "number") {
				result = raw.toString();
			} else {
				result = raw.toString().toLowerCase();
			}
			return result;
		}

		onAll(eventHandler: (...args: any[]) => any): HG.Core.EventDispatcher {
			this.globalEvents.push(eventHandler);
			return this;
		}

		on(name: string[], eventHandler?: (...args: any[]) => any): HG.Core.EventDispatcher;
		on(name: string, eventHandler?: (...args: any[]) => any): HG.Core.EventDispatcher;
		on(name: number[], eventHandler?: (...args: any[]) => any): HG.Core.EventDispatcher;
		on(name: number, eventHandler?: (...args: any[]) => any): HG.Core.EventDispatcher;
		on(name: any, eventHandler?: (...args: any[]) => any): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.on(n, eventHandler);
				});
			} else {
				var type = this['constructor']['name'];
				var resolved = this.resolve(name);
				// if not in .events, warn; else just log
				if (this.events.indexOf(resolved) === -1) {
					HG.log("["+type+"] Event '"+name+"' not available, still added though");
				} else {
					HG.log("["+type+"] Added EventHandler for '"+name+"'");
				}
				// if no events list for name, create one
				if (!this._events[resolved]) {
					this._events[resolved] = [];
				}
				// if no eventHandler, check if function is on this class
				if (!eventHandler) {
					if (this[resolved] && typeof(this[resolved]) === 'function') {
						// use this
						eventHandler = this[resolved];
					} else {
						throw new Error("Can't add empty event Handler");
					}
				}
				// actually add the eventHandler
				this._events[resolved].push(eventHandler);
				return this;
			}
		}

		bind = this.on;
		addEventListener = this.on;

		inject(name: any, eventHandler: (...args: any[]) => any): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.inject(n, eventHandler);
				});
			} else {
				var type = this['constructor']['name'];
				var resolved = this.resolve(name);
				// if no events list for name, create one
				if (!this._events[resolved]) {
					this._events[resolved] = [];
				}
				HG.log("["+type+"] Injected EventHandler for '"+name+"'");
				// actually add the eventHandler
				this._events[resolved].splice(0, 0, eventHandler);
				return this;
			}
		}

		clear(name: string): HG.Core.EventDispatcher {
			if (typeof name !== "number") name = name.toString().toLowerCase();
			if (!this._events[name]) return;
			if (this._events[name].length === 0) return;
			this._events[name] = [];
			return this;
		}

		dispatch(name: string[], ...args: any[]): HG.Core.EventDispatcher;
		dispatch(name: string, ...args: any[]): HG.Core.EventDispatcher;
		dispatch(name: number[], ...args: any[]): HG.Core.EventDispatcher;
		dispatch(name: number, ...args: any[]): HG.Core.EventDispatcher;
		dispatch(name: any, ...args: any[]): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => this.dispatch(n, args));
			} else {
				var resolved = this.resolve(name);
				if (!(resolved in this.events)) this.events.push(resolved);
				if (!this._events[resolved]) return;
				if (this._events[resolved].length === 0) return;
				var parameters = Array.prototype.splice.call(arguments, 1);
				parameters.push(resolved);
				this._events[resolved].forEach((event) => {
					event.apply(this, parameters);
				});
				this.globalEvents.forEach((event) => {
					event.apply(this, parameters);
				});
				return this;
			}
		}

		emit = this.dispatch;

	}

}