import { ErrorMessage, Field } from "formik";
import * as Yup from "yup";

import WizardStep from ".";
import { sleep } from "../../utils";

const supportTypeSchema = Yup.object({
  supportType: Yup.string()
    .oneOf(["psychological", "legal"])
    .required("Esse campo é obrigatório."),
});

export default function SupportType() {
  return (
    <WizardStep
      onSubmit={() => sleep(300).then(() => console.log("Step3 onSubmit"))}
      validationSchema={supportTypeSchema}
      title={"Sobre o acolhimento"}
      subtitle={"Que tipo de acolhimento você precisa?"}
    >
      <div role="group" aria-labelledby="my-radio-group">
        <label>
          <Field type="radio" name="supportType" value="psychological" />
          Acolhimento psicológico
        </label>
        <label>
          <Field type="radio" name="supportType" value="legal" />
          Acolhimento jurídico
        </label>
        <ErrorMessage name="supportType" />
      </div>
    </WizardStep>
  );
}
