var SupplierContract = artifacts.require('SupplierContract');

module.exports = function(deployer) {
  deployer.deploy(SupplierContract);
}
