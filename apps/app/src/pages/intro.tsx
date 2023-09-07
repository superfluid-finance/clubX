import { SnapScrollContent, SnapScrollWrapper } from "@/components/SnapScroll";

const ScrollDown = () => {
  return <div>Next</div>;
};

const Intro = () => {
  return (
    <SnapScrollWrapper>
      <SnapScrollContent>
        <div>Join CLUBx</div>
        <p>Refer people to get a higher Flow Rate</p>
        <ScrollDown />
      </SnapScrollContent>

      <SnapScrollContent>
        <div>One transaction, flows indefinitely</div>
        <p>(until you cancel)</p>
        <ScrollDown />
      </SnapScrollContent>

      <SnapScrollContent>
        <div>Tokens with streaming capabilities</div>
        <div>12.09574625 CLUBx</div>
        <p>Total amount streamed</p>
        <ScrollDown />
      </SnapScrollContent>

      <SnapScrollContent>
        <div>
          <div>Get paid</div>
          <div>every second</div>
        </div>

        <div>
          <div>Generate yield</div>
          <div>every second</div>
        </div>

        <div>
          <div>Passive</div>
          <div>DCA</div>
        </div>

        <ScrollDown />
      </SnapScrollContent>
    </SnapScrollWrapper>
  );
};

export default Intro;
