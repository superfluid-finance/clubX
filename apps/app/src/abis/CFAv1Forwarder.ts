const CFAv1ForwarderABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "host", internalType: "contract ISuperfluid", type: "address" },
    ],
  },
  { type: "error", inputs: [], name: "CFA_FWD_INVALID_FLOW_RATE" },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "flowrate", internalType: "int96", type: "int96" },
      { name: "userData", internalType: "bytes", type: "bytes" },
    ],
    name: "createFlow",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "userData", internalType: "bytes", type: "bytes" },
    ],
    name: "deleteFlow",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "getAccountFlowInfo",
    outputs: [
      { name: "lastUpdated", internalType: "uint256", type: "uint256" },
      { name: "flowrate", internalType: "int96", type: "int96" },
      { name: "deposit", internalType: "uint256", type: "uint256" },
      { name: "owedDeposit", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "getAccountFlowrate",
    outputs: [{ name: "flowrate", internalType: "int96", type: "int96" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "flowrate", internalType: "int96", type: "int96" },
    ],
    name: "getBufferAmountByFlowrate",
    outputs: [
      { name: "bufferAmount", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "getFlowInfo",
    outputs: [
      { name: "lastUpdated", internalType: "uint256", type: "uint256" },
      { name: "flowrate", internalType: "int96", type: "int96" },
      { name: "deposit", internalType: "uint256", type: "uint256" },
      { name: "owedDeposit", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "flowOperator", internalType: "address", type: "address" },
    ],
    name: "getFlowOperatorPermissions",
    outputs: [
      { name: "permissions", internalType: "uint8", type: "uint8" },
      { name: "flowrateAllowance", internalType: "int96", type: "int96" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "getFlowrate",
    outputs: [{ name: "flowrate", internalType: "int96", type: "int96" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "flowOperator", internalType: "address", type: "address" },
    ],
    name: "grantPermissions",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "flowOperator", internalType: "address", type: "address" },
    ],
    name: "revokePermissions",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "flowrate", internalType: "int96", type: "int96" },
    ],
    name: "setFlowrate",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "flowrate", internalType: "int96", type: "int96" },
    ],
    name: "setFlowrateFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "sender", internalType: "address", type: "address" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "flowrate", internalType: "int96", type: "int96" },
      { name: "userData", internalType: "bytes", type: "bytes" },
    ],
    name: "updateFlow",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "contract ISuperToken", type: "address" },
      { name: "flowOperator", internalType: "address", type: "address" },
      { name: "permissions", internalType: "uint8", type: "uint8" },
      { name: "flowrateAllowance", internalType: "int96", type: "int96" },
    ],
    name: "updateFlowOperatorPermissions",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
] as const;

export default CFAv1ForwarderABI;
