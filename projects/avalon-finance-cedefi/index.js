const ADDRESSES = require('../helper/coreAssets.json')

const abi = {
  "getPoolManagerReserveInformation": "function getPoolManagerReserveInformation() view returns (tuple(uint256 userAmount, uint256 collateral, uint256 debt, uint256 claimableUSDT, uint256 claimableBTC) poolManagerReserveInfor)"
}

const config = {
  ethereum: { poolAddress: "0x02feDCff97942fe28e8936Cdc3D7A480fdD248f0", lfbtcAddress: "0x3119a1AD5B63A000aB9CA3F2470611eB997B93B9", usdtAddress: ADDRESSES.ethereum.USDT, },
}

// @dev getMetrics: call to get the collateral and debt of the Avalon CeDefi pool contract.
const getMetrics = async (api, borrowed) => {
  const { poolAddress, lfbtcAddress, usdtAddress } = config[api.chain]
  const marketData = await api.call({ abi: abi.getPoolManagerReserveInformation, target: poolAddress, });
  const balanceOfCollateral = marketData.collateral;
  const balanceOfDebt = marketData.debt;

  if (borrowed)
    api.add(usdtAddress, balanceOfDebt);
  else
    api.add(lfbtcAddress, balanceOfCollateral);
}

module.exports = {
  methodology: `lfbtc collateral and USDT debt of Avalon CeDefi pool contract`,
  doublecounted: false,
  ethereum: {
    tvl: (api) => getMetrics(api),
    borrowed: (api) => getMetrics(api, true),
  }
}