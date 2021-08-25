import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import { BeproService } from 'services';
import * as Yup from 'yup';

import CreateMarketFormActions from './CreateMarketFormActions';
import CreateMarketFormConfigure from './CreateMarketFormConfigure';
import CreateMarketFormFund from './CreateMarketFormFund';

type Outcome = {
  name: string;
  // probability: number;
};

export type CreateMarketFormData = {
  question: string;
  firstOutcome: Outcome;
  secondOutcome: Outcome;
  image: {
    file: any;
    hash: string;
    isUploaded: boolean;
  };
  category: string;
  subcategory: string;
  closingDate: string;
  liquidity: number;
};

const initialData: CreateMarketFormData = {
  question: '',
  firstOutcome: {
    name: ''
    // probability: 50
  },
  secondOutcome: {
    name: ''
    // probability: 50
  },
  image: {
    file: undefined,
    hash: '',
    isUploaded: false
  },
  category: '',
  subcategory: '',
  closingDate: '',
  liquidity: 0
};

const validationSchema = Yup.object().shape({
  question: Yup.string().required('Market Question is required!'),
  firstOutcome: Yup.object().shape({
    name: Yup.string().required('Outcome name is required!')
    // probability: Yup.number()
    //   .min(0, 'The probability of the Outcome must be greater or equal than 0!')
    //   .max(
    //     100,
    //     'The probability of the Outcome must be less or equal than 100!'
    //   )
    //   .required('Outcome probability is required!')
  }),
  secondOutcome: Yup.object().shape({
    name: Yup.string().required('Outcome name is required!')
    // probability: Yup.number()
    //   .min(0, 'The probability of the Outcome must be greater or equal than 0!')
    //   .max(
    //     100,
    //     'The probability of the Outcome must be less or equal than 100!'
    //   )
    //   .required('Outcome probability is required!')
  }),
  image: Yup.object().shape({
    hash: Yup.string().required('Image is required!')
  }),
  category: Yup.string().required('Category is required!'),
  subcategory: Yup.string().required('Subcategory is required!'),
  closingDate: Yup.date()
    .min(
      dayjs().format('MM/DD/YYYY'),
      `Closing date must be later than ${dayjs().format('MM/DD/YYYY')}`
    )
    .required('Closing date is required!')
});

function CreateMarketForm() {
  async function handleFormSubmit(values: CreateMarketFormData) {
    const beproService = new BeproService();
    const closingDate = new Date(values.closingDate).getTime() / 1000; // TODO: move to dayjs
    const outcomes = [values.firstOutcome.name, values.secondOutcome.name];
    const category = `${values.category};${values.subcategory}`;

    const response = await beproService.createMarket(
      values.question,
      values.image.hash,
      closingDate,
      outcomes,
      category,
      values.liquidity
    );

    // TODO: show toast
    // TODO: call polkamarkets api
  }

  return (
    <Formik
      initialValues={initialData}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await handleFormSubmit(values);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >
      <Form className="pm-c-create-market-form">
        <CreateMarketFormConfigure />
        <CreateMarketFormFund />
        <CreateMarketFormActions />
      </Form>
    </Formik>
  );
}

export default CreateMarketForm;
