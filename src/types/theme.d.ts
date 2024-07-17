import type { fonts } from "client/ui/react/themes/fonts";
import type { images } from "client/ui/react/themes/images";

export interface Theme {
	colors: {
		background: Color3;
		border: Color3;
		card: Color3;
		primary: Color3;
		secondary: Color3;
		text: {
			link: Color3;
			primary: Color3;
			secondary: Color3;
		};
	};
	fonts: typeof fonts;
	images: typeof images;
}
