const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../config/db");


/*
Connexion utilisateur
*/

exports.login = async (req,res,next)=>{

  try{

    const {email,password} = req.body;

    const user = await db.query(
      "SELECT * FROM utilisateurs WHERE email=$1",
      [email]
    );

    if(user.rows.length === 0){

      return res.status(404).json({message:"Utilisateur non trouvé"});

    }

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if(!valid){

      return res.status(401).json({message:"Mot de passe incorrect"});

    }

    const token = jwt.sign(
      {id:user.rows[0].id,role:user.rows[0].role},
      process.env.JWT_SECRET
    );

    res.json({token});

  }catch(err){

    next(err);

  }

};



/*
Création utilisateur
*/

exports.register = async (req,res,next)=>{

  try{

    const {email,password,role} = req.body;

    const hash = await bcrypt.hash(password,10);

    const result = await db.query(
      `
      INSERT INTO utilisateurs(email,password,role)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [email,hash,role]
    );

    res.status(201).json(result.rows[0]);

  }catch(err){

    next(err);

  }

};