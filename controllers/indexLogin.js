const supabase = require('../database');

const login = async (req, res, next) => {
  return res.render('user/login')
}

// function untuk login setelah register
const userLogin = async (req, res, next) => {

  // const { data: userSignup, error: errUserSignup } = await supabase.auth.signUp(
  //   {
  //     email: req.body.email,
  //     password: req.body.confirm_password,
  //     options: {
  //       data: {
  //         first_name: req.body.firstname,
  //         last_name: req.body.lastname,
  //         dob: req.body.dob,
  //         phone: req.body.notel,
  //       }
  //     }
  //   }
  // )

  // let pass = req.body.firstName;
  // console.log(pass)
  const { user, session, error } = await supabase.auth.signUp(
    {
      email: req.body.email,
      password: req.body.confirm_password,
    },
    {
      data: {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        dob: req.body.dob,
        phone: req.body.notel,
      }
    }
  )

  console.log(user, session, error)

  console.log(req.body.email)
  console.log(req.body.confirm_password)
  console.log(req.body.firstname)
  console.log(req.body.lastname)
  console.log(req.body.dob)
  console.log(req.body.notel)
  
  // return res.render('user/login')
}

module.exports ={
  login,
  userLogin,
}
