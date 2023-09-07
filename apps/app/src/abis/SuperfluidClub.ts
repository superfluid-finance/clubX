const SuperfluidClubABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Initialized",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "FIRST_ELEMENT_PROGRESSION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FLAT_COST_SPONSORSHIP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SPONSORSHIP_LEVEL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SPONSORSHIP_PATH_OUTFLOW",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SECONDS_IN_A_DAY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "level",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "protegeCount",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "totalWeightedFactor",
        type: "uint256",
      },
    ],
    name: "calculateSponsorAmount",
    outputs: [
      {
        internalType: "int96",
        name: "flow",
        type: "int96",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "level",
        type: "uint8",
      },
    ],
    name: "getAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "allocation",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "protege",
        type: "address",
      },
    ],
    name: "getChainOfSponsors",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sponsor",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "level",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "protegeCount",
            type: "uint32",
          },
        ],
        internalType: "struct SuperfluidClub.Protege[6]",
        name: "sponsors",
        type: "tuple[6]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "protegeLvl",
        type: "uint8",
      },
    ],
    name: "getFlowRateAmount",
    outputs: [
      {
        internalType: "int96",
        name: "flowRate",
        type: "int96",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "sponsorLvl",
        type: "uint8",
      },
    ],
    name: "getMaxFlowRateByLevel",
    outputs: [
      {
        internalType: "int96",
        name: "maxFlowRate",
        type: "int96",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "protegeLvl",
        type: "uint8",
      },
    ],
    name: "getProtegeLevelWeight",
    outputs: [
      {
        internalType: "uint256",
        name: "levelWeight",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "superTokenFactory",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "initialAddress",
        type: "address",
      },
    ],
    name: "initializeProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "protege",
        type: "address",
      },
    ],
    name: "isProtege",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "restartStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newProtege",
        type: "address",
      },
    ],
    name: "sponsorship",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

export default SuperfluidClubABI;
