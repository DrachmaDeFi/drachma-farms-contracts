## Differences between Drachma and Compound money market

Drachma Farms is a fork of compound protocol from commit [44b984b4871b015899f86fdcefde2d761ad83713](https://github.com/compound-finance/compound-protocol/tree/44b984b4871b015899f86fdcefde2d761ad83713).

The changes from the original protocol are as follows:

- Drachma makes use of self sustained Time Weighted Average Prices for protocol listed assets. The money market automatically updates the TWAP prices on every transaction.
- The CTokens are now called kTokens.
- The blocks per year value is adjusted according to Metis Andromeda chain.


### Contract Changes

- Comptroller
    - Diff file - [Comptroller.sol](Comptroller.sol.pdf/)
    - `collateralFactorMaxMantissa` changed to 1 from 0.9
    - added `oracle.updatePrice(CToken(cToken));` statement to automatically sync the underlying asset's price before all mint, redeem, borrow and repayBorrow transactions.
    - Paused Drachma token claiming for the initial phase of protocol launch.
    - Added address of DRACHMA token.
- PriceOracle
    - Diff file - [PriceOracle.sol](PriceOracle.sol.pdf/)
    - Added `updatePrice()` function to the PriceOracle interface. 
- WhitePaperInterestRateModel
    - Diff file - [WhitePaperInterestRateModel.sol](WhitePaperInterestRateModel.sol.pdf/)
    - Adjusted the blocks per year value according to Metis Andromeda chain.
 