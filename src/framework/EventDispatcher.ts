module HG {

	export class EventDispatcher {

		private events: {} = {};

		On(name: any, callback: (...args) => any): void {
			if (Array.isArray(name) === true) {
				for (var i = 0; i < name.length; ++i) {
					this.On(name[i], callback);
				}
			} else {
				name = name.toLowerCase();
				console.log('Added EventHandler for \''+name+'\'');
				if (!this.events[name]) this.events[name] = [];
				this.events[name].push(callback);
			}
		}

		Clear(name: string): void {
			name = name.toLowerCase();
			if (!this.events[name]) return;
			if (this.events[name].length === 0) return;
			this.events[name] = [];
		}

		Dispatch(name: any, ...args): void {
			if (Array.isArray(name) === true) {
				for (var i = 0; i < name.length; ++i) {
					this.Dispatch(name[i], args);
				}
			} else {
				name = name.toLowerCase();
				if (!this.events[name]) return;
				if (this.events[name].length === 0) return;
				args.push(name);
				this.events[name].forEach(function(event) {
					event(args);
				});
			}
		}

	}

}