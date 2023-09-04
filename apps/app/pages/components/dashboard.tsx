import { useAccount, useDisconnect } from "wagmi";
import SignIn from "./SignIn";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="App">
      <h1>
        Magic <span className="normal-weight">+</span> Wagmi
      </h1>
      {!isConnected ? <SignIn /> : <button className="disconnect-button" onClick={() => disconnect()}>
          Disconnect
        </button>}
    </div>
  );
};

export default Dashboard;