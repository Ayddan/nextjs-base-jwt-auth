import User from '../../../../models/User';
import dbConnect from "../../../../lib/dbConnect"
import verifyToken from '../../../../lib/verifyToken';

export default async function handler(req, res) {
  const {method} = req
  if(method != 'GET')return res.status(405).json({success: false, message: 'Method not allowed'})
  const token = req.cookies.jwt_token
  if(!token)return res.status(400).json({success: false, message: 'Invalid or missing token', user: ''})
  const decoded = await verifyToken(token)
  if(!decoded) return res.status(400).json({success: false, message: 'Invalid or missing token', user: ''})
  await dbConnect()
  const user = await User.findById(decoded.payload._id)
  console.log(decoded)
  if(!user)return res.status(400).json({success: false, message: 'User doesnt exist'})
  return res.status(200).json({success: true, user: user})
}