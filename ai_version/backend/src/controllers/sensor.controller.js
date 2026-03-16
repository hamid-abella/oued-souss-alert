const sensorService = require("../services/sensor.service");


exports.getAllSensors = async (req,res,next)=>{

  try{

    const sensors = await sensorService.getAllSensors();

    res.json(sensors);

  }catch(err){

    next(err);

  }

};


exports.getSensorsByZone = async (req,res,next)=>{

  try{

    const zoneId = req.params.zoneId;

    const sensors = await sensorService.getSensorsByZone(zoneId);

    res.json(sensors);

  }catch(err){

    next(err);

  }

};


exports.createSensor = async (req,res,next)=>{

  try{

    const sensor = await sensorService.createSensor(req.body);

    res.status(201).json(sensor);

  }catch(err){

    next(err);

  }

};


exports.deleteSensor = async (req,res,next)=>{

  try{

    const id = req.params.id;

    await sensorService.deleteSensor(id);

    res.json({message:"Capteur supprimé"});

  }catch(err){

    next(err);

  }

};