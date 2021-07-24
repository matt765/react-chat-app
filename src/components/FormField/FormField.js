import { Field } from 'formik';

export const FormField = ({ name, type = 'text', placeholder }) => (
    
    <label>
   
       
  
        <Field name={name} type={type}  placeholder={placeholder} maxLength={20} />
        
    </label>
)


