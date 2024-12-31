import React from 'react';

interface FormContextType {
    setFormValue: (name: string, value: any) => void;
}

const FormContext = React.createContext<FormContextType>({
    setFormValue: () => {},
});

export default FormContext;