/*
* @Author: BeryJu
* @Date:   2013-12-27 17:44:38
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-27 18:19:45
*/

module HG.Platform {

	export interface IPlatformGLObject {}

	export interface IPlatformGLBuffer extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLFramebuffer extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLProgram extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLRenderbuffer extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLShader extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLTexture extends HG.Platform.IPlatformGLObject {}

	export interface IPlatformGLUniformLocation {}

	export interface IPlatformGLActiveInfo {
		size: number;
		type: number;
		name: string;
	}

	export interface IPlatformGLShaderPrecisionFormat {
		rangeMin: number;
		rangeMax: number;
		precision: number;
	}

	export interface IPlatformGLContextAttributes {
		alpha: boolean;
		depth: boolean;
		stencil: boolean;
		antialias: boolean;
		premultipliedAlpha: boolean;
		preserveDrawingBuffer: boolean;
	}

	export interface IPlatformGLContext {
		DEPTH_BUFFER_BIT: number;
		STENCIL_BUFFER_BIT: number;
		COLOR_BUFFER_BIT: number;

		/* BeginMode */
		POINTS: number;
		LINES: number;
		LINE_LOOP: number;
		LINE_STRIP: number;
		TRIANGLES: number;
		TRIANGLE_STRIP: number;
		TRIANGLE_FAN: number;

		/* AlphaFunction (not supported in ES20) */
		/*      NEVER */
		/*      LESS */
		/*      EQUAL */
		/*      LEQUAL */
		/*      GREATER */
		/*      NOTEQUAL */
		/*      GEQUAL */
		/*      ALWAYS */

		/* BlendingFactorDest */
		ZERO: number;
		ONE: number;
		SRC_COLOR: number;
		ONE_MINUS_SRC_COLOR: number;
		SRC_ALPHA: number;
		ONE_MINUS_SRC_ALPHA: number;
		DST_ALPHA: number;
		ONE_MINUS_DST_ALPHA: number;

		/* BlendingFactorSrc */
		/*      ZERO */
		/*      ONE */
		DST_COLOR: number;
		ONE_MINUS_DST_COLOR: number;
		SRC_ALPHA_SATURATE: number;
		/*      SRC_ALPHA */
		/*      ONE_MINUS_SRC_ALPHA */
		/*      DST_ALPHA */
		/*      ONE_MINUS_DST_ALPHA */

		/* BlendEquationSeparate */
		FUNC_ADD: number;
		BLEND_EQUATION: number;
		BLEND_EQUATION_RGB: number;
		BLEND_EQUATION_ALPHA: number;

		/* BlendSubtract */
		FUNC_SUBTRACT: number;
		FUNC_REVERSE_SUBTRACT: number;

		/* Separate Blend Functions */
		BLEND_DST_RGB: number;
		BLEND_SRC_RGB: number;
		BLEND_DST_ALPHA: number;
		BLEND_SRC_ALPHA: number;
		CONSTANT_COLOR: number;
		ONE_MINUS_CONSTANT_COLOR: number;
		CONSTANT_ALPHA: number;
		ONE_MINUS_CONSTANT_ALPHA: number;
		BLEND_COLOR: number;

		/* Buffer Objects */
		ARRAY_BUFFER: number;
		ELEMENT_ARRAY_BUFFER: number;
		ARRAY_BUFFER_BINDING: number;
		ELEMENT_ARRAY_BUFFER_BINDING: number;

		STREAM_DRAW: number;
		STATIC_DRAW: number;
		DYNAMIC_DRAW: number;

		BUFFER_SIZE: number;
		BUFFER_USAGE: number;

		CURRENT_VERTEX_ATTRIB: number;

		/* CullFaceMode */
		FRONT: number;
		BACK: number;
		FRONT_AND_BACK: number;

		/* DepthFunction */
		/*      NEVER */
		/*      LESS */
		/*      EQUAL */
		/*      LEQUAL */
		/*      GREATER */
		/*      NOTEQUAL */
		/*      GEQUAL */
		/*      ALWAYS */

		/* EnableCap */
		/* TEXTURE_2D */
		CULL_FACE: number;
		BLEND: number;
		DITHER: number;
		STENCIL_TEST: number;
		DEPTH_TEST: number;
		SCISSOR_TEST: number;
		POLYGON_OFFSET_FILL: number;
		SAMPLE_ALPHA_TO_COVERAGE: number;
		SAMPLE_COVERAGE: number;

