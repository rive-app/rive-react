import React, {useEffect} from "react";
import {useRive, RiveFont, decodeFont, Layout, Fit, Alignment} from "@rive-app/react-webgl2";

const THAI_FALLBACK_FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifthai/NotoSerifThai%5Bwdth%2Cwght%5D.ttf";

const ARABIC_FALLBACK_FONT_URL =
  "./NotoSansArabic-VariableFont_wdth,wght.ttf";

const INITIAL_TEXT_SUFFIX = " สวัสดี AND مرحبا بالعالم";


const FallbackFonts = () => {
  // Run before the Rive component is loaded to ensure fallback font strategy is set before Rive begins rendering
  useEffect(() => {
    const loadFont = async () => {
      const notoSerifThai = await fetch(THAI_FALLBACK_FONT_URL).then((res) => res.arrayBuffer());
      const notoSansArabic = await fetch(ARABIC_FALLBACK_FONT_URL).then((res) => res.arrayBuffer());
      const riveArabicDecodedFont = await decodeFont(new Uint8Array(notoSansArabic));
      const riveThaiDecodedFont = await decodeFont(new Uint8Array(notoSerifThai));
      // Check unicode ranges for glyphs and map to font support
      RiveFont.setFallbackFontCallback((missingGlyph: number, weight: number) => {
        if (missingGlyph >= 0x0600 && missingGlyph <= 0x06FF && riveArabicDecodedFont) {
          console.log("Setting fallback for Arabic. Missing Glyph unicode: ", String.fromCodePoint(missingGlyph), missingGlyph, " Weight: ", weight);
          return riveArabicDecodedFont;
        } else if (missingGlyph >= 0x0E00 && missingGlyph <= 0x0E7F && riveThaiDecodedFont) {
          console.log("Setting fallback for Thai. Missing Glyph unicode: ", String.fromCodePoint(missingGlyph), missingGlyph, " Weight: ", weight);
          return riveThaiDecodedFont;
        }
        return null;
      });
    };
    loadFont();
  }, []);

  const { RiveComponent } = useRive({
    src: "fallback-fonts-3.riv",
    autoplay: true,
    autoBind: true,
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onRiveReady: (rive) => {
      const defaultInstance = rive.viewModelInstance;
      const textProp = defaultInstance?.string("text");
      if (textProp) {
        textProp.value = `${textProp.value} - ${INITIAL_TEXT_SUFFIX}`; // Add Thai and Arabic text to demonstrate fallback font support.
      }
    },
  });

  return (
    <RiveComponent />
  );
};

export default FallbackFonts;