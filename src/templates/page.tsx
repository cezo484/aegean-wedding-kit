import { Button, Column, Divider, Heading, Page, Section, Text, token } from "@hyper-elements/react";
import { FaqList, Footer, InfoGrid, Monogram, OliveBranch, RsvpButton, ScheduleTable, VenueBlock } from "../components";
import { wedding } from "../data";
import { aegeanTheme } from "../theme";

/**
 * The RSVP web page (Page root, 960 wide): hero with olive-branch art, our
 * story, the schedule, venue and travel, dress code, FAQ and the RSVP call
 * to action.
 */
export function WeddingPage() {
  return (
    <Page
      width={960}
      theme={aegeanTheme}
      title={`${wedding.couple.first} & ${wedding.couple.second} — ${wedding.date.day}, Alaçatı`}
      description={`Elena & Deniz are getting married at The Olive House, Alaçatı, on ${wedding.date.day}. Schedule, venue, travel and RSVP.`}
      lang="en"
      style={{ gap: 0 }}
    >
      {/* Hero: deep olive band with the olive branch. */}
      <Section
        tokens={{ colors: { background: "#22301F", foreground: "#FAF6EF" } }}
        style={{ padding: [72, 32], gap: 24, alignItems: "center" }}
      >
        <OliveBranch width={72} height={120} color="#D8C9A3" oliveColor="#B08D4F" />
        <Text style={{ apply: ["kicker"], color: "#D8C9A3", textAlign: "center" }}>Save the date</Text>
        <Heading
          level={1}
          style={{ fontSize: 56, fontStyle: "italic", textAlign: "center", color: "#FAF6EF", mobile: { fontSize: 40 } }}
        >
          {wedding.couple.first} & {wedding.couple.second}
        </Heading>
        <Text style={{ fontSize: 20, textAlign: "center", color: "#FAF6EF" }}>
          {wedding.date.weekday}, {wedding.date.day}
        </Text>
        <Text style={{ textAlign: "center", color: "#D8C9A3" }}>{wedding.venue.line}</Text>
        <Divider style={{ width: 160, borderTop: { width: 1, style: "solid", color: "#B08D4F" } }} />
        <RsvpButton />
      </Section>

      {/* Our story. */}
      <Section style={{ padding: [56, 32], gap: 16 }}>
        <Text style={{ apply: ["kicker"] }}>Our story</Text>
        <Heading level={2}>Seven years, one garden</Heading>
        {wedding.story.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}
      </Section>

      {/* Schedule. */}
      <Section style={{ padding: [0, 32, 56], gap: 16 }}>
        <Column style={{ apply: ["card"], gap: 16 }}>
          <Heading level={2}>The day</Heading>
          <ScheduleTable />
        </Column>
      </Section>

      {/* Venue and travel. */}
      <Section style={{ padding: [0, 32, 56], gap: 24 }}>
        <VenueBlock />
        <InfoGrid columns={3} />
      </Section>

      {/* Dress code and FAQ. */}
      <Section style={{ padding: [0, 32, 56], gap: 24 }}>
        <Column style={{ apply: ["band"], gap: 8 }}>
          <Text style={{ apply: ["kicker"] }}>Dress code</Text>
          <Text>{wedding.dressCode}</Text>
        </Column>
        <Column style={{ gap: 16 }}>
          <Heading level={2}>Good to know</Heading>
          <FaqList />
        </Column>
      </Section>

      {/* RSVP band. */}
      <Section
        tokens={{ colors: { background: "#22301F", foreground: "#FAF6EF" } }}
        style={{ padding: [56, 32], gap: 20, alignItems: "center" }}
      >
        <Monogram color="#D8C9A3" />
        <Heading level={2} style={{ textAlign: "center", color: "#FAF6EF" }}>
          Will you join us?
        </Heading>
        <Text style={{ textAlign: "center", color: "#D8C9A3" }}>
          Kindly reply by {wedding.date.rsvpBy} — we cannot wait to celebrate with you.
        </Text>
        <RsvpButton />
        <Button href={wedding.links.registry} variant="outline" style={{ alignSelf: "center" }}>
          View the registry
        </Button>
      </Section>

      {/* Footer. */}
      <Section style={{ padding: [40, 32, 48], gap: 16 }}>
        <Footer />
      </Section>

      {/* Small print, below the footer. */}
      <Section style={{ padding: [0, 32, 32] }}>
        <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
          A fictional wedding, made as a template — replace the names, dates and links with your own.
        </Text>
      </Section>
    </Page>
  );
}
