/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 12:23:13
*/

module HG.Core.Serializer {

	export interface EntityDefinition {
		type: string;
		properties: any[];
		abilities?: HG.Core.Serializer.AbilityDefinition[];
		object: HG.Core.Serializer.ObjectDefinition;
		material?: HG.Core.Serializer.MaterialDefinition;
		geometry?: HG.Core.Serializer.ObjectDefinition;
		shader?: HG.Core.Serializer.ShaderDefinition;
		name?: string;
		// for loading a model
		model?: string;
		// positioning
		scale?: number[];
		position?: number[];
		offset?: number[];
		rotation?: number[];

	}

}