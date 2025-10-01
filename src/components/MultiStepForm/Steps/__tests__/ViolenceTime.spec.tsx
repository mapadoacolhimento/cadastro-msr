import { render } from "@testing-library/react";

import ViolenceTime from "../ViolenceTime";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					violenceTime: [],
				} as unknown as Values
			}
		>
			{ViolenceTime()}
		</MultiStepFormWrapper>
	);
};