		/* ErrorCode */
		NO_ERROR: number;
		INVALID_ENUM: number;
		INVALID_VALUE: number;
		INVALID_OPERATION: number;
		OUT_OF_MEMORY: number;

		/* FrontFaceDirection */
		CW: number;
		CCW: number;

		/* GetPName */
		LINE_WIDTH: number;
		ALIASED_POINT_SIZE_RANGE: number;
		ALIASED_LINE_WIDTH_RANGE: number;
		CULL_FACE_MODE: number;
		FRONT_FACE: number;
		DEPTH_RANGE: number;
		DEPTH_WRITEMASK: number;
		DEPTH_CLEAR_VALUE: number;
		DEPTH_FUNC: number;
		STENCIL_CLEAR_VALUE: number;
		STENCIL_FUNC: number;
		STENCIL_FAIL: number;
		STENCIL_PASS_DEPTH_FAIL: number;
		STENCIL_PASS_DEPTH_PASS: number;
		STENCIL_REF: number;
		STENCIL_VALUE_MASK: number;
		STENCIL_WRITEMASK: number;
		STENCIL_BACK_FUNC: number;
		STENCIL_BACK_FAIL: number;
		STENCIL_BACK_PASS_DEPTH_FAIL: number;
		STENCIL_BACK_PASS_DEPTH_PASS: number;
		STENCIL_BACK_REF: number;
		STENCIL_BACK_VALUE_MASK: number;
		STENCIL_BACK_WRITEMASK: number;
		VIEWPORT: number;
		SCISSOR_BOX: number;
		/*      SCISSOR_TEST */
		COLOR_CLEAR_VALUE: number;
		COLOR_WRITEMASK: number;
		UNPACK_ALIGNMENT: number;
		PACK_ALIGNMENT: number;
		MAX_TEXTURE_SIZE: number;
		MAX_VIEWPORT_DIMS: number;
		SUBPIXEL_BITS: number;
		RED_BITS: number;
		GREEN_BITS: number;
		BLUE_BITS: number;
		ALPHA_BITS: number;
		DEPTH_BITS: number;
		STENCIL_BITS: number;
		POLYGON_OFFSET_UNITS: number;
		/*      POLYGON_OFFSET_FILL */
		POLYGON_OFFSET_FACTOR: number;
		TEXTURE_BINDING_2D: number;
		SAMPLE_BUFFERS: number;
		SAMPLES: number;
		SAMPLE_COVERAGE_VALUE: number;
		SAMPLE_COVERAGE_INVERT: number;

		/* GetTextureParameter */
		/*      TEXTURE_MAG_FILTER */
		/*      TEXTURE_MIN_FILTER */
		/*      TEXTURE_WRAP_S */
		/*      TEXTURE_WRAP_T */

		COMPRESSED_TEXTURE_FORMATS: number;

		/* HintMode */
		DONT_CARE: number;
		FASTEST: number;
		NICEST: number;

		/* HintTarget */
		GENERATE_MIPMAP_HINT: number;

		/* DataType */
		BYTE: number;
		UNSIGNED_BYTE: number;
		SHORT: number;
		UNSIGNED_SHORT: number;
		INT: number;
		UNSIGNED_INT: number;
		FLOAT: number;

		/* PixelFormat */
		DEPTH_COMPONENT: number;
		ALPHA: number;
		RGB: number;
		RGBA: number;
		LUMINANCE: number;
		LUMINANCE_ALPHA: number;

		/* PixelType */
		/*      UNSIGNED_BYTE */
		UNSIGNED_SHORT_4_4_4_4: number;
		UNSIGNED_SHORT_5_5_5_1: number;
		UNSIGNED_SHORT_5_6_5: number;

		/* Shaders */
		FRAGMENT_SHADER: number;
		VERTEX_SHADER: number;
		MAX_VERTEX_ATTRIBS: number;
		MAX_VERTEX_UNIFORM_VECTORS: number;
		MAX_VARYING_VECTORS: number;
		MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
		MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
		MAX_TEXTURE_IMAGE_UNITS: number;
		MAX_FRAGMENT_UNIFORM_VECTORS: number;
		SHADER_TYPE: number;
		DELETE_STATUS: number;
		LINK_STATUS: number;
		VALIDATE_STATUS: number;
		ATTACHED_SHADERS: number;
		ACTIVE_UNIFORMS: number;
		ACTIVE_ATTRIBUTES: number;
		SHADING_LANGUAGE_VERSION: number;
		CURRENT_PROGRAM: number;

