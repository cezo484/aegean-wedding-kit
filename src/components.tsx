import {
  Button,
  Circle,
  Column,
  Divider,
  Grid,
  Heading,
  LineBreak,
  Link,
  List,
  ListItem,
  Menu,
  Path,
  Row,
  Social,
  Span,
  Svg,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
  type Token,
} from "@hyper-elements/react";
import { wedding } from "./data";

/**
 * Shared components. Each is written once and rendered unchanged inside
 * several roots — the email, the page, the print document and the social
 * card — wherever the elements allow. (Svg cannot go in an Email, so the
 * email gets the typographic Monogram instead of the olive branch.)
 */

/**
 * A sprig of olive, drawn with Paths, Ellipses and Circles. The coordinates
 * are fixed by hand — no randomness, so every render draws the same branch.
 */
export function OliveBranch({
  width = 72,
  height = 120,
  color = "#5A6B3C",
  oliveColor = "#6E7F45",
}: {
  width?: number;
  height?: number;
  color?: string;
  oliveColor?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 200" title="Olive branch">
      {/* Stem: one gentle curve. */}
      <Path
        d="M60 196 C 56 160, 64 120, 60 84 C 57 56, 60 30, 60 6"
        style={{ fill: "transparent", stroke: color, strokeWidth: 2.5 }}
      />
      {/* Leaves: pointed ovals, alternating sides, smaller towards the top. */}
      <Path d="M59 168 C 47 166, 35 158, 28 148 C 40 148, 52 156, 59 168 Z" style={{ fill: color, opacity: 0.9 }} />
      <Path d="M61 156 C 73 154, 85 146, 92 136 C 80 136, 68 144, 61 156 Z" style={{ fill: color, opacity: 0.7 }} />
      <Path d="M60 128 C 48 126, 36 118, 30 108 C 42 108, 54 116, 60 128 Z" style={{ fill: color, opacity: 0.9 }} />
      <Path d="M61 116 C 73 114, 85 106, 90 96 C 78 96, 66 104, 61 116 Z" style={{ fill: color, opacity: 0.7 }} />
      <Path d="M60 88 C 50 86, 40 80, 34 70 C 44 70, 54 76, 60 88 Z" style={{ fill: color, opacity: 0.9 }} />
      <Path d="M61 76 C 71 74, 81 68, 86 58 C 76 58, 66 64, 61 76 Z" style={{ fill: color, opacity: 0.7 }} />
      <Path d="M60 44 C 54 34, 54 22, 60 10 C 66 22, 66 34, 60 44 Z" style={{ fill: color, opacity: 0.9 }} />
      {/* Olives, clustered at the foot of the stem. */}
      <Circle cx={46} cy={182} r={5.5} style={{ fill: oliveColor }} />
      <Circle cx={73} cy={176} r={5} style={{ fill: oliveColor, opacity: 0.85 }} />
      <Circle cx={60} cy={192} r={4} style={{ fill: oliveColor, opacity: 0.7 }} />
    </Svg>
  );
}

/** The couple's monogram between two rules — the email's typographic ornament. */
export function Monogram({
  color = token("colors.accent"),
  width = 320,
}: {
  color?: string | Token;
  width?: number;
}) {
  const rule = { width: 1, style: "solid", color } as const;
  return (
    <Row style={{ width, gap: 16, alignItems: "center" }}>
      <Column style={{ flex: 1 }}>
        <Divider style={{ borderTop: rule }} />
      </Column>
      {/* A fixed width: Outlook needs to know this column's size in a Row. */}
      <Column style={{ flex: "none", width: 100 }}>
        <Text
          style={{
            fontFamily: token("fonts.heading"),
            fontSize: 20,
            letterSpacing: 6,
            color,
            textAlign: "center",
          }}
        >
          {wedding.couple.monogram}
        </Text>
      </Column>
      <Column style={{ flex: 1 }}>
        <Divider style={{ borderTop: rule }} />
      </Column>
    </Row>
  );
}

