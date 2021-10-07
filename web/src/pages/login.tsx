import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';
import { FormWrapper } from '../components/FormWrapper';

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user,
                },
              });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <FormWrapper mt={8}>
            <Form>
              <InputField
                name='email'
                placeholder='Email'
                label='Email'
                data-cy='email-input'
              />
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                  data-cy='password-input'
                />
              </Box>
              <Button
                type='submit'
                mt={4}
                isLoading={isSubmitting}
                colorScheme='teal'
                data-cy='login-button'
              >
                login
              </Button>
              <Box>
                <NextLink href='/forgot-password'>
                  <Link>Forgot Password?</Link>
                </NextLink>
              </Box>
            </Form>
          </FormWrapper>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Login);
