import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  InputLeftAddon,
  InputGroup,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  type?: string;
};
export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea = false,
  size: _,
  type,
  ...props
}) => {
  const C = textarea ? Textarea : Input;
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputGroup>
        {type === 'tel' ? <InputLeftAddon children='+1' /> : null}
        <C
          {...field}
          {...props}
          id={field.name}
          placeholder={props.placeholder}
          type={type}
        />
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
