import { Column, Divider, Email, Heading, Link, MergeTag, Section, Text, token } from "@hyper-elements/react";
import { Footer, Monogram, RsvpButton, ScheduleTable, VenueBlock } from "../components";
import { wedding } from "../data";
import { aegeanTheme } from "../theme";

/**
 * The invitation email (Email root, 600 wide). Typographic hero — Svg is
 * not supported in email, so the monogram and rules carry the ornament.
 * Personalised with a MergeTag for the guest's first name.
 */
export function WeddingEmail() {
  return (
    <Email
      width={600}
      theme={aegeanTheme}
      title={`${wedding.couple.first} & ${wedding.couple.second} — Wedding Invitation`}
      previewText={`You are invited to celebrate with us in Alaçatı on ${wedding.date.day}.`}
      lang="en"
      style={{ gap: 0 }}
    >
      {/* Hero: deep olive band, cream type. */}
      <Section
        tokens={{ colors: { background: "#22301F", foreground: "#FAF6EF" } }}
        style={{ padding: [48, 32], gap: 20, alignItems: "center" }}
      >
        <Text style={{ apply: ["kicker"], color: "#D8C9A3", textAlign: "center" }}>Together with their families</Text>
        <Monogram color="#D8C9A3" />
        <Heading
          level={1}
          style={{ fontSize: 44, fontStyle: "italic", textAlign: "center", color: "#FAF6EF", mobile: { fontSize: 36 } }}
        >
          {wedding.couple.first} & {wedding.couple.second}
        </Heading>
        <Text style={{ fontSize: 18, textAlign: "center", color: "#FAF6EF" }}>
          {wedding.date.weekday}, {wedding.date.day}
        </Text>
        <Text style={{ textAlign: "center", color: "#D8C9A3" }}>{wedding.venue.line}</Text>
        <Divider style={{ width: 120, borderTop: { width: 1, style: "solid", color: "#B08D4F" } }} />
      </Section>

      {/* Body. */}
      <Column style={{ padding: [32, 32, 40], gap: 28 }}>
        <Column style={{ gap: 12 }}>
          <Text>
            Dear <MergeTag name="first_name" />,
          </Text>
          <Text>
            We are getting married in the garden where it all began — under the olive trees of Alaçatı — and we would
            love you to be there. Here is everything you need for the day.
          </Text>
        </Column>

        <Column style={{ apply: ["card"], gap: 16 }}>
          <Heading level={2}>The day</Heading>
          <ScheduleTable />
        </Column>

        <VenueBlock />

        <Column style={{ gap: 12, alignItems: "center" }}>
          <RsvpButton />
          <Text style={{ fontSize: 13, color: token("colors.muted"), textAlign: "center" }}>
            Kindly reply by {wedding.date.rsvpBy}. If the button does not work, use{" "}
            <Link href={wedding.links.rsvp}>{wedding.links.rsvp}</Link>.
          </Text>
        </Column>

        <Column style={{ apply: ["band"], gap: 8 }}>
          <Text style={{ apply: ["kicker"] }}>Travel & stay</Text>
          <Text>
            Fly to İzmir Adnan Menderes Airport (ADB) — Alaçatı is about an hour along the coast, and a shuttle runs
            on the day. Rooms are held at three stone houses in the old town; mention “Elena & Deniz” when you book.
          </Text>
          <Text>
            Dress code: {wedding.dressCode} Full details are on{" "}
            <Link href={wedding.links.home}>our wedding page</Link>.
          </Text>
        </Column>
      </Column>

      {/* Footer. */}
      <Section style={{ padding: [32, 32, 40], gap: 16 }}>
        <Footer />
      </Section>
    </Email>
  );
}