		/* StencilFunction */
		NEVER: number;
		LESS: number;
		EQUAL: number;
		LEQUAL: number;
		GREATER: number;
		NOTEQUAL: number;
		GEQUAL: number;
		ALWAYS: number;

		/* StencilOp */
		/*      ZERO */
		KEEP: number;
		REPLACE: number;
		INCR: number;
		DECR: number;
		INVERT: number;
		INCR_WRAP: number;
		DECR_WRAP: number;

		/* StringName */
		VENDOR: number;
		RENDERER: number;
		VERSION: number;

		/* TextureMagFilter */
		NEAREST: number;
		LINEAR: number;

		/* TextureMinFilter */
		/*      NEAREST */
		/*      LINEAR */
		NEAREST_MIPMAP_NEAREST: number;
		LINEAR_MIPMAP_NEAREST: number;
		NEAREST_MIPMAP_LINEAR: number;
		LINEAR_MIPMAP_LINEAR: number;

		/* TextureParameterName */
		TEXTURE_MAG_FILTER: number;
		TEXTURE_MIN_FILTER: number;
		TEXTURE_WRAP_S: number;
		TEXTURE_WRAP_T: number;

		/* TextureTarget */
		TEXTURE_2D: number;
		TEXTURE: number;

		TEXTURE_CUBE_MAP: number;
		TEXTURE_BINDING_CUBE_MAP: number;
		TEXTURE_CUBE_MAP_POSITIVE_X: number;
		TEXTURE_CUBE_MAP_NEGATIVE_X: number;
		TEXTURE_CUBE_MAP_POSITIVE_Y: number;
		TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
		TEXTURE_CUBE_MAP_POSITIVE_Z: number;
		TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
		MAX_CUBE_MAP_TEXTURE_SIZE: number;

		/* TextureUnit */
		TEXTURE0: number;
		TEXTURE1: number;
		TEXTURE2: number;
		TEXTURE3: number;
		TEXTURE4: number;
		TEXTURE5: number;
		TEXTURE6: number;
		TEXTURE7: number;
		TEXTURE8: number;
		TEXTURE9: number;
		TEXTURE10: number;
		TEXTURE11: number;
		TEXTURE12: number;
		TEXTURE13: number;
		TEXTURE14: number;
		TEXTURE15: number;
		TEXTURE16: number;
		TEXTURE17: number;
		TEXTURE18: number;
		TEXTURE19: number;
		TEXTURE20: number;
		TEXTURE21: number;
		TEXTURE22: number;
		TEXTURE23: number;
		TEXTURE24: number;
		TEXTURE25: number;
		TEXTURE26: number;
		TEXTURE27: number;
		TEXTURE28: number;
		TEXTURE29: number;
		TEXTURE30: number;
		TEXTURE31: number;
		ACTIVE_TEXTURE: number;

		/* TextureWrapMode */
		REPEAT: number;
		CLAMP_TO_EDGE: number;
		MIRRORED_REPEAT: number;

		/* Uniform Types */
		FLOAT_VEC2: number;
		FLOAT_VEC3: number;
		FLOAT_VEC4: number;
		INT_VEC2: number;
		INT_VEC3: number;
		INT_VEC4: number;
		BOOL: number;
		BOOL_VEC2: number;
		BOOL_VEC3: number;
		BOOL_VEC4: number;
		FLOAT_MAT2: number;
		FLOAT_MAT3: number;
		FLOAT_MAT4: number;
		SAMPLER_2D: number;
		SAMPLER_CUBE: number;

		/* Vertex Arrays */
		VERTEX_ATTRIB_ARRAY_ENABLED: number;
		VERTEX_ATTRIB_ARRAY_SIZE: number;
		VERTEX_ATTRIB_ARRAY_STRIDE: number;
		VERTEX_ATTRIB_ARRAY_TYPE: number;
		VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
		VERTEX_ATTRIB_ARRAY_POINTER: number;
		VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;

		/* Shader Source */
		COMPILE_STATUS: number;

		/* Shader Precision-Specified Types */
		LOW_FLOAT: number;
		MEDIUM_FLOAT: number;
		HIGH_FLOAT: number;
		LOW_INT: number;
		MEDIUM_INT: number;
		HIGH_INT: number;

		/* Framebuffer Object. */
		FRAMEBUFFER: number;
		RENDERBUFFER: number;

