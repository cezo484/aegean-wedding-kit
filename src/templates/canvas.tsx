import { Canvas, Heading, Text } from "@hyper-elements/react";
import { Monogram, OliveBranch } from "../components";
import { wedding } from "../data";
import { canvasTheme } from "../theme";

/**
 * The save-the-date social card (Canvas, 1200 × 630): olive art, monogram,
 * names, date and place — rendered to PNG with renderImage().
 */
export function WeddingCanvas() {
  return (
    <Canvas
      width={1200}
      height={630}
      theme={canvasTheme}
      title={`${wedding.couple.first} & ${wedding.couple.second} — Save the date`}
      lang="en"
      style={{
        backgroundColor: "#22301F",
        color: "#FAF6EF",
        padding: 48,
        gap: 18,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <OliveBranch width={54} height={90} color="#D8C9A3" oliveColor="#B08D4F" />
      <Text style={{ apply: ["kicker"], color: "#D8C9A3" }}>Save the date</Text>
      <Heading level={1} style={{ fontSize: 72, fontStyle: "italic", color: "#FAF6EF" }}>
        {wedding.couple.first} & {wedding.couple.second}
      </Heading>
      <Monogram color="#D8C9A3" width={280} />
      <Text style={{ fontSize: 28, color: "#FAF6EF" }}>
        {wedding.date.weekday}, {wedding.date.day}
      </Text>
      <Text style={{ fontSize: 20, color: "#D8C9A3" }}>{wedding.venue.line}</Text>
    </Canvas>
  );
}
