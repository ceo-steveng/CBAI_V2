const CBAI = artifacts.require("CBAI");

// const ipfs = process.env.NEXT_PUBLIC_IPFS_MIGRATION;

module.exports = function (deployer) {
  deployer.deploy(
    CBAI,
    "ipfs://bafybeia3iir6kpiktqxtsrk4njimxvpyo3csnxburmrlzyi7kbxzu6zjyy/"
  );
};