/** The day's schedule, from src/data.ts. */
export function ScheduleTable() {
  return (
    <Table
      style={{
        cellPadding: [6, 12],
        rowBorder: { width: 1, style: "solid", color: token("colors.border") },
      }}
    >
      <TableRow header>
        <TableCell style={{ width: 96 }}>Time</TableCell>
        <TableCell>Moment</TableCell>
      </TableRow>
      {wedding.schedule.map((item) => (
        <TableRow key={item.time}>
          <TableCell style={{ fontWeight: 700, color: token("colors.olive") }}>{item.time}</TableCell>
          <TableCell>
            <Span style={{ fontWeight: 700 }}>{item.title}</Span>
            <LineBreak />
            <Span style={{ color: token("colors.muted") }}>{item.detail}</Span>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

/**
 * Getting there, where to stay, things to do — three cards in a grid, or,
 * as `layout="table"`, three compact rows for the print invitation, where
 * a page's room is fixed and anything taller is cut off.
 */
export function InfoGrid({ columns = 3, layout = "grid" }: { columns?: number; layout?: "grid" | "table" }) {
  if (layout === "table") {
    return (
      <Table
        style={{
          cellPadding: [5, 12],
          rowBorder: { width: 1, style: "solid", color: token("colors.border") },
        }}
      >
        {wedding.travel.map((item) => (
          <TableRow key={item.title}>
            <TableCell style={{ width: 110, fontWeight: 700, color: token("colors.olive") }}>{item.title}</TableCell>
            <TableCell>{item.body}</TableCell>
          </TableRow>
        ))}
      </Table>
    );
  }
  return (
    <Grid columns={columns} style={{ gap: 16 }}>
      {wedding.travel.map((item) => (
        <Column key={item.title} style={{ apply: ["card"] }}>
          <Heading level={3}>{item.title}</Heading>
          <Text>{item.body}</Text>
        </Column>
      ))}
    </Grid>
  );
}

/** The venue: name, address and a link to the map. */
export function VenueBlock() {
  return (
    <Column style={{ gap: 8 }}>
      <Text style={{ apply: ["kicker"] }}>The venue</Text>
      <Heading level={2}>
        {wedding.venue.name} — {wedding.venue.garden}
      </Heading>
      <Text>{wedding.venue.address}</Text>
      <Text>
        <Link href={wedding.links.map}>Find it on the map</Link>
      </Text>
    </Column>
  );
}

/** Questions and answers, as a list. */
export function FaqList() {
  return (
    <List style={{ gap: 16 }}>
      {wedding.faq.map((item) => (
        <ListItem key={item.question}>
          <Span style={{ fontWeight: 700 }}>{item.question}</Span>
          <LineBreak />
          {item.answer}
        </ListItem>
      ))}
    </List>
  );
}

/** The RSVP button, in the theme's primary variant. */
export function RsvpButton() {
  return (
    <Button href={wedding.links.rsvp} variant="primary" style={{ alignSelf: "center" }}>
      RSVP by {wedding.date.rsvpBy}
    </Button>
  );
}

/**
 * Footer for the email and the page: a menu of the kit's sections, the
 * couple's social profiles and a small-print line. (Social and Menu are
 * email/web elements, so the print document and the social card carry a
 * plain-text footer instead.)
 */
export function Footer() {
  return (
    <Column style={{ gap: 16, alignItems: "center" }}>
      <Menu
        items={[
          { text: "Our story", href: wedding.links.story },
          { text: "Schedule", href: wedding.links.schedule },
          { text: "Venue", href: wedding.links.venue },
          { text: "Travel", href: wedding.links.travel },
          { text: "Registry", href: wedding.links.registry },
          { text: "RSVP", href: wedding.links.rsvp },
        ]}
        separator="·"
        style={{ color: token("colors.olive"), justifyContent: "center" }}
      />
      <Social
        icons={[
          { name: "Instagram", href: wedding.links.instagram },
          { name: "Pinterest", href: wedding.links.pinterest },
        ]}
        iconType="circle"
        size={32}
      />
      <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
        {wedding.couple.first} & {wedding.couple.second} · {wedding.date.day} · Alaçatı, Türkiye
        <LineBreak />
        Questions? Write to us at <Link href={wedding.links.email}>hello@example.com</Link>.
      </Text>
    </Column>
  );
}
