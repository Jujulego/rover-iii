import { TextField, TextFieldProps } from '@mui/material';
import { Control, FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

// Types
export type ControlledTextFieldProps<TFV extends FieldValues, TN extends FieldPath<TFV>> = Omit<TextFieldProps, 'inputRef' | 'value' | 'required' | 'error' | 'helperText' | 'onBlur' | 'onChange'> & {
  name: TN;
  control: Control<TFV>;
  rules?: UseControllerProps<TFV, TN>['rules'];
  defaultValue?: UseControllerProps<TFV, TN>['defaultValue'];
}

// Component
export const ControlledTextField = <TFV extends FieldValues, TN extends FieldPath<TFV>>(props: ControlledTextFieldProps<TFV, TN>) => {
  const { name, control, rules, defaultValue, inputProps = {}, ...rest } = props;

  // Context
  const { field, fieldState } = useController<TFV, TN>({ name, control, rules, defaultValue });

  // Render
  if (rules?.max !== undefined) {
    inputProps.max = typeof rules.max === 'object' ? rules.max.value : rules.max;
  }

  if (rules?.min !== undefined) {
    inputProps.min = typeof rules.min === 'object' ? rules.min.value : rules.min;
  }

  return (
    <TextField
      {...rest}
      inputRef={field.ref} value={field.value} required={!!rules?.required}
      error={!!fieldState.error} helperText={fieldState.error?.message}
      onBlur={field.onBlur} onChange={field.onChange}
    />
  );
};
