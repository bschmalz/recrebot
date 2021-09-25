import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Campground = {
  __typename?: 'Campground';
  id: Scalars['Float'];
  legacy_id: Scalars['String'];
  parent_name: Scalars['String'];
  parent_id?: Maybe<Scalars['String']>;
  subparent_name?: Maybe<Scalars['String']>;
  subparent_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  type: Scalars['String'];
  sub_type: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CampgroundResponse = {
  __typename?: 'CampgroundResponse';
  campground: Campground;
};

export type CampgroundsResponse = {
  __typename?: 'CampgroundsResponse';
  campgrounds: Array<Campground>;
};


export type EditTripRequestInput = {
  custom_name: Scalars['String'];
  type: Scalars['String'];
  dates: Array<Scalars['DateTime']>;
  locations: Array<Scalars['Int']>;
  min_nights?: Maybe<Scalars['Float']>;
  id: Scalars['Float'];
};

export type EmailInput = {
  email: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  invite: RegisterResponse;
  register: UserResponse;
  verifyEmail: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createTripRequest: TripRequest;
  deleteTripRequest: Scalars['Boolean'];
  editTripRequest: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationInviteArgs = {
  options: EmailInput;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateTripRequestArgs = {
  input: TripRequestInput;
};


export type MutationDeleteTripRequestArgs = {
  id: Scalars['Float'];
};


export type MutationEditTripRequestArgs = {
  input: EditTripRequestInput;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  verifyInviteToken: VerifyEmailResponse;
  searchCampgrounds: CampgroundsResponse;
  getCampground: CampgroundResponse;
  searchTrailheads: TrailheadsResponse;
  getTrailhead: TrailheadResponse;
  tripRequest: Scalars['String'];
  getTripRequests: TripRequestsResponse;
};


export type QueryVerifyInviteTokenArgs = {
  token: Scalars['String'];
};


export type QuerySearchCampgroundsArgs = {
  input: SearchInput;
};


export type QueryGetCampgroundArgs = {
  id: Scalars['Float'];
};


export type QuerySearchTrailheadsArgs = {
  input: SearchInput;
};


export type QueryGetTrailheadArgs = {
  id: Scalars['Float'];
};

export type RegisterInput = {
  phone?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  token: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  errors?: Maybe<Array<FieldError>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type Reservable = {
  __typename?: 'Reservable';
  id: Scalars['Float'];
  legacy_id: Scalars['String'];
  parent_name: Scalars['String'];
  parent_id?: Maybe<Scalars['String']>;
  subparent_name?: Maybe<Scalars['String']>;
  subparent_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  type: Scalars['String'];
  sub_type: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type SearchInput = {
  searchTerm: Scalars['String'];
  mapCenter?: Maybe<Scalars['String']>;
  mapBounds?: Maybe<Scalars['String']>;
  filterOnBounds?: Maybe<Scalars['Boolean']>;
};

export type Trailhead = {
  __typename?: 'Trailhead';
  id: Scalars['Float'];
  legacy_id: Scalars['String'];
  parent_name: Scalars['String'];
  parent_id?: Maybe<Scalars['String']>;
  subparent_name?: Maybe<Scalars['String']>;
  subparent_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  type: Scalars['String'];
  sub_type: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type TrailheadResponse = {
  __typename?: 'TrailheadResponse';
  trailhead: Trailhead;
};

export type TrailheadsResponse = {
  __typename?: 'TrailheadsResponse';
  trailheads: Array<Trailhead>;
};

export type TripRequest = {
  __typename?: 'TripRequest';
  id: Scalars['Float'];
  userId: Scalars['Float'];
  active: Scalars['Boolean'];
  custom_name: Scalars['String'];
  type: Scalars['String'];
  dates: Array<Scalars['DateTime']>;
  locations: Array<Reservable>;
  min_nights?: Maybe<Scalars['Float']>;
  last_success?: Maybe<Scalars['DateTime']>;
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type TripRequestInput = {
  custom_name: Scalars['String'];
  type: Scalars['String'];
  dates: Array<Scalars['DateTime']>;
  locations: Array<Scalars['Int']>;
  min_nights?: Maybe<Scalars['Float']>;
};

export type TripRequestsResponse = {
  __typename?: 'TripRequestsResponse';
  tripRequests?: Maybe<Array<TripRequest>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  email: Scalars['String'];
  phone: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type VerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  isValid: Scalars['Boolean'];
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, email: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, email: string }> };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, email: string }> } };

export type CreateTripRequestMutationVariables = Exact<{
  input: TripRequestInput;
}>;


export type CreateTripRequestMutation = { __typename?: 'Mutation', createTripRequest: { __typename?: 'TripRequest', id: number } };

export type DeleteTripRequestMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteTripRequestMutation = { __typename?: 'Mutation', deleteTripRequest: boolean };

export type EditTripRequestMutationVariables = Exact<{
  input: EditTripRequestInput;
}>;


export type EditTripRequestMutation = { __typename?: 'Mutation', editTripRequest: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type InviteMutationVariables = Exact<{
  options: EmailInput;
}>;


export type InviteMutation = { __typename?: 'Mutation', invite: { __typename?: 'RegisterResponse', success?: Maybe<boolean>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, email: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, email: string }> } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, email: string }> } };

export type GetTripRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTripRequestsQuery = { __typename?: 'Query', getTripRequests: { __typename?: 'TripRequestsResponse', tripRequests?: Maybe<Array<{ __typename?: 'TripRequest', id: number, custom_name: string, dates: Array<any>, active: boolean, min_nights?: Maybe<number>, type: string, locations: Array<{ __typename?: 'Reservable', name: string, id: number, legacy_id: string, latitude: number, longitude: number, parent_name: string, subparent_id?: Maybe<string>, sub_type: string }> }>> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: number, email: string }> };

export type SearchCampgroundsQueryVariables = Exact<{
  searchTerm: Scalars['String'];
  mapBounds?: Maybe<Scalars['String']>;
  mapCenter?: Maybe<Scalars['String']>;
  filterOnBounds?: Maybe<Scalars['Boolean']>;
}>;


export type SearchCampgroundsQuery = { __typename?: 'Query', searchCampgrounds: { __typename?: 'CampgroundsResponse', campgrounds: Array<{ __typename?: 'Campground', id: number, name: string, sub_type: string, latitude: number, longitude: number, legacy_id: string, description?: Maybe<string>, parent_name: string }> } };

export type SearchTrailheadsQueryVariables = Exact<{
  searchTerm: Scalars['String'];
  mapBounds?: Maybe<Scalars['String']>;
  mapCenter?: Maybe<Scalars['String']>;
  filterOnBounds?: Maybe<Scalars['Boolean']>;
}>;


export type SearchTrailheadsQuery = { __typename?: 'Query', searchTrailheads: { __typename?: 'TrailheadsResponse', trailheads: Array<{ __typename?: 'Trailhead', id: number, name: string, latitude: number, longitude: number, parent_name: string, legacy_id: string, description?: Maybe<string>, subparent_name?: Maybe<string>, subparent_id?: Maybe<string> }> } };

export type VerifyInviteTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyInviteTokenQuery = { __typename?: 'Query', verifyInviteToken: { __typename?: 'VerifyEmailResponse', isValid: boolean } };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateTripRequestDocument = gql`
    mutation CreateTripRequest($input: TripRequestInput!) {
  createTripRequest(input: $input) {
    id
  }
}
    `;
export type CreateTripRequestMutationFn = Apollo.MutationFunction<CreateTripRequestMutation, CreateTripRequestMutationVariables>;

/**
 * __useCreateTripRequestMutation__
 *
 * To run a mutation, you first call `useCreateTripRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTripRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTripRequestMutation, { data, loading, error }] = useCreateTripRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTripRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateTripRequestMutation, CreateTripRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTripRequestMutation, CreateTripRequestMutationVariables>(CreateTripRequestDocument, options);
      }
export type CreateTripRequestMutationHookResult = ReturnType<typeof useCreateTripRequestMutation>;
export type CreateTripRequestMutationResult = Apollo.MutationResult<CreateTripRequestMutation>;
export type CreateTripRequestMutationOptions = Apollo.BaseMutationOptions<CreateTripRequestMutation, CreateTripRequestMutationVariables>;
export const DeleteTripRequestDocument = gql`
    mutation DeleteTripRequest($id: Float!) {
  deleteTripRequest(id: $id)
}
    `;
export type DeleteTripRequestMutationFn = Apollo.MutationFunction<DeleteTripRequestMutation, DeleteTripRequestMutationVariables>;

/**
 * __useDeleteTripRequestMutation__
 *
 * To run a mutation, you first call `useDeleteTripRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTripRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTripRequestMutation, { data, loading, error }] = useDeleteTripRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTripRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTripRequestMutation, DeleteTripRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTripRequestMutation, DeleteTripRequestMutationVariables>(DeleteTripRequestDocument, options);
      }
export type DeleteTripRequestMutationHookResult = ReturnType<typeof useDeleteTripRequestMutation>;
export type DeleteTripRequestMutationResult = Apollo.MutationResult<DeleteTripRequestMutation>;
export type DeleteTripRequestMutationOptions = Apollo.BaseMutationOptions<DeleteTripRequestMutation, DeleteTripRequestMutationVariables>;
export const EditTripRequestDocument = gql`
    mutation EditTripRequest($input: EditTripRequestInput!) {
  editTripRequest(input: $input)
}
    `;
export type EditTripRequestMutationFn = Apollo.MutationFunction<EditTripRequestMutation, EditTripRequestMutationVariables>;

/**
 * __useEditTripRequestMutation__
 *
 * To run a mutation, you first call `useEditTripRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTripRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTripRequestMutation, { data, loading, error }] = useEditTripRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditTripRequestMutation(baseOptions?: Apollo.MutationHookOptions<EditTripRequestMutation, EditTripRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditTripRequestMutation, EditTripRequestMutationVariables>(EditTripRequestDocument, options);
      }
export type EditTripRequestMutationHookResult = ReturnType<typeof useEditTripRequestMutation>;
export type EditTripRequestMutationResult = Apollo.MutationResult<EditTripRequestMutation>;
export type EditTripRequestMutationOptions = Apollo.BaseMutationOptions<EditTripRequestMutation, EditTripRequestMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const InviteDocument = gql`
    mutation Invite($options: EmailInput!) {
  invite(options: $options) {
    errors {
      ...RegularError
    }
    success
  }
}
    ${RegularErrorFragmentDoc}`;
export type InviteMutationFn = Apollo.MutationFunction<InviteMutation, InviteMutationVariables>;

/**
 * __useInviteMutation__
 *
 * To run a mutation, you first call `useInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMutation, { data, loading, error }] = useInviteMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useInviteMutation(baseOptions?: Apollo.MutationHookOptions<InviteMutation, InviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteMutation, InviteMutationVariables>(InviteDocument, options);
      }
export type InviteMutationHookResult = ReturnType<typeof useInviteMutation>;
export type InviteMutationResult = Apollo.MutationResult<InviteMutation>;
export type InviteMutationOptions = Apollo.BaseMutationOptions<InviteMutation, InviteMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const GetTripRequestsDocument = gql`
    query GetTripRequests {
  getTripRequests {
    tripRequests {
      id
      custom_name
      dates
      locations {
        name
        id
        legacy_id
        latitude
        longitude
        parent_name
        subparent_id
        sub_type
      }
      active
      min_nights
      type
    }
  }
}
    `;

/**
 * __useGetTripRequestsQuery__
 *
 * To run a query within a React component, call `useGetTripRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTripRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetTripRequestsQuery, GetTripRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripRequestsQuery, GetTripRequestsQueryVariables>(GetTripRequestsDocument, options);
      }
export function useGetTripRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripRequestsQuery, GetTripRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripRequestsQuery, GetTripRequestsQueryVariables>(GetTripRequestsDocument, options);
        }
export type GetTripRequestsQueryHookResult = ReturnType<typeof useGetTripRequestsQuery>;
export type GetTripRequestsLazyQueryHookResult = ReturnType<typeof useGetTripRequestsLazyQuery>;
export type GetTripRequestsQueryResult = Apollo.QueryResult<GetTripRequestsQuery, GetTripRequestsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SearchCampgroundsDocument = gql`
    query SearchCampgrounds($searchTerm: String!, $mapBounds: String, $mapCenter: String, $filterOnBounds: Boolean) {
  searchCampgrounds(
    input: {searchTerm: $searchTerm, mapBounds: $mapBounds, mapCenter: $mapCenter, filterOnBounds: $filterOnBounds}
  ) {
    campgrounds {
      id
      name
      sub_type
      latitude
      longitude
      legacy_id
      description
      parent_name
    }
  }
}
    `;

/**
 * __useSearchCampgroundsQuery__
 *
 * To run a query within a React component, call `useSearchCampgroundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCampgroundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCampgroundsQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      mapBounds: // value for 'mapBounds'
 *      mapCenter: // value for 'mapCenter'
 *      filterOnBounds: // value for 'filterOnBounds'
 *   },
 * });
 */
export function useSearchCampgroundsQuery(baseOptions: Apollo.QueryHookOptions<SearchCampgroundsQuery, SearchCampgroundsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCampgroundsQuery, SearchCampgroundsQueryVariables>(SearchCampgroundsDocument, options);
      }
export function useSearchCampgroundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCampgroundsQuery, SearchCampgroundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCampgroundsQuery, SearchCampgroundsQueryVariables>(SearchCampgroundsDocument, options);
        }
