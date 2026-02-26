import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image
} from '@react-pdf/renderer';

// Styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#1e3a8a', // Deep Blue
        paddingBottom: 20,
    },
    logoContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#1e3a8a',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    companyInfo: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 28,
        color: '#1e3a8a',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e3a8a',
        backgroundColor: '#f1f5f9',
        padding: 6,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 11,
        color: '#0f172a',
    },
    normalText: {
        fontSize: 11,
        color: '#334155',
    },
    table: {
        width: "100%",
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 6,
        alignItems: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        paddingVertical: 6,
        alignItems: 'center',
    },
    colIcon: { width: '10%' },
    colTask: { width: '70%' },
    colTime: { width: '20%', textAlign: 'right' },
    colText: { fontSize: 10, color: '#334155' },
    colHeader: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
    pricingBox: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 6,
        marginTop: 10,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#cbd5e1',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    footerText: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 9,
        color: '#64748b',
        textAlign: 'center',
        fontStyle: 'italic',
    }
});

interface QuoteProps {
    quote: any;
}

export const ProposalPDF: React.FC<QuoteProps> = ({ quote }) => {
    const currentDate = new Date().toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>CP</Text>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.title}>Cleaning Pro</Text>
                        <Text style={styles.subtitle}>Ontario's Commercial Cleaning Experts</Text>
                        <Text style={styles.subtitle}>Date: {currentDate}</Text>
                    </View>
                </View>

                {/* FACILITY SUMMARY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Facility Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.normalText}>Cleanable Area:</Text>
                        <Text style={styles.boldText}>{quote.workspace}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.normalText}>Service Frequency:</Text>
                        <Text style={styles.boldText}>{quote.frequency} ({quote.visitsPerMonth} visits/mo)</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.normalText}>Estimated Hours Per Visit:</Text>
                        <Text style={styles.boldText}>{quote.perVisitLaborHours} hrs</Text>
                    </View>
                </View>

                {/* SERVICE SCOPE */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Scope (Tasks & Baseline Estimates)</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <View style={styles.colIcon}><Text style={styles.colHeader}>✓</Text></View>
                            <View style={styles.colTask}><Text style={styles.colHeader}>Area / Task Description</Text></View>
                            <View style={styles.colTime}><Text style={styles.colHeader}>Est. Mins</Text></View>
                        </View>

                        {quote.traceabilityLog.map((item: any, i: number) => (
                            item.status !== 'NEEDS_INPUT' && (
                                <View key={i} style={styles.tableRow}>
                                    <View style={styles.colIcon}><Text style={styles.colText}>•</Text></View>
                                    <View style={styles.colTask}><Text style={styles.colText}>{item.task}</Text></View>
                                    <View style={styles.colTime}><Text style={styles.colText}>{item.minutes}</Text></View>
                                </View>
                            )
                        ))}
                    </View>
                </View>

                {/* FINANCIAL SUMMARY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financial Investment</Text>
                    <View style={styles.pricingBox}>
                        <View style={styles.pricingRow}>
                            <Text style={styles.normalText}>Monthly Service Cost (Subtotal)</Text>
                            <Text style={styles.normalText}>{quote.costs.subTotal}</Text>
                        </View>
                        <View style={styles.pricingRow}>
                            <Text style={styles.normalText}>HST (13%)</Text>
                            <Text style={styles.normalText}>{quote.costs.taxes}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total Monthly Investment</Text>
                            <Text style={styles.totalText}>{quote.costs.totalMonthlyPrice}</Text>
                        </View>
                    </View>
                </View>

                {/* LEGAL CLAUSE */}
                <Text style={styles.footerText}>
                    This quote is valid for 30 days and based on the provided square footage dataset v4.
                    Final scope subject to site walk-through.
                    Calculated dynamically with transparent dataset sourcing.
                </Text>

            </Page>
        </Document>
    );
};
