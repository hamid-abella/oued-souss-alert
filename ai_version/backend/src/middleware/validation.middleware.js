/*
Middleware de validation
*/

module.exports = (schema)=>{

  return (req,res,next)=>{

    const {error} = schema.validate(req.body);

    if(error){

      return res.status(400).json({
        message:"Données invalides",
        details:error.details
      });

    }

    next();

  };

};