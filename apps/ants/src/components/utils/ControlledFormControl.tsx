import { FormControl, FormControlProps, FormHelperText, InputLabel } from '@mui/material';
import { Control, FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { Children, createElement } from 'react';

// Types
export type ControlledFormControlProps<TFV extends FieldValues, TN extends FieldPath<TFV>> = Omit<FormControlProps, 'required' | 'error'> & {
  name: TN;
  control: Control<TFV>;
  rules?: UseControllerProps<TFV, TN>['rules'];
  defaultValue?: UseControllerProps<TFV, TN>['defaultValue'];
  label: string;
}

// Component
export const ControlledFormControl = <TFV extends FieldValues, TN extends FieldPath<TFV>>(props: ControlledFormControlProps<TFV, TN>) => {
  const { name, control, rules, defaultValue, label, children, ...rest } = props;

  // Context
  const { field, fieldState } = useController<TFV, TN>({ name, control, rules, defaultValue });

  // Render
  return (
    <FormControl {...rest} required={!!rules?.required} error={!!fieldState.error}>
      <InputLabel>{ label }</InputLabel>
      { Children.map(children, child => (child && typeof child === 'object' && 'props' in child) ? (
        createElement(child.type, { ...child.props, ...field, value: field.value ?? '' })
      ) : child) }
      { fieldState.error && (
        <FormHelperText>{ fieldState.error.message }</FormHelperText>
      ) }
    </FormControl>
  );
};
