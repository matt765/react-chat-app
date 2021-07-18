import * as Yup from 'yup';

export const defaultValues = {
    userName: '',
    password: ''   
};

export const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Required').min(3, 'Must be at leat 3 characters'),
    password: Yup.string().required('Required')
   
})