export type SearchCampgroundsQueryHookResult = ReturnType<typeof useSearchCampgroundsQuery>;
export type SearchCampgroundsLazyQueryHookResult = ReturnType<typeof useSearchCampgroundsLazyQuery>;
export type SearchCampgroundsQueryResult = Apollo.QueryResult<SearchCampgroundsQuery, SearchCampgroundsQueryVariables>;
export const SearchTrailheadsDocument = gql`
    query SearchTrailheads($searchTerm: String!, $mapBounds: String, $mapCenter: String, $filterOnBounds: Boolean) {
  searchTrailheads(
    input: {searchTerm: $searchTerm, mapBounds: $mapBounds, mapCenter: $mapCenter, filterOnBounds: $filterOnBounds}
  ) {
    trailheads {
      id
      name
      latitude
      longitude
      parent_name
      legacy_id
      parent_name
      description
      subparent_name
      subparent_id
    }
  }
}
    `;

/**
 * __useSearchTrailheadsQuery__
 *
 * To run a query within a React component, call `useSearchTrailheadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTrailheadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTrailheadsQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      mapBounds: // value for 'mapBounds'
 *      mapCenter: // value for 'mapCenter'
 *      filterOnBounds: // value for 'filterOnBounds'
 *   },
 * });
 */
