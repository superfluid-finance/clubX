
import React from 'react';

interface Props {
    onClick: () => void;
    disabled: boolean;
  }
  
  const ConnectButton = ({ onClick, disabled }: Props) => {
    return (
      <div style={{ textAlign: 'center' }}>
        <button onClick={onClick} disabled={disabled}>
          {disabled ? (
            <div  style={{ width: '100%' }}>
              <img   alt="loading" />
            </div>
          ) : (
            'Connect'
          )}
        </button>
      </div>
    );
  };
  
  export default ConnectButton;