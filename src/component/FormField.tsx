import React, {ChangeEvent, forwardRef} from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    getter: string;
    setter: CallableFunction;
    error?: string;
    onEnter?: CallableFunction;
    type?: string;
    onChange?: CallableFunction;
}

const FormField: React.FC<FormFieldProps> = forwardRef(({ getter, setter, error = "", onEnter = undefined, type = "text", onChange = undefined, ...props }, ref) => {
    const kd = (evt: KeyboardEvent) => {
        if (onEnter && evt.key === "Enter") {
            onEnter();
        }
    }

    const oc = (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
        if (onChange) {
            onChange();
        }
    }

    if (error) {
        props.className += " is-invalid";
    }

    return <>
        <input ref={ref} {...props} type={type} value={getter} onChange={oc} onKeyDown={kd}/>
        {error && <div className="invalid-feedback">{error}</div>}
    </>
});

export default FormField;
