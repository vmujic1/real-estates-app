const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Upit = sequelize.define(
    "Upit",
    {
      tekst_upita: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      tableName: "Upit",
      timestamps: false,
    }
  );

  return Upit;
};
