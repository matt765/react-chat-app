import * as Yup from 'yup';

export const defaultValues = {
    password: '',
    userName: '',
    verifyPassword: '',
};

export const validationSchema = Yup.object().shape({

    password: Yup.string().required('Required').min(8, 'Must be at least 8 characters'),
    verifyPassword: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Password must match'),
    userName: Yup.string()
        .required('Required')
        .matches("^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$", 'Please use letters or numbers')
        .min(3, 'Must be at leat 3 characters')
        .max(20, 'You have reached limit of characters')

})