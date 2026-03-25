import React, { useEffect } from "react";

const AdSlot = ({ adSlot, adFormat = "auto", fullWidthResponsive = true }) => {
  useEffect(() => {
    try {
      // Ensure the adsbygoogle array exists before pushing
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2261139826410494" // Replace with your ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdSlot;
