import { keyframes } from "styled-components";

export const Pulse = keyframes`
    10% {
      opacity: 1;
      transform: scale(1);
    }
    31% {
      opacity: 1;
      transform: scale(1.2);
    }
    32% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    34% {
      opacity: 1;
      transform: scale(1);
    }
    35% {
      opacity: 0.5;
      transform: scale(0.7);
    }
    45% {
      opacity: 0.5;
      transform: scale(0.7);
    }
    60% {
      opacity: 1;
      transform: scale(1);
    }
`;

export const PulseCenteredKeyframes = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
`;

export const PulseLeftKeyframes = keyframes`
  0% {
    transform: translateY(-50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 0.6;
  }
`;

export const Electricity = keyframes`
    10% {
      opacity: 0.5;
    }
    31% {
      opacity: 1;
    }
    32% {
      opacity: 0.1;
    }
    34% {
      opacity: 0.5;
    }
    35% {
      opacity: 0.05;
    }
    45% {
      opacity: 0.05;
    }
    60% {
      opacity: 0.5;
    }
`;
