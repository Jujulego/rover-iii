import { TextField, TextFieldProps } from '@mui/material';
import {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  UnpackNestedValue,
  useController,
  UseControllerProps
} from 'react-hook-form';

// Types
export interface ControlledTransform<T> {
  fromInput(val: string): T;
  toInput(val: T): string;
}

export type ControlledTextFieldProps<TFV extends FieldValues, TN extends FieldPath<TFV>> = Omit<TextFieldProps, 'inputRef' | 'value' | 'required' | 'error' | 'helperText' | 'onBlur' | 'onChange'> & {
  name: TN;
  control: Control<TFV>;
  rules?: UseControllerProps<TFV, TN>['rules'];
  defaultValue?: UseControllerProps<TFV, TN>['defaultValue'];
  transform?: ControlledTransform<UnpackNestedValue<FieldPathValue<TFV, TN>>>;
}

// Component
export const ControlledTextField = <TFV extends FieldValues, TN extends FieldPath<TFV>>(props: ControlledTextFieldProps<TFV, TN>) => {
  const { name, control, rules, defaultValue, transform, inputProps = {}, ...rest } = props;

  // Context
  const { field, fieldState } = useController<TFV, TN>({ name, control, rules, defaultValue });

  // Render
  if (rules?.max !== undefined) {
    inputProps.max = typeof rules.max === 'object' ? rules.max.value : rules.max;
  }

  if (rules?.min !== undefined) {
    inputProps.min = typeof rules.min === 'object' ? rules.min.value : rules.min;
  }

  const toInput = transform?.toInput ?? ((v: UnpackNestedValue<FieldPathValue<TFV, TN>>) => v);
  const fromInput = transform?.fromInput ?? ((v: string) => v);

  return (
    <TextField
      {...rest} inputProps={inputProps}
      inputRef={field.ref} value={toInput(field.value) ?? ''} required={!!rules?.required}
      error={!!fieldState.error} helperText={fieldState.error?.message}
      onBlur={field.onBlur} onChange={(evt) => field.onChange(fromInput(evt.target.value))}
    />
  );
};
