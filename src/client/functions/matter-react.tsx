import { Signal } from "@rbxts/lemon-signal";
import { log, useHookState } from "@rbxts/matter";
import { useMap } from "@rbxts/pretty-matter-hooks";
import type { ComponentType, Element, PropsWithChildren } from "@rbxts/react";
import React, {
	createContext,
	createElement,
	StrictMode,
	useContext,
	useEffect,
	useState,
} from "@rbxts/react";
import { createRoot, type Root } from "@rbxts/react-roblox";
import Sift from "@rbxts/sift";

import { createUniqueKey } from "client/ui/react/functions";
import type { Middleware } from "types/matter";

// ████████╗██╗   ██╗██████╗ ███████╗███████╗
// ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
//    ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
//    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
//    ██║      ██║   ██║     ███████╗███████║
//    ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝

interface Storage<R extends Array<unknown>> {
	component?: ComponentType;
	dependencies?: Array<unknown>;
	dependenciesChanged: Signal<[Array<unknown>]>;
	element?: Element;
	ready: boolean;
	readySignal: Signal<[]>;
	values?: R;
	valuesChanged: Signal<[R]>;
}

let root: Root | undefined;
// eslint-disable-next-line comment-length/limit-single-line-comments -- Art
//  ██████╗ ██████╗ ███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗████████╗███████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║╚══██╔══╝██╔════╝
// ██║     ██║   ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║   ██║   ███████╗
// ██║     ██║   ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║   ██║   ╚════██║
// ╚██████╗╚██████╔╝██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║   ██║   ███████║
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
const parametersContext = createContext<Array<unknown> | undefined>(undefined);
const returnValuesContext = createContext<((values: Array<unknown>) => void) | undefined>(
	undefined,
);
let middlewareReady = false;
const stack = {
	current: new Array<Element>(),
	previous: new Array<Element>(),
};

// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
function ParametersProvider({
	params,
	children,
}: PropsWithChildren<{ params: Array<unknown> }>): Element {
	return <parametersContext.Provider value={params}>{children}</parametersContext.Provider>;
}

function ReturnValuesProvider({
	func: values,
	children,
}: PropsWithChildren<{ func: (values: Array<unknown>) => void }>): Element {
	return <returnValuesContext.Provider value={values}>{children}</returnValuesContext.Provider>;
}

export function useParameters<T extends Array<unknown>>(): T {
	const parameters = useContext(parametersContext);
	if (parameters === undefined) throw "Parameters not provided";
	return parameters as T;
}

export function useReturner<T extends Array<unknown>>(): (values: T) => void {
	const values = useContext(returnValuesContext);
	if (values === undefined) throw "Return values not provided";
	return values;
}

function MatterReactComponentWrapper({
	dependencies,
	dependenciesChanged,
	readySignal,
	valuesChanged,
	children,
}: PropsWithChildren<{
	dependencies: Array<unknown>;
	dependenciesChanged: Signal<Array<unknown>>;
	readySignal: Signal<[]>;
	valuesChanged: Signal<Array<unknown>>;
}>): Element {
	const [parameters, setParameters] = useState(dependencies);

	dependenciesChanged.Connect((...parameters_) => {
		setParameters(parameters_);
	});

	function onValuesChanged(values: Array<unknown>): void {
		valuesChanged.Fire(values);
	}

	useEffect(() => {
		readySignal.Fire();
	});

	return (
		<ParametersProvider params={parameters}>
			<ReturnValuesProvider func={onValuesChanged}>{children}</ReturnValuesProvider>
		</ParametersProvider>
	);
}

function storageCleaner(storage: Storage<Array<unknown>>): void {
	storage.dependenciesChanged.DisconnectAll();
	storage.valuesChanged.DisconnectAll();
	storage.readySignal.DisconnectAll();
	storage.element = undefined;
	storage.ready = false;
}

function reloadRoot<Props extends PropsWithChildren>(
	rootHome: Instance,
	elementsWrap?: ComponentType<Props>,
	props?: Props,
): void {
	root?.unmount();
	const elements = stack.current;
	root = createRoot(rootHome);
	root.render(
		<StrictMode>
			{elementsWrap !== undefined
				? createElement<Props>(elementsWrap, props, elements)
				: elements}
		</StrictMode>,
	);
}

export function useReact<R extends Array<unknown>>(
	component: ComponentType,
	dependencies: Array<unknown>,
	discriminator?: unknown,
): LuaTuple<[boolean, R | undefined]> {
	const storage = useHookState<Storage<R>>(discriminator, storageCleaner);
	const generator = useMap(discriminator, createUniqueKey()).value;
	// Middleware is not ready
	if (!middlewareReady) {
		log("Middleware is not ready");
		return $tuple(false, undefined);
	}

	// The effect was not called last frame
	// or the component has changed
	if (storage.element === undefined || storage.component !== component) {
		log("Component changed", component);
		storage.dependenciesChanged = new Signal();
		storage.dependencies = dependencies;
		storage.valuesChanged = new Signal();
		storage.readySignal = new Signal();
		storage.ready = false;
		storage.component = component;
		storage.element = createElement(
			MatterReactComponentWrapper,
			{
				dependencies: storage.dependencies,
				dependenciesChanged: storage.dependenciesChanged,
				key: generator(`Matter-React-Wrap`),
				readySignal: storage.readySignal,
				valuesChanged: storage.valuesChanged,
			},
			createElement(component, {
				key: generator(`Matter-React-Component ${tostring(component)}`),
			}),
		);

		storage.valuesChanged.Connect(values => {
			storage.ready = true;
			storage.values = values;
		});

		storage.readySignal.Connect(() => {
			storage.ready = true;
		});
	}

	// The dependencies have changed
	if (!Sift.Array.equals(storage.dependencies, dependencies)) {
		log(`Dependencies changed for ${storage.element.key}`);
		storage.ready = false;
		storage.dependencies = dependencies;
		storage.dependenciesChanged.Fire(dependencies);
	}

	addToStack(storage.element);
	return $tuple(storage.ready, storage.values);
}

function addToStack(element: Element): void {
	stack.current.push(element);
}

function checkStackDiff(): boolean {
	return !Sift.Array.equals(stack.current, stack.previous);
}

function updateStack(): void {
	stack.previous = stack.current;
	stack.current = [];
}

export function reloadGui(): void {
	stack.current = [];
}

export function matterReact<Props extends PropsWithChildren>(
	rootHome: Instance,
	elementsWrap?: ComponentType<Props>,
	props?: Props,
): Middleware {
	function middleware(nextFunc: () => void): () => void {
		middlewareReady = true;
		return () => {
			nextFunc();
			if (checkStackDiff()) reloadRoot(rootHome, elementsWrap, props);
			updateStack();
		};
	}

	return middleware;
}
