import {
  Column,
  Divider,
  Document,
  Heading,
  LineBreak,
  PageBreak,
  PageFooter,
  PageNumber,
  Row,
  Text,
  token,
} from "@hyper-elements/react";
import { InfoGrid, Monogram, OliveBranch, ScheduleTable } from "../components";
import { wedding } from "../data";
import { printTheme } from "../theme";

/**
 * The printable invitation (Document root, A5 portrait, two pages).
 * Page one is the formal invitation; page two holds the details, split
 * with a PageBreak. Content taller than a page is cut off in PDF, so each
 * page is sized to fit — validate() reports document/overflow otherwise.
 */
export function WeddingDocument() {
  return (
    <Document
      size="A5"
      orientation="portrait"
      margin={28}
      theme={printTheme}
      title={`${wedding.couple.first} & ${wedding.couple.second} — Wedding Invitation`}
      lang="en"
      style={{ gap: 0 }}
    >
      <PageFooter>
        <Text style={{ fontSize: 10, color: token("colors.muted"), textAlign: "center" }}>
          {wedding.couple.first} & {wedding.couple.second} · {wedding.date.day} — Page <PageNumber /> of{" "}
          <PageNumber total />
        </Text>
      </PageFooter>

      {/* Page one: the formal invitation. */}
      <Column style={{ gap: 16, alignItems: "center", padding: [40, 0, 0] }}>
        <OliveBranch width={60} height={100} />
        <Text style={{ apply: ["kicker"], textAlign: "center" }}>Together with their families</Text>
        <Heading level={1} style={{ fontSize: 30, fontStyle: "italic", textAlign: "center" }}>
          {wedding.couple.firstFull}
          <LineBreak />
          &
          <LineBreak />
          {wedding.couple.secondFull}
        </Heading>
        <Text style={{ textAlign: "center" }}>request the pleasure of your company at their wedding</Text>
        {/* A Divider with a width sits at the left in a Document, so a Row centers it. */}
        <Row style={{ justifyContent: "center" }}>
          <Divider style={{ width: 120, borderTop: { width: 1, style: "solid", color: token("colors.accent") } }} />
        </Row>
        <Text style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>
          {wedding.date.weekday}, {wedding.date.day}
        </Text>
        <Text style={{ textAlign: "center" }}>at five o'clock in the afternoon</Text>
        <Text style={{ textAlign: "center" }}>
          {wedding.venue.name} — {wedding.venue.garden}
          <LineBreak />
          Alaçatı, Çeşme, Türkiye
        </Text>
        <Monogram width={240} />
        <Text style={{ fontSize: 13, color: token("colors.muted"), textAlign: "center" }}>
          Reception to follow · Kindly reply by {wedding.date.rsvpBy}
        </Text>
      </Column>

      <PageBreak />

      {/* Page two: the details. Kept compact — a page's room is fixed, and
          anything taller is cut off. The smaller body size keeps every
          row on the page. */}
      <Column style={{ gap: 10, fontSize: 14 }}>
        <Column style={{ gap: 8 }}>
          <Heading level={2} style={{ fontSize: 24 }}>
            The day
          </Heading>
          <ScheduleTable />
        </Column>
        <Column style={{ gap: 6 }}>
          <Heading level={2} style={{ fontSize: 24 }}>
            Dress code
          </Heading>
          <Text>{wedding.dressCode}</Text>
        </Column>
        <Column style={{ gap: 8 }}>
          <Heading level={2} style={{ fontSize: 24 }}>
            Travel & stay
          </Heading>
          <InfoGrid layout="table" />
        </Column>
        <Text style={{ fontSize: 12, color: token("colors.muted") }}>
          RSVP at {wedding.links.rsvp} · Questions: hello@example.com
        </Text>
      </Column>
    </Document>
  );
}
