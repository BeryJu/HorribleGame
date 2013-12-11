/*
* @Author: BeryJu
* @Date:   2013-12-07 22:04:41
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 22:06:51
*/

module HG.Scenes.Serializer {

	export interface AbilityDefinition {
		type: string;
		properties?: any[];
		bindings?: {
			keyboard?: HG.Scenes.Serializer.BindingDefinition[];
			mouse?: HG.Scenes.Serializer.BindingDefinition[]
		};
	}

}