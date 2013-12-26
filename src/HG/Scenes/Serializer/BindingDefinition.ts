/*
* @Author: BeryJu
* @Date:   2013-12-07 22:04:41
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 12:23:12
*/

module HG.Core.Serializer {

	export interface BindingDefinition {
		event: string;
		action: string;
		properties?: any[];
	}

}