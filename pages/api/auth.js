import User from '../../models/User';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

export default async function handler(req, res) {
    const {method} = req
    await dbConnect()
  
    switch(method){
      case 'POST':
        try{
            // Data validation
            const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if(!req.body.email.match(mailformat)) return res.status(400).send({success: false, message: "Le format du mail doit être valide"})

            // Check if email exists
            const user = await User.findOne({email: req.body.email}) 
            if(!user) return res.status(400).send({success: false, message:'Votre email ou votre mot de passe est incorrecte'})

            // Check password
            const validPass = await bcrypt.compare(req.body.password,user.password)
            if(!validPass) return res.status(400).send({success: false, message:'Votre email ou votre mot de passe est incorrecte'})

            // Create and assign a token
            const token = await new jose.SignJWT({_id: user._id})
                                .setProtectedHeader({alg: 'HS256'})
                                .setIssuedAt()
                                .setExpirationTime('30d')
                                .sign(new TextEncoder().encode(process.env.TOKEN_SECRET));
            // const token = Jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            // res.header('auth-token', token).send({token: token})
            const users = await User.find({email: req.body.email})
            res.status(200).json({success: true, data: users, jwt_token: token})
        } catch(err){
            console.log(err)
            res.status(400).json({success: false, message: err})
        }
        break
    }
}