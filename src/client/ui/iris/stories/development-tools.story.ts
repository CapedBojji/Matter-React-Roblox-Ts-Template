import { developmentTools } from "../components/development-tools";
import { createIrisStory } from "../functions/create-story";

export = async function (parent: GuiObject) {
	return createIrisStory({
		component: developmentTools,
		parent,
	});
};
