//import { userModel } from ;

export const getSession = (req, res, next) => {

    if(req.session.login) {
        res.redirect('/home', {

        })
    } else {
        res.redirect('/', {

        })
    };
};

export const testLogin = (req, res, next) => {
    if (req.body.email == "f@f.com" && req.body.password == "1234") {
        req.session.login = true;
        res.redirect(302, '/home');
    } else {
        res.redirect(302, '/', {

        })
    };
};

export const destroySession = (req, res, next) => {
    if(req.session.login) {
        res.session.destroy(() => {
            res.redirect('/');
        })
    };
    
};

export const home = (req, res, next) => {
    res.render('home', {

    })
    
};

export const register = async (req, res, next) => {
    const {first_name, last_name, email, age, password} = req.body;

    //Password deberia ser encriptada
    /* 
    const user = await userModel.find() //Buscar por email
    if(user) {
        res.redirect('/', {
            Indicar que el email esta registrado
        })
    } else {
        await userModel.addElement([user])
        res.redirect('/', {
            Indicar que el usuario se creo correctamente
        })
    }
    */
}