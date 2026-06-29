import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

import { computeTotals, groupByCategory, CATEGORY_LABELS } from '@/lib/estimates';
import { money, shortDate } from '@/lib/format';
import { getTheme } from '@/lib/trades';
import type { Business, EstimateWithItems } from '@/lib/types';

// Crewcraft V3 Clean palette (§8)
const CREAM = '#F2EBE0';
const CARD = '#FBF8F2';
const NAVY = '#16263A';
const NAVY_SOFT = '#46566A';
const LINE = '#E2D8C9';

const styles = StyleSheet.create({
  page: {
    backgroundColor: CREAM,
    color: NAVY,
    fontFamily: 'Poppins',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  // header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandCol: { flexDirection: 'column', maxWidth: 300 },
  logo: { height: 40, maxWidth: 180, objectFit: 'contain', marginBottom: 8 },
  bizName: { fontSize: 16, fontWeight: 700 },
  bizLine: { fontSize: 9, color: NAVY_SOFT },
  estimateCol: { flexDirection: 'column', alignItems: 'flex-end' },
  estimateLabel: { fontSize: 18, fontWeight: 700, letterSpacing: 1 },
  estimateMeta: { fontSize: 9, color: NAVY_SOFT, marginTop: 2 },
  accentBar: { height: 3, borderRadius: 2, marginTop: 14, marginBottom: 18 },
  // blocks
  block: { marginBottom: 16 },
  eyebrow: { fontSize: 8, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  customerName: { fontSize: 12, fontWeight: 600 },
  customerLine: { fontSize: 9, color: NAVY_SOFT },
  scope: { fontSize: 10, color: NAVY },
  // table
  table: { marginTop: 4 },
  thead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: NAVY, paddingBottom: 4, marginBottom: 2 },
  th: { fontSize: 8, fontWeight: 600, color: NAVY_SOFT, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionHead: { marginTop: 8, marginBottom: 2 },
  sectionHeadText: { fontSize: 9, fontWeight: 700 },
  row: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: LINE },
  cDesc: { flex: 1, paddingRight: 8 },
  cQty: { width: 44, textAlign: 'right' },
  cUnit: { width: 48, textAlign: 'center', color: NAVY_SOFT },
  cPrice: { width: 64, textAlign: 'right' },
  cAmt: { width: 72, textAlign: 'right', fontWeight: 600 },
  // totals
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  totalsBox: { width: 220 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalsLabel: { fontSize: 10, color: NAVY_SOFT },
  totalsValue: { fontSize: 10, fontWeight: 500 },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginTop: 4 },
  grandLabel: { fontSize: 11, fontWeight: 700 },
  grandValue: { fontSize: 13, fontWeight: 700 },
  depositRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, marginTop: 2 },
  // terms / footer
  terms: { marginTop: 22, paddingTop: 10, borderTopWidth: 1, borderTopColor: LINE },
  termsText: { fontSize: 9, color: NAVY_SOFT },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: NAVY_SOFT },
});

interface Props {
  business: Business;
  estimate: EstimateWithItems;
}

export function EstimatePdf({ business, estimate }: Props) {
  const theme = getTheme(business.trade);
  const groups = groupByCategory(estimate.line_items);
  const totals = computeTotals(
    estimate.line_items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    estimate.tax_rate,
    estimate.deposit,
  );

  const contactBits = [business.phone, business.email].filter(Boolean).join('  ·  ');

  return (
    <Document title={`Estimate — ${business.name}`}>
      <Page size="LETTER" style={styles.page}>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.brandCol}>
            {business.logo_url ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.logo} src={business.logo_url} />
            ) : (
              <Text style={styles.bizName}>{business.name}</Text>
            )}
            {business.logo_url ? <Text style={styles.bizName}>{business.name}</Text> : null}
            {business.address ? <Text style={styles.bizLine}>{business.address}</Text> : null}
            {contactBits ? <Text style={styles.bizLine}>{contactBits}</Text> : null}
          </View>
          <View style={styles.estimateCol}>
            <Text style={[styles.estimateLabel, { color: theme.accentDeep }]}>ESTIMATE</Text>
            <Text style={styles.estimateMeta}>{shortDate(estimate.created_at)}</Text>
          </View>
        </View>

        <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />

        {/* customer */}
        <View style={styles.block}>
          <Text style={styles.eyebrow}>Prepared for</Text>
          <Text style={styles.customerName}>{estimate.customer_name || 'Customer'}</Text>
          {estimate.customer_address ? <Text style={styles.customerLine}>{estimate.customer_address}</Text> : null}
          {estimate.customer_phone ? <Text style={styles.customerLine}>{estimate.customer_phone}</Text> : null}
          {estimate.customer_email ? <Text style={styles.customerLine}>{estimate.customer_email}</Text> : null}
        </View>

        {/* scope */}
        {estimate.scope_of_work ? (
          <View style={styles.block}>
            <Text style={styles.eyebrow}>Scope of work</Text>
            <Text style={styles.scope}>{estimate.scope_of_work}</Text>
          </View>
        ) : null}

        {/* line items */}
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={[styles.th, styles.cDesc]}>Description</Text>
            <Text style={[styles.th, styles.cQty]}>Qty</Text>
            <Text style={[styles.th, styles.cUnit]}>Unit</Text>
            <Text style={[styles.th, styles.cPrice]}>Price</Text>
            <Text style={[styles.th, styles.cAmt]}>Amount</Text>
          </View>

          {groups.map((group) => (
            <View key={group.category} wrap={false}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionHeadText, { color: theme.accentDeep }]}>
                  {CATEGORY_LABELS[group.category]}
                </Text>
              </View>
              {group.items.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.cDesc}>{item.description}</Text>
                  <Text style={styles.cQty}>{trimNum(item.quantity)}</Text>
                  <Text style={styles.cUnit}>{item.unit}</Text>
                  <Text style={styles.cPrice}>{money(item.unit_price)}</Text>
                  <Text style={styles.cAmt}>{money(item.line_total)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{money(totals.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax ({trimNum(estimate.tax_rate)}%)</Text>
              <Text style={styles.totalsValue}>{money(totals.taxAmount)}</Text>
            </View>
            <View style={[styles.grandRow, { backgroundColor: theme.accent }]}>
              <Text style={[styles.grandLabel, { color: theme.accentFg }]}>Total</Text>
              <Text style={[styles.grandValue, { color: theme.accentFg }]}>{money(totals.total)}</Text>
            </View>
            {estimate.deposit > 0 ? (
              <>
                <View style={styles.depositRow}>
                  <Text style={styles.totalsLabel}>Deposit due</Text>
                  <Text style={[styles.totalsValue, { color: theme.accentDeep }]}>{money(totals.depositDue)}</Text>
                </View>
                <View style={styles.depositRow}>
                  <Text style={styles.totalsLabel}>Balance due</Text>
                  <Text style={styles.totalsValue}>{money(totals.balanceDue)}</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* terms / notes */}
        {estimate.notes ? (
          <View style={styles.terms}>
            <Text style={styles.eyebrow}>Notes & terms</Text>
            <Text style={styles.termsText}>{estimate.notes}</Text>
          </View>
        ) : null}

        {/* footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {business.license ? `License ${business.license}` : business.name}
          </Text>
          <Text style={styles.footerText}>{contactBits}</Text>
        </View>
      </Page>
    </Document>
  );
}

/** Show 2 as "2" and 2.5 as "2.5" (no trailing .00). */
function trimNum(n: number): string {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}
