var sequelize= require('sequelize'),
    seq=new sequelize('bport','root','sakshi',{
        host: 'localhost',
        dialect: 'mysql',
        pool:{
            max: 15,
            min: 0,
            idle: 2000
        }
    })

module.exports={
    sequelize: sequelize,
    seq: seq
}