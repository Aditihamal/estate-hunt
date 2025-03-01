import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async  (req,res) =>{
   const { username, gmail, password} = req.body;

   try{
    const hasedPassword = await bcrypt.hash(password, 10);

    console.log(hasedPassword)
 
    const newUser = await prisma.user.create(
     {
         data : {
             username,
             gmail,
             password: hasedPassword,
         },
     });
     console.log(newUser);

     res.satuts(201).json({message: "user created successfully"});
   }catch(err){
    console.log(err)
    res.satuts(500).json({message: "failed to created successfully"});

   }


};

export const login = (req,res) =>{
   
};

export const logout = (req,res) =>{
   
};