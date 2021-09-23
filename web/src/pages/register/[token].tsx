import React, { useEffect, useState } from 'react';
import { Formik, Form, setIn } from 'formik';
import { Box, Button, Center } from '@chakra-ui/react';
import { Wrapper } from '../../components/Wrapper';
import { InputField } from '../../components/InputField';
import {
  useInviteMutation,
  useRegisterMutation,
  useVerifyInviteTokenLazyQuery,
} from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../../utils/withApollo';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [invalid, setInvalid] = useState(false);
  const [valid, setValid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const [register] = useRegisterMutation();
  const [verifyInviteToken, tokenData] = useVerifyInviteTokenLazyQuery();
  const token = router?.query?.token as string;

  const validateToken = async () => {
    try {
      await verifyInviteToken({ variables: { token } });
    } catch (e) {
      setInvalid(true);
    }
  };

  useEffect(() => {
    if (token) validateToken();
  }, [token]);

  useEffect(() => {
    if (tokenData?.data?.verifyInviteToken) {
      if (tokenData?.data?.verifyInviteToken.isValid === false) {
        setInvalid(true);
      } else {
        setValid(true);
      }
    }
  }, [tokenData]);

  if (invalid)
    return (
      <Wrapper>
        <Center>It appears your token is no longer valid.</Center>
      </Wrapper>
    );

  if (!valid) {
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
          initialValues={{ email: '', phone: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
            });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.success) {
              setEmailSent(true);
            }
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <InputField name='email' placeholder='email' label='email' />

              <Box mt={4}>
                <InputField name='phone' placeholder='phone' label='phone' />
              </Box>
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                />
              </Box>
              <Button
                type='submit'
                mt={4}
                isLoading={isSubmitting}
                colorScheme='teal'
              >
                register
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