export function useSearchTrailheadsQuery(baseOptions: Apollo.QueryHookOptions<SearchTrailheadsQuery, SearchTrailheadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTrailheadsQuery, SearchTrailheadsQueryVariables>(SearchTrailheadsDocument, options);
      }
export function useSearchTrailheadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTrailheadsQuery, SearchTrailheadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTrailheadsQuery, SearchTrailheadsQueryVariables>(SearchTrailheadsDocument, options);
        }
export type SearchTrailheadsQueryHookResult = ReturnType<typeof useSearchTrailheadsQuery>;
export type SearchTrailheadsLazyQueryHookResult = ReturnType<typeof useSearchTrailheadsLazyQuery>;
export type SearchTrailheadsQueryResult = Apollo.QueryResult<SearchTrailheadsQuery, SearchTrailheadsQueryVariables>;
export const VerifyInviteTokenDocument = gql`
    query VerifyInviteToken($token: String!) {
  verifyInviteToken(token: $token) {
    isValid
  }
}
    `;

/**
 * __useVerifyInviteTokenQuery__
 *
 * To run a query within a React component, call `useVerifyInviteTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyInviteTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyInviteTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyInviteTokenQuery(baseOptions: Apollo.QueryHookOptions<VerifyInviteTokenQuery, VerifyInviteTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VerifyInviteTokenQuery, VerifyInviteTokenQueryVariables>(VerifyInviteTokenDocument, options);
      }
export function useVerifyInviteTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VerifyInviteTokenQuery, VerifyInviteTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VerifyInviteTokenQuery, VerifyInviteTokenQueryVariables>(VerifyInviteTokenDocument, options);
        }
export type VerifyInviteTokenQueryHookResult = ReturnType<typeof useVerifyInviteTokenQuery>;
export type VerifyInviteTokenLazyQueryHookResult = ReturnType<typeof useVerifyInviteTokenLazyQuery>;
export type VerifyInviteTokenQueryResult = Apollo.QueryResult<VerifyInviteTokenQuery, VerifyInviteTokenQueryVariables>;