		RGBA4: number;
		RGB5_A1: number;
		RGB565: number;
		DEPTH_COMPONENT16: number;
		STENCIL_INDEX: number;
		STENCIL_INDEX8: number;
		DEPTH_STENCIL: number;

		RENDERBUFFER_WIDTH: number;
		RENDERBUFFER_HEIGHT: number;
		RENDERBUFFER_INTERNAL_FORMAT: number;
		RENDERBUFFER_RED_SIZE: number;
		RENDERBUFFER_GREEN_SIZE: number;
		RENDERBUFFER_BLUE_SIZE: number;
		RENDERBUFFER_ALPHA_SIZE: number;
		RENDERBUFFER_DEPTH_SIZE: number;
		RENDERBUFFER_STENCIL_SIZE: number;

		FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
		FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
		FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
		FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;

		COLOR_ATTACHMENT0: number;
		DEPTH_ATTACHMENT: number;
		STENCIL_ATTACHMENT: number;
		DEPTH_STENCIL_ATTACHMENT: number;

		NONE: number;

		FRAMEBUFFER_COMPLETE: number;
		FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
		FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
		FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
		FRAMEBUFFER_UNSUPPORTED: number;

		FRAMEBUFFER_BINDING: number;
		RENDERBUFFER_BINDING: number;
		MAX_RENDERBUFFER_SIZE: number;

		INVALID_FRAMEBUFFER_OPERATION: number;

		/* WebGL-specific enums */
		UNPACK_FLIP_Y_WEBGL: number;
		UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
		CONTEXT_LOST_WEBGL: number;
		UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
		BROWSER_DEFAULT_WEBGL: number;

		canvas: HTMLCanvasElement;
		drawingBufferWidth: number;
		drawingBufferHeight: number;

		isContextLost(): boolean;
		getContextAttributes(): HG.Platform.IPlatformGLContextAttributes;

		getSupportedExtensions(): string[];
		getExtension(name: string): any;

		activeTexture(texture: number): void;
		attachShader(program: HG.Platform.IPlatformGLProgram, shader: HG.Platform.IPlatformGLShader):
			void;
		bindAttribLocation(program: HG.Platform.IPlatformGLProgram, index: number, name: string):
			void;
		bindBuffer(target: number, buffer: HG.Platform.IPlatformGLBuffer): void;
		bindFramebuffer(target: number, framebuffer: HG.Platform.IPlatformGLFramebuffer): void;
		bindRenderbuffer(target: number, renderbuffer: HG.Platform.IPlatformGLRenderbuffer): void;
		bindTexture(target: number, texture: HG.Platform.IPlatformGLTexture): void;
		blendColor(red: number, green: number, blue: number, alpha: number): void;
		blendEquation(mode: number): void;
		blendEquationSeparate(modeRGB: number, modeAlpha: number): void;
		blendFunc(sfactor: number, dfactor: number): void;
		blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): void;

		bufferData(target: number, size: number, usage: number): void;
		bufferData(target: number, data: ArrayBufferView, usage: number): void;
		bufferData(target: number, data: ArrayBuffer, usage: number): void;
		bufferSubData(target: number, offset: number, data: ArrayBufferView): void;
		bufferSubData(target: number, offset: number, data: ArrayBuffer): void;

		checkFramebufferStatus(target: number): number;
		clear(mask: number): void;
		clearColor(red: number, green: number, blue: number, alpha: number): void;
		clearDepth(depth: number): void;
		clearStencil(s: number): void;
		colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
		compileShader(shader: HG.Platform.IPlatformGLShader): void;

