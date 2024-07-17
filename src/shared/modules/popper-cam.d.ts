interface Poppercam {
	Update(
		renderDt: number,
		desiredCframe: CFrame,
		desiredFocus: CFrame,
		depth: number,
	): LuaTuple<[CFrame, CFrame, number]>;
}

type PoppercamConstructor = new () => Poppercam;

declare const Poppercam: PoppercamConstructor;
export = Poppercam;
