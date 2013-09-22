module HG {

	export class EventDispatcher {

		private Events: {} = {};

		On(Name: any, callback: (...args) => any): void {
			if (Array.isArray(Name) === true) {
				for (var i = 0; i < Name.length; ++i) {
					this.On(Name[i], callback);
				}
			} else {
				if (typeof Name !== "number") {
					Name = Name.toString().toLowerCase();
				}
				console.log('Added EventHandler for \''+Name+'\'');
				if (!this.Events[Name]) this.Events[Name] = [];
				this.Events[Name].push(callback);
			}
		}

		Clear(Name: string): void {
			Name = Name.toLowerCase();
			if (!this.Events[Name]) return;
			if (this.Events[Name].length === 0) return;
			this.Events[Name] = [];
		}

		Dispatch(Name: any, ...args): void {
			if (Array.isArray(Name) === true) {
				for (var i = 0; i < Name.length; ++i) {
					this.Dispatch(Name[i], args);
				}
			} else {
				if (typeof Name !== "number") {
					Name = Name.toString().toLowerCase();
				}
				if (!this.Events[Name]) return;
				if (this.Events[Name].length === 0) return;
				args.push(Name);
				this.Events[Name].forEach(function(event) {
					event(args);
				});
			}
		}

	}

}