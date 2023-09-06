# Superfluid Club Smart Contract

_This README will help users and developers understand the functionalities, data structures, and logic flow of the contract._

The Superfluid Club contract is designed to facilitate the operations of a club using the Superfluid finance protocol.

## Features:

- The club's operations revolve around "sponsorships" and "proteges".
- A person can become a "protege" under another person's sponsorship, creating a sponsorship relationship.
- Sponsorship can go up to a defined `MAX_SPONSORSHIP_LEVEL` (6 by default).
- There are stream flows based on the level of sponsorship + count of proteges under a single sponsor.

## Formulas & Calculations:

- **Allocation Calculation**: `allocation = FIRST_ELEMENT_PROGRESSION / (2 ** level);`
  - This calculates the allocation for a given sponsorship level.

- **Flow Rate Calculation**: `baseRate = (MAX_SPONSORSHIP_PATH_OUTFLOW * getProtegeLevelWeight(protegeLvl)) / 100;`
  - Based on the protege's level and the defined maximum outflow for the path, this determines the flow rate.

## Data Structures:

1. **Protege Struct**: Represents a member of the club.
- `sponsor`: The address of the protege's sponsor.
- `level`: The level of the protege in the sponsorship chain.
- `protegeCount`: The number of proteges under this protege.

2. **State Variables**:
- `_proteges`: A mapping that links an address to its corresponding Protege structure.
- `init`: Ensures the contract's initialization occurs only once.

## Core Logic:

- **Initialization**: Initializes the contract, sets the token symbol and name, and mints a fixed amount of tokens to the contract address.

- **Sponsorship**: The function checks the eligibility of the sponsor and the new protege. Calculates the new flow rates for every sponsor up the chain and updates or creates a stream for each sponsor in the chain.

- **Flow Rate Calculation**: The rate is determined based on the level of the protege and the number of proteges under a given sponsor.

- **Withdrawal and Mint**: The contract owner has the privilege to withdraw fees and mint new club tokens to the contract.

## Utility Functions:

- `isProtege()`: Checks if an address is a protege in the club.

- `getChainOfSponsors()`: Returns the chain of sponsors for a given protege address.

- `toInt96()` & `toUint256()`: Utility functions for type conversion.

