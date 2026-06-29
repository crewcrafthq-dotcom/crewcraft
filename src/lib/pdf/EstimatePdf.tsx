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

// Clean white, slate-neutral system. The trade accent is used sparingly:
// the top rule, the ESTIMATE label, section headers, and the totals bar.
const WHITE = '#FFFFFF';
const INK = '#0F1B2A'; // headings
const BODY = '#334155'; // slate-700
const MUTED = '#64748B'; // slate-500
const LINE = '#E2E8F0'; // slate-200
const PANEL = '#F8FAFC'; // slate-50

const styles = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    color: BODY,
    fontFamily: 'Poppins',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 58,
    paddingHorizontal: 44,
    lineHeight: 1.45,
  },
  accentRule: { height: 4, borderRadius: 2, marginBottom: 20 },

  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { flexDirection: 'column', maxWidth: 300 },
  logo: { height: 38, maxWidth: 180, objectFit: 'contain', marginBottom: 8 },
  bizName: { fontSize: 15, fontWeight: 700, color: INK },
  bizLine: { fontSize: 9, color: MUTED, marginTop: 1 },
  docCol: { flexDirection: 'column', alignItems: 'flex-end' },
  docWord: { fontSize: 17, fontWeight: 700, letterSpacing: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', width: 150, marginTop: 3 },
  metaLabel: { fontSize: 9, color: MUTED },
  metaVal: { fontSize: 9, color: INK, fontWeight: 600 },

  divider: { height: 1, backgroundColor: LINE, marginVertical: 18 },

  // blocks
  eyebrow: { fontSize: 8, fontWeight: 700, letterSpacing: 1, color: MUTED, marginBottom: 4 },
  custName: { fontSize: 12, fontWeight: 600, color: INK },
  custLine: { fontSize: 9, color: BODY },
  block: { marginBottom: 18 },
  scope: { fontSize: 10, color: BODY },

  // table
  thead: {
    flexDirection: 'row',
    backgroundColor: PANEL,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  th: { fontSize: 8, fontWeight: 700, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase' },
  groupLabel: { fontSize: 9, fontWeight: 700, marginTop: 12, marginBottom: 2, paddingHorizontal: 10 },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  cDesc: { flex: 1, paddingRight: 8, color: INK },
  cQty: { width: 40, textAlign: 'right', color: BODY },
  cUnit: { width: 46, textAlign: 'center', color: MUTED },
  cRate: { width: 66, textAlign: 'right', color: BODY },
  cAmt: { width: 74, textAlign: 'right', fontWeight: 600, color: INK },

  // totals
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 },
  totalsBox: { width: 240 },
  tRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 4 },
  tLabel: { fontSize: 10, color: MUTED },
  tVal: { fontSize: 10, color: INK, fontWeight: 500 },
  grand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  grandLabel: { fontSize: 11, fontWeight: 700 },
  grandVal: { fontSize: 14, fontWeight: 700 },
  depRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 4, marginTop: 2 },

  // terms / footer
  terms: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: LINE },
  termsText: { fontSize: 9, color: MUTED },
  footer: {
    position: 'absolute',
    bottom: 26,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footText: { fontSize: 8, color: MUTED },
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

  const contact = [business.phone, business.email].filter(Boolean).join('   ·   ');
  const number = `EST-${estimate.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;

  return (
    <Document title={`Estimate — ${business.name}`}>
      <Page size="LETTER" style={styles.page}>
        <View style={[styles.accentRule, { backgroundColor: theme.accent }]} />

        {/* header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            {business.logo_url ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.logo} src={business.logo_url} />
            ) : null}
            <Text style={styles.bizName}>{business.name}</Text>
            {business.address ? <Text style={styles.bizLine}>{business.address}</Text> : null}
            {contact ? <Text style={styles.bizLine}>{contact}</Text> : null}
          </View>
          <View style={styles.docCol}>
            <Text style={[styles.docWord, { color: theme.accentDeep }]}>ESTIMATE</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaVal}>{shortDate(estimate.created_at)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Number</Text>
              <Text style={styles.metaVal}>{number}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* customer */}
        <View style={styles.block}>
          <Text style={styles.eyebrow}>PREPARED FOR</Text>
          <Text style={styles.custName}>{estimate.customer_name || 'Customer'}</Text>
          {estimate.customer_address ? <Text style={styles.custLine}>{estimate.customer_address}</Text> : null}
          {estimate.customer_phone ? <Text style={styles.custLine}>{estimate.customer_phone}</Text> : null}
          {estimate.customer_email ? <Text style={styles.custLine}>{estimate.customer_email}</Text> : null}
        </View>

        {/* scope */}
        {estimate.scope_of_work ? (
          <View style={styles.block}>
            <Text style={styles.eyebrow}>SCOPE OF WORK</Text>
            <Text style={styles.scope}>{estimate.scope_of_work}</Text>
          </View>
        ) : null}

        {/* line items */}
        <View>
          <View style={styles.thead}>
            <Text style={[styles.th, styles.cDesc]}>Description</Text>
            <Text style={[styles.th, styles.cQty]}>Qty</Text>
            <Text style={[styles.th, styles.cUnit]}>Unit</Text>
            <Text style={[styles.th, styles.cRate]}>Rate</Text>
            <Text style={[styles.th, styles.cAmt]}>Amount</Text>
          </View>

          {groups.map((group) => (
            <View key={group.category} wrap={false}>
              <Text style={[styles.groupLabel, { color: theme.accentDeep }]}>
                {CATEGORY_LABELS[group.category]}
              </Text>
              {group.items.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.cDesc}>{item.description}</Text>
                  <Text style={styles.cQty}>{trimNum(item.quantity)}</Text>
                  <Text style={styles.cUnit}>{item.unit}</Text>
                  <Text style={styles.cRate}>{money(item.unit_price)}</Text>
                  <Text style={styles.cAmt}>{money(item.line_total)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.tRow}>
              <Text style={styles.tLabel}>Subtotal</Text>
              <Text style={styles.tVal}>{money(totals.subtotal)}</Text>
            </View>
            <View style={styles.tRow}>
              <Text style={styles.tLabel}>Tax ({trimNum(estimate.tax_rate)}%)</Text>
              <Text style={styles.tVal}>{money(totals.taxAmount)}</Text>
            </View>
            <View style={[styles.grand, { backgroundColor: theme.accent }]}>
              <Text style={[styles.grandLabel, { color: theme.accentFg }]}>Total</Text>
              <Text style={[styles.grandVal, { color: theme.accentFg }]}>{money(totals.total)}</Text>
            </View>
            {estimate.deposit > 0 ? (
              <>
                <View style={styles.depRow}>
                  <Text style={styles.tLabel}>Deposit due</Text>
                  <Text style={[styles.tVal, { color: theme.accentDeep }]}>{money(totals.depositDue)}</Text>
                </View>
                <View style={styles.depRow}>
                  <Text style={styles.tLabel}>Balance due</Text>
                  <Text style={styles.tVal}>{money(totals.balanceDue)}</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* terms */}
        {estimate.notes ? (
          <View style={styles.terms}>
            <Text style={styles.eyebrow}>NOTES & TERMS</Text>
            <Text style={styles.termsText}>{estimate.notes}</Text>
          </View>
        ) : null}

        {/* footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footText}>
            {business.license ? `License ${business.license}` : business.name}
          </Text>
          <Text style={styles.footText}>{contact}</Text>
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
