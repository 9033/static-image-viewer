const viewLog = (sequelize, Sequelize) =>{
  return sequelize.define('viewLog',{
    user:{
      type:Sequelize.STRING,
      allowNull:false,
    },
    route:{
      type:Sequelize.STRING,
      allowNull:false,
    },
    time:{
      type:Sequelize.DATE,
      allowNull:false,
      defaultValue:Sequelize.fn('now'),
    },
  },{
    timestamps:true,
    paranoid:true,
  });
};

module.exports = {
  viewLog,
}
