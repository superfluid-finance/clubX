import { FooterButton, FooterLink } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Layout";
import { FC, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styled from "styled-components";

const ReaderWrapper = styled.div`
  width: 100%;
`;

const Scan = () => {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const QRCodeReader = useRef<Html5Qrcode>();

  useEffect(() => {
    if (!cameraRef.current) return;

    QRCodeReader.current = new Html5Qrcode(cameraRef.current.id);
  }, [cameraRef.current]);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!QRCodeReader.current) return;

        if (devices && devices.length) {
          QRCodeReader.current
            .start(
              { facingMode: "environment" },
              {
                fps: 1,
                qrbox: { width: 250, height: 250 },
              },
              (decodedText) => {
                console.log("FOUND CODE", decodedText);
              },
              undefined
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
  }, [QRCodeReader.current]);

  return (
    <PageWrapper>
      <PageContent>
        <div>Scan the code!</div>
        <ReaderWrapper ref={cameraRef} id="reader" />
      </PageContent>
      <FooterLink href="/">Cancel</FooterLink>
    </PageWrapper>
  );
};

export default Scan;
