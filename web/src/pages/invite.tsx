import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useInviteMutation, useMeQuery } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import { FormWrapper } from '../components/FormWrapper';

const Invite: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [invite] = useInviteMutation();
  const { data } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (data?.me?.email && data.me.email !== process.env.NEXT_PUBLIC_EMAIL) {
      router.push('/');
    }
  }, [router, data]);
  if (!data?.me?.email || data.me.email !== process.env.NEXT_PUBLIC_EMAIL) {
    return <></>;
  }

  return (
    <Wrapper variant='small'>
      {emailSent ? (
        <Box>
          An email has been sent to your address. Confirm your email account to
          finish registration.
        </Box>
      ) : (
        <Formik
          initialValues={{ email: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await invite({
              variables: { options: values },
            });
            if (response.data?.invite.errors) {
              setErrors(toErrorMap(response.data.invite.errors));
            } else if (response.data?.invite.success) {
              setEmailSent(true);
            }
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <FormWrapper mt={8}>
              <Form>
                <InputField name='email' placeholder='email' label='email' />

                <Button
                  type='submit'
                  mt={4}
                  isLoading={isSubmitting}
                  colorScheme='teal'
                >
                  invite
                </Button>
              </Form>
            </FormWrapper>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Invite);
