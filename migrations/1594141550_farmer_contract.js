var FarmerContract = artifacts.require('FarmerContract');

module.exports = function(deployer) {
  deployer.deploy(FarmerContract);
}