		compressedTexImage2D(target: number, level: number, internalformat: number, width: number,
			height: number, border: number, data: ArrayBufferView): void;
		compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			width: number, height: number, format: number, data: ArrayBufferView): void;

		copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number,
			width: number, height: number, border: number): void;
		copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			x: number, y: number, width: number, height: number): void;

		createBuffer(): HG.Platform.IPlatformGLBuffer;
		createFramebuffer(): HG.Platform.IPlatformGLFramebuffer;
		createProgram(): HG.Platform.IPlatformGLProgram;
		createRenderbuffer(): HG.Platform.IPlatformGLRenderbuffer;
		createShader(type: number): HG.Platform.IPlatformGLShader;
		createTexture(): HG.Platform.IPlatformGLTexture;

		cullFace(mode: number): void;

		deleteBuffer(buffer: HG.Platform.IPlatformGLBuffer): void;
		deleteFramebuffer(framebuffer: HG.Platform.IPlatformGLFramebuffer): void;
		deleteProgram(program: HG.Platform.IPlatformGLProgram): void;
		deleteRenderbuffer(renderbuffer: HG.Platform.IPlatformGLRenderbuffer): void;
		deleteShader(shader: HG.Platform.IPlatformGLShader): void;
		deleteTexture(texture: HG.Platform.IPlatformGLTexture): void;

		depthFunc(func: number): void;
		depthMask(flag: boolean): void;
		depthRange(zNear: number, zFar: number): void;
		detachShader(program: HG.Platform.IPlatformGLProgram, shader: HG.Platform.IPlatformGLShader):
			void;
		disable(cap: number): void;
		disableVertexAttribArray(index: number): void;
		drawArrays(mode: number, first: number, count: number): void;
		drawElements(mode: number, count: number, type: number, offset: number): void;

		enable(cap: number): void;
		enableVertexAttribArray(index: number): void;
		finish(): void;
		flush(): void;
		framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number,
			renderbuffer: HG.Platform.IPlatformGLRenderbuffer): void;
		framebufferTexture2D(target: number, attachment: number, textarget: number,
			texture: HG.Platform.IPlatformGLTexture, level: number): void;
		frontFace(mode: number): void;

		generateMipmap(target: number): void;

		getActiveAttrib(program: HG.Platform.IPlatformGLProgram, index: number):
			HG.Platform.IPlatformGLActiveInfo;
		getActiveUniform(program: HG.Platform.IPlatformGLProgram, index: number):
			HG.Platform.IPlatformGLActiveInfo;
		getAttachedShaders(program: HG.Platform.IPlatformGLProgram): HG.Platform.IPlatformGLShader[];

		getAttribLocation(program: HG.Platform.IPlatformGLProgram, name: string): number;

		getBufferParameter(target: number, pname: number): any;
		getParameter(pname: number): any;

		getError(): number;

		getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): any;
		getProgramParameter(program: HG.Platform.IPlatformGLProgram, pname: number): any;
		getProgramInfoLog(program: HG.Platform.IPlatformGLProgram): string;
		getRenderbufferParameter(target: number, pname: number): any;
		getShaderParameter(shader: HG.Platform.IPlatformGLShader, pname: number): any;
		getShaderPrecisionFormat(shadertype: number, precisiontype: number):
			HG.Platform.IPlatformGLShaderPrecisionFormat;
		getShaderInfoLog(shader: HG.Platform.IPlatformGLShader): string;

		getShaderSource(shader: HG.Platform.IPlatformGLShader): string;

		getTexParameter(target: number, pname: number): any;

		getUniform(program: HG.Platform.IPlatformGLProgram,
			location: HG.Platform.IPlatformGLUniformLocation): any;

		getUniformLocation(program: HG.Platform.IPlatformGLProgram, name: string):
			HG.Platform.IPlatformGLUniformLocation;

		getVertexAttrib(index: number, pname: number): any;

		getVertexAttribOffset(index: number, pname: number): number;

		hint(target: number, mode: number): void;
		isBuffer(buffer: HG.Platform.IPlatformGLBuffer): boolean;
		isEnabled(cap: number): boolean;
		isFramebuffer(framebuffer: HG.Platform.IPlatformGLFramebuffer): boolean;
		isProgram(program: HG.Platform.IPlatformGLProgram): boolean;
		isRenderbuffer(renderbuffer: HG.Platform.IPlatformGLRenderbuffer): boolean;
		isShader(shader: HG.Platform.IPlatformGLShader): boolean;
		isTexture(texture: HG.Platform.IPlatformGLTexture): boolean;
		lineWidth(width: number): void;
		linkProgram(program: HG.Platform.IPlatformGLProgram): void;
		pixelStorei(pname: number, param: number): void;
		polygonOffset(factor: number, units: number): void;

		readPixels(x: number, y: number, width: number, height: number, format: number,
			type: number, pixels: ArrayBufferView): void;

		renderbufferStorage(target: number, internalformat: number, width: number,
			height: number): void;
		sampleCoverage(value: number, invert: boolean): void;
		scissor(x: number, y: number, width: number, height: number): void;

		shaderSource(shader: HG.Platform.IPlatformGLShader, source: string): void;

		stencilFunc(func: number, ref: number, mask: number): void;
		stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
		stencilMask(mask: number): void;
		stencilMaskSeparate(face: number, mask: number): void;
		stencilOp(fail: number, zfail: number, zpass: number): void;
		stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;

		texImage2D(target: number, level: number, internalformat: number, width: number,
			height: number, border: number, format: number, type: number, pixels: ArrayBufferView):
			void;
		texImage2D(target: number, level: number, internalformat: number, format: number,
			type: number, pixels: ImageData): void;
		texImage2D(target: number, level: number, internalformat: number, format: number,
			type: number, image: HTMLImageElement): void; // May throw DOMException
		texImage2D(target: number, level: number, internalformat: number, format: number,
			type: number, canvas: HTMLCanvasElement): void; // May throw DOMException
		texImage2D(target: number, level: number, internalformat: number, format: number,
			type: number, video: HTMLVideoElement): void; // May throw DOMException

		texParameterf(target: number, pname: number, param: number): void;
		texParameteri(target: number, pname: number, param: number): void;

		texSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			width: number, height: number, format: number, type: number, pixels: ArrayBufferView):
			void;
		texSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			format: number, type: number, pixels: ImageData): void;
		texSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			format: number, type: number, image: HTMLImageElement): void; // May throw DOMException
		texSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			format: number, type: number, canvas: HTMLCanvasElement): void; // May throw
		texSubImage2D(target: number, level: number, xoffset: number, yoffset: number,
			format: number, type: number, video: HTMLVideoElement): void; // May throw DOMException

		uniform1f(location: HG.Platform.IPlatformGLUniformLocation, x: number): void;
		uniform1fv(location: HG.Platform.IPlatformGLUniformLocation, v: Float32Array): void;
		uniform1fv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform1i(location: HG.Platform.IPlatformGLUniformLocation, x: number): void;
		uniform1iv(location: HG.Platform.IPlatformGLUniformLocation, v: Int32Array): void;
		uniform1iv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform2f(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number): void;
		uniform2fv(location: HG.Platform.IPlatformGLUniformLocation, v: Float32Array): void;
		uniform2fv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform2i(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number): void;
		uniform2iv(location: HG.Platform.IPlatformGLUniformLocation, v: Int32Array): void;
		uniform2iv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform3f(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number,
			z: number): void;
		uniform3fv(location: HG.Platform.IPlatformGLUniformLocation, v: Float32Array): void;
		uniform3fv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform3i(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number,
			z: number): void;
		uniform3iv(location: HG.Platform.IPlatformGLUniformLocation, v: Int32Array): void;
		uniform3iv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform4f(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number,
			z: number, w: number): void;
		uniform4fv(location: HG.Platform.IPlatformGLUniformLocation, v: Float32Array): void;
		uniform4fv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;
		uniform4i(location: HG.Platform.IPlatformGLUniformLocation, x: number, y: number,
			z: number, w: number): void;
		uniform4iv(location: HG.Platform.IPlatformGLUniformLocation, v: Int32Array): void;
		uniform4iv(location: HG.Platform.IPlatformGLUniformLocation, v: number[]): void;

		uniformMatrix2fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: Float32Array): void;
		uniformMatrix2fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: number[]): void;
		uniformMatrix3fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: Float32Array): void;
		uniformMatrix3fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: number[]): void;
		uniformMatrix4fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: Float32Array): void;
		uniformMatrix4fv(location: HG.Platform.IPlatformGLUniformLocation, transpose: boolean,
			value: number[]): void;

		useProgram(program: HG.Platform.IPlatformGLProgram): void;
		validateProgram(program: HG.Platform.IPlatformGLProgram): void;

		vertexAttrib1f(indx: number, x: number): void;
		vertexAttrib1fv(indx: number, values: Float32Array): void;
		vertexAttrib1fv(indx: number, value: number[]): void;
		vertexAttrib2f(indx: number, x: number, y: number): void;
		vertexAttrib2fv(indx: number, values: Float32Array): void;
		vertexAttrib2fv(indx: number, value: number[]): void;
		vertexAttrib3f(indx: number, x: number, y: number, z: number): void;
		vertexAttrib3fv(indx: number, values: Float32Array): void;
		vertexAttrib3fv(indx: number, value: number[]): void;
		vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): void;
		vertexAttrib4fv(indx: number, values: Float32Array): void;
		vertexAttrib4fv(indx: number, value: number[]): void;
		vertexAttribPointer(indx: number, size: number, type: number, normalized: boolean,
			stride: number, offset: number): void;

		viewport(x: number, y: number, width: number, height: number): void;
	}

}