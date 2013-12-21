/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 10:19:20
*/
/// <reference path="Entity.ts" />

module HG.Entities {

	// export class Particle {

	// 	position: THREE.Vector3 = new THREE.Vector3();
	// 	velocity: THREE.Vector3 = new THREE.Vector3();
	// 	acceleration: THREE.Vector3 = new THREE.Vector3();
	// 	angle: number = 0;
	// 	angleVelocity: number = 0;
	// 	angleAcceleration: number = 0;
	// 	size: number = 16.0;
	// 	color: THREE.Color = new THREE.Color();
	// 	opacity: number = 1.0;
	// 	age: number = 0;
	// 	alive: number = 0;

	// 	update(dt: number): void {
	// 		this.position.add( this.velocity.clone().multiplyScalar(dt) );
	// 		this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );

	// 		// convert from degrees to radians: 0.01745329251 = Math.PI/180
	// 		this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	// 		this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

	// 		this.age += dt;

	// 		// if the tween for a given attribute is nonempty,
	// 		//  then use it to update the attribute's value

	// 		if ( this.sizeTween.times.length > 0 )
	// 			this.size = this.sizeTween.lerp( this.age );

	// 		if ( this.colorTween.times.length > 0 )
	// 		{
	// 			var colorHSL = this.colorTween.lerp( this.age );
	// 			this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	// 		}

	// 		if ( this.opacityTween.times.length > 0 )
	// 			this.opacity = this.opacityTween.lerp( this.age );
	// 	}

	// }

	export class ParticleEntity extends HG.Entities.Entity {

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
