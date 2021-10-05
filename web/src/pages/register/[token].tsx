import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Center } from '@chakra-ui/react';
import { Wrapper } from '../../components/Wrapper';
import { InputField } from '../../components/InputField';
import {
  useRegisterMutation,
  useVerifyInviteTokenLazyQuery,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../../utils/withApollo';
import { toErrorMap } from '../../utils/toErrorMap';
import { FormWrapper } from '../../components/FormWrapper';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [invalid, setInvalid] = useState(false);
  const [valid, setValid] = useState(false);
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
      <Formik
        initialValues={{ phone: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          let res;
          try {
            res = await register({
              variables: { options: { ...values, token } },
            });
          } catch (e) {}
          const { data } = res;
          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          } else if (data?.register.success) {
            router.push('/');
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <FormWrapper mt={8}>
            <Form>
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  type='tel'
                  name='phone'
                  placeholder='phone'
                  label='Phone (optional)'
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
          </FormWrapper>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
