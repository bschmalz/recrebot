import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { FormWrapper } from '../components/FormWrapper';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>if an account with an email exists, we sent you an email.</Box>
          ) : (
            <FormWrapper mt={8}>
              <Form>
                <InputField
                  name='email'
                  placeholder='email'
                  label='Email'
                  type='email'
                />
                <Button
                  type='submit'
                  mt={4}
                  isLoading={isSubmitting}
                  colorScheme='teal'
                >
                  forgot password
                </Button>
              </Form>
            </FormWrapper>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
