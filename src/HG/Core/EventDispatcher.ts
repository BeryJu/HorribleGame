/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 16:34:31
*/

module HG.Core {

	export class EventDispatcher {

		// holds all event eventHandlers like
		private _events: {} = {};
		// same for public events
		private globalEvents: any[] = [];
		// holds events available to subscribe to
		events: string[] = [];

		constructor(events?: string[]) {
			this.events = events || [];
		}

		private resolve(raw: any): string {
			if (HG.Utils.isNumber(raw) === true) {
				return raw.toString();
			} else {
				return raw.toString().toLowerCase();
			}
		}

		onAll(eventHandler: (...args: any[]) => any): HG.Core.EventDispatcher {
			this.globalEvents.push(eventHandler);
			return this;
		}

		on(name: any, eventHandler?: Function): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => this.on(n, eventHandler));
			} else {
				var type = this["constructor"]["name"];
				var resolved = this.resolve(name);
				// if not in .events, warn; else just log
				if (this.events.indexOf(resolved) === -1) {
					HG.locale.event.eventNotAvailable.format(type, name).warn();
				} else {
					HG.locale.event.eventAdded.format(type, name).log();
				}
				// if no events list for name, create one
				if (!this._events[resolved]) {
					this._events[resolved] = [];
				}
				// if no eventHandler, check if function is on this class
				if (!eventHandler) {
					if (this[resolved] && HG.Utils.isFunction(this[resolved])) {
						// use this
						eventHandler = this[resolved];
					} else {
						HG.locale.event.isEmpty.error();
					}
				}
				// actually add the eventHandler
				this._events[resolved].push(eventHandler);
				return this;
			}
		}

		bind = this.on;
		addEventListener = this.on;

		inject(name: any, eventHandler: Function): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.inject(n, eventHandler);
				});
			} else {
				var type = this["constructor"]["name"];
				var resolved = this.resolve(name);
				// if no events list for name, create one
				if (!this._events[resolved]) {
					this._events[resolved] = [];
				}
				HG.locale.event.injected.format(type, name).log();
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