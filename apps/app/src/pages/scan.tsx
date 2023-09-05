import { FooterButton } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Page";
import { FC, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styled from "styled-components";

const ReaderWrapper = styled.div`
  width: 100%;
  /* height: 100px; */
`;

const Scan = () => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          var cameraId = devices[0].id;

          html5QrCode
            .start(
              cameraId,
              {
                fps: 10, // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
              },
              (decodedText, decodedResult) => {
                console.log("FOUND CODE", decodedText);
                // do something when code is read
              },
              (errorMessage) => {
                console.log("Error", errorMessage);
                // parse error, ignore it.
              }
            )
            .catch((err) => {
              console.log("Starting failed", err);
              // Start failed, handle it.
            });
        }
      })
      .catch((err) => {
        console.log("Catching all them errors", err);
        // handle err
      });
  }, []);

  return (
    <PageWrapper>
      <PageContent>
        <div>Scan the code!</div>
        <ReaderWrapper id="reader" />
      </PageContent>
      <FooterButton>Scan</FooterButton>
    </PageWrapper>
  );
};

export default Scan;
