// Generated by dts-bundle-generator v5.9.0

/// <reference types="babel__traverse" />
/// <reference types="node" />
/// <reference types="react-native" />

import * as t from '@babel/types';

export interface TamaguiOptions {
	components: string[];
	config?: string;
	evaluateVars?: boolean;
	importsWhitelist?: string[];
	disableExtraction?: boolean;
	exclude?: RegExp;
	logTimings?: boolean;
	cssPath?: string;
	cssData?: any;
	deoptProps?: Set<string>;
	excludeProps?: string[];
}
export declare type ExtractedAttrAttr = {
	type: "attr";
	value: t.JSXAttribute | t.JSXSpreadAttribute;
};
export declare type ExtractedAttrStyle = {
	type: "style";
	value: Object;
};
export declare type ExtractedAttr = ExtractedAttrAttr | {
	type: "ternary";
	value: Ternary;
} | ExtractedAttrStyle;
export declare type ExtractTagProps = {
	attrs: ExtractedAttr[];
	node: t.JSXOpeningElement;
	attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any;
	jsxPath: NodePath<t.JSXElement>;
	programPath: NodePath<t.Program>;
	originalNodeName: string;
	lineNumbers: string;
	filePath: string;
	isFlattened: boolean;
};
export declare type ExtractorParseProps = TamaguiOptions & {
	sourcePath?: string;
	shouldPrintDebug?: boolean;
	onExtractTag: (props: ExtractTagProps) => void;
	getFlattenedNode: (props: {
		isTextView: boolean;
		tag: string;
	}) => string;
	onDidFlatten?: () => void;
};
export interface Ternary {
	test: t.Expression;
	inlineMediaQuery?: string;
	remove: Function;
	consequent: Object | null;
	alternate: Object | null;
}
declare class Variable {
	name: string;
	val: string | number;
	variable: string | number;
	constructor({ val, name }: VariableIn);
}
export declare type VariableIn = {
	val: string | number;
	name: string;
};
export declare type ThemeProviderProps = {
	themes: any;
	defaultTheme: string;
	disableRootThemeClass?: boolean;
	children?: any;
};
export declare type StylesBase = Omit<ViewStyle, "display" | "backfaceVisibility"> & TransformStyleProps & {
	cursor?: string;
	contain?: "none" | "strict" | "content" | "size" | "layout" | "paint" | string;
	display?: "inherit" | "none" | "inline" | "block" | "contents" | "flex" | "inline-flex";
};
export declare type StyleKeys = keyof StylesBase;
export declare type GenericTokens = CreateTokens;
export declare type GenericThemes = {
	[key: string]: {
		bg: string | Variable;
		bg2: string | Variable;
		bg3: string | Variable;
		bg4: string | Variable;
		color: string | Variable;
		color2: string | Variable;
		color3: string | Variable;
		color4: string | Variable;
		borderColor: string | Variable;
		borderColor2: string | Variable;
		shadowColor: string | Variable;
		shadowColor2: string | Variable;
	};
};
export declare type GenericShorthands<VK extends string = string> = {
	[key in VK]: StyleKeys;
};
export declare type GenericMedia<K extends string = string> = {
	[key in K]: {
		[key: string]: number | string;
	};
};
export declare type CreateTamaguiConfig<A extends GenericTokens, B extends GenericThemes, C extends GenericShorthands, D extends GenericMedia> = Partial<Pick<ThemeProviderProps, "defaultTheme" | "disableRootThemeClass">> & {
	tokens: A;
	themes: B;
	shorthands: C;
	media: D;
};
export declare type TamaguiInternalConfig<A extends GenericTokens = GenericTokens, B extends GenericThemes = GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia> = CreateTamaguiConfig<A, B, C, D> & {
	Provider: (props: TamaguiProviderProps) => JSX.Element;
	themeParsed: {
		[key: string]: Variable;
	};
	tokensParsed: CreateTokens<Variable>;
	themeConfig: any;
	getCSS: () => string;
};
export interface CreateTokens<Val extends number | string | Variable = number | string | Variable, TextKeys extends string = string> {
	font: {
		[key in TextKeys]: Val;
	};
	fontSize: {
		[key in TextKeys]: Val;
	};
	lineHeight: {
		[key in TextKeys]: Val;
	};
	letterSpace: {
		[key in TextKeys]: Val;
	};
	color: {
		[key: string]: Val;
	};
	space: {
		[key: string]: Val;
	};
	size: {
		[key: string]: Val;
	};
	radius: {
		[key: string]: Val;
	};
	zIndex: {
		[key: string]: Val;
	};
}
export declare type TransformStyleProps = {
	x?: number;
	y?: number;
	perspective?: number;
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	skewX?: string;
	skewY?: string;
	matrix?: number[];
	rotate?: string;
	rotateY?: string;
	rotateX?: string;
	rotateZ?: string;
};
export declare type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, "children">> & {
	initialWindowMetrics?: any;
	fallback?: any;
	children?: any;
};
export declare type Extractor = ReturnType<typeof createExtractor>;
export declare function createExtractor(): {
	getTamaguiConfig(): TamaguiInternalConfig<import("@tamagui/core").CreateTokens<string | number | import("@tamagui/core").Variable, string>, {
		[key: string]: {
			bg: string | import("@tamagui/core").Variable;
			bg2: string | import("@tamagui/core").Variable;
			bg3: string | import("@tamagui/core").Variable;
			bg4: string | import("@tamagui/core").Variable;
			color: string | import("@tamagui/core").Variable;
			color2: string | import("@tamagui/core").Variable;
			color3: string | import("@tamagui/core").Variable;
			color4: string | import("@tamagui/core").Variable;
			borderColor: string | import("@tamagui/core").Variable;
			borderColor2: string | import("@tamagui/core").Variable;
			shadowColor: string | import("@tamagui/core").Variable;
			shadowColor2: string | import("@tamagui/core").Variable;
		};
	}, import("@tamagui/core").GenericShorthands<string>, {
		[x: string]: {
			[key: string]: string | number;
		};
	}>;
	parse: (fileOrPath: NodePath<t.Program> | t.File, { config, importsWhitelist, evaluateVars, shouldPrintDebug, sourcePath, onExtractTag, getFlattenedNode, onDidFlatten, ...props }: ExtractorParseProps) => null | undefined;
};
export declare function literalToAst(literal: any): t.Expression;
export declare const CSS_FILE_NAME = "__snack.css";
export declare const MEDIA_SEP = "_";
export declare const cacheDir: any;
export declare const CONCAT_CLASSNAME_IMPORT = "concatClassName";
export declare function extractToClassNames({ loader, extractor, source, sourcePath, options, shouldPrintDebug, threaded, cssPath, }: {
	loader: any;
	extractor: Extractor;
	source: string | Buffer;
	sourcePath: string;
	options: TamaguiOptions;
	shouldPrintDebug: boolean;
	cssPath: string;
	threaded?: boolean;
}): null | {
	js: string | Buffer;
	styles: string;
	stylesPath?: string;
	ast: t.File;
	map: any;
};
export declare function isPresent<T extends Object>(input: null | void | undefined | T): input is T;
export declare function isSimpleSpread(node: t.JSXSpreadAttribute): boolean;
export declare const attrStr: (attr: ExtractedAttr) => string | t.JSXIdentifier;
export declare const objToStr: (obj: any) => any;
export declare const ternaryStr: (x: Ternary) => string;
export declare function findComponentName(scope: any): string | undefined;
export declare function isValidThemeHook(jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourcePath: string): boolean;
export declare const isInsideTamagui: (srcName: string) => boolean;
export declare function patchReactNativeWeb(): void;

export {};