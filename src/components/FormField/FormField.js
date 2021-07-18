import { ErrorMessage, Field } from 'formik';

export const FormField = ({ name, label, type = 'text', placeholder }) => (
    
    <label>
   
       
  
        <Field name={name} type={type}  placeholder={placeholder} />
        
    </label>
)


