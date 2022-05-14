const MultiSigWallet = artifacts.require("MultiSigWallet");
const SafeMath = artifacts.require("SafeMath");
module.exports = function (deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MultiSigWallet);
  deployer.deploy(MultiSigWallet);
};
