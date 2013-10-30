/// <reference path="../GameComponent.ts" />
/// <reference path="../abilities/BaseAbility.hg.ts" />
/*
* BaseEntity.ts
* Author: BeryJu
*/

module HG {

	export class BaseEntity extends GameComponent {
		_: {};
		abilities: BaseAbility[] = [];
		object: THREE.Object3D;
		positionOffset: THREE.Vector3 = new THREE.Vector3;

		constructor(object?: THREE.Object3D) {
			super();
			if (object) {
				this.object = object;
			} else {
				this.object = new THREE.Mesh();
			}
		}

		addAbility(a: BaseAbility): boolean {
			var compatible = a.checkCompatibility(this);
			if (compatible === true) {
				a.setHost(this);
				this.abilities.push(a);
			}
			return compatible;
		}

		forAbilities(callback: (a: BaseAbility) => void): void {
			this.abilities.forEach(callback);
		}

		offset(x: number, y: number, z: number): BaseEntity {
			this.positionOffset.set(x, y, z);
			return this;
		}

		scale(x: number, y: number, z: number): BaseEntity {
			this.object.scale.set(x, y, z);
			return this;
		}

		position(x: number, y: number, z: number): BaseEntity {
			x = x + this.positionOffset.x;
			y = y + this.positionOffset.y;
			z = z + this.positionOffset.z;
			this.object.position.set(x, y, z);
			return this;
		}

		rotate(x: number, y: number, z: number): BaseEntity {
			this.object.rotation.set(x, y, z);
			return this;
		}

		getInternal(): THREE.Object3D {
			return this.object;
		}

		frame(delta: number): void {
			if (this.abilities.length > 0) {
				this.abilities.forEach((ability) => {
					ability.frame(delta);
				});
			}
		}

	}
}