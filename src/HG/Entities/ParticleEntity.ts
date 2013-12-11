/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:03:46
*/
/// <reference path="BaseEntity.ts" />

module HG.Entities {

	export class ParticleEntity extends HG.Entities.BaseEntity {

		count: number = 1800;
		size: number = 20;
		color: number = 0xFFFFFF;
		map: string;

		constructor(map: string, count: number = 1800, size: number = 20) {
			super();
			this.size = size;
			this.count = count;
			this.map = map;
			this.create();
		}

		create(): void {
			var geometry = new THREE.Geometry();
			var material = new THREE.ParticleBasicMaterial({
				color: this.color,
				size: this.size,
				map: THREE.ImageUtils.loadTexture(this.map),
				blending: THREE.AdditiveBlending,
				transparent: true
			});
			// now create the individual particles
			for (var p = 0; p < this.count; p++) {
				var pX = Math.random() * 500 - 250;
				var pY = Math.random() * 500 - 250;
				var pZ = Math.random() * 500 - 250;
				var particle = new THREE.Vector3(pX, pY, pZ);
				geometry.vertices.push(particle);
			}
			var system = new THREE.ParticleSystem(geometry, material);
			system.sortParticles = true;
			this.object = system;

		}

	}

}
