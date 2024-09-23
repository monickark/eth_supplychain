const Migrations = artifacts.require("Migrations");
var UserContract = artifacts.require('UserContract');
var FarmerContract = artifacts.require('FarmerContract');
var SupplierContract = artifacts.require('SupplierContract');

module.exports = async function(deployer) {
  deployer.deploy(Migrations);
  await deployer.deploy(UserContract);
  await deployer.deploy(FarmerContract);
  await deployer.deploy(SupplierContract);
};
