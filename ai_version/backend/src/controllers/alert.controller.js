const alertService = require("../services/alert.service");


exports.getAlerts = async (req,res,next)=>{

  try{

    const alerts = await alertService.getAllAlerts();

    res.json(alerts);

  }catch(err){

    next(err);

  }

};



exports.getActiveAlerts = async (req,res,next)=>{

  try{

    const alerts = await alertService.getActiveAlerts();

    res.json(alerts);

  }catch(err){

    next(err);

  }

};



exports.closeAlert = async (req,res,next)=>{

  try{

    const id = req.params.id;

    await alertService.closeAlert(id);

    res.json({message:"Alerte fermée"});

  }catch(err){

    next(err);

  }

};