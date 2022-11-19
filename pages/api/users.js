// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../models/User';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const {method} = req
  await dbConnect()

  switch(method){
    case 'GET':
      try{
        const users = await User.find({})
        res.status(200).json({success: true, data: users})
      } catch(err){
        res.status(400).json({success: false, message: err})
      }
      break
    case 'POST':
      try{
        let validName = false
        let validEmail = false
        let validPassword = false
        
        const passwordFormat = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,25}$/
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const nameFormat = /^[a-zA-Z]+$/;

        // Check name
        if(req.body.name.match(nameFormat)){
            validName = true
        }else{
            res.status(400).json({success: false, message: "Le nom n'est pas valide"})
            return
        }
        // Check email
        if(req.body.email.match(mailformat)){
            validEmail = true
        }else{
            res.status(400).json({success: false, message: "L'email n'est pas valide"})
            return
        }
        // Check password
        if(req.body.password.match(passwordFormat)){
            validPassword = true
        }else{
            res.status(400).json({success: false, message: "Le mot de passe doit contenir au moins une majuscule et une minuscule, un charactere spécial (!@#$&*), un chiffre, et doit avoir une longueur de 8 characteres minimum"})
            return
        }
        if(validEmail && validPassword && validName){
          // Hash passwords
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(req.body.password, salt)
          // Verify if email already exist in db
          const emailExist = await User.findOne({email: req.body.email})
          if(emailExist){
            res.status(400).json({success: false, message: 'Cet email est déjà utilisé'})
            return
          }
          const user = new User({name: req.body.name, email: req.body.email, password: hashedPassword})
          user.save().then(() => {
            res.status(201).json({success: true, data: user})
          })
        }
      }catch(err){
        console.log(err)
        res.status(400).json({success: false, message: err})
      }
      break
  }
}
