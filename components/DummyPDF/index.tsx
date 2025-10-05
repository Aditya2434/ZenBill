import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Invoice, CompanyProfile } from "../../types";

const styles = StyleSheet.create({
  page: {
    padding: 12,
    paddingTop: 24,
  },

  container: {
    borderWidth: 1,
    width: "100%",
    // height: "100%", // to fit single page
  },

  boldText: {
    fontWeight: "bold",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  companyLogo: {
    height: 72,
    width: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  companyLogoImg: {
    height: 72,
    width: 72,
    objectFit: "contain",
  },
  companyDetails: {
    flexGrow: 1,
    marginHorizontal: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  companyHeaderName: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "bold",
  },
  companyHeaderAddress: {
    fontSize: 8,
    textAlign: "center",
  },
  companyHeaderGSTIN: {
    fontSize: 8,
    textAlign: "center",
  },

  companyHeaderPAN: {
    fontSize: 8,
    textAlign: "center",
  },
  companyQR: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },

  taxTransportInvoiceDetails: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderColor: "black",
  },

  taxInvoiceDetails: {
    flex: 1,
    padding: 8,
  },
  transportInvoiceDetails: {
    flex: 1,
    padding: 8,
    borderLeftWidth: 1,
    borderColor: "black",
  },
  labelWithValue: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    // border: "1px solid red",
  },
  lwvLabel: {
    width: "40%",
    textAlign: "left",
    paddingRight: 4,
    fontSize: 9,
    fontWeight: 500,
  },
  lwvColon: {
    width: 6,
    textAlign: "center",
    fontSize: 9,
  },
  lwvValue: {
    flex: 1,
    paddingLeft: 2,
    fontSize: 9,
    textAlign: "left",
  },

  stateCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    marginBottom: 3,
  },
  stateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  codeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  stateInlineText: {
    fontSize: 9,
  },

  // Right-aligned value for totals/taxes
  lwvValueRight: {
    flex: 1,
    fontSize: 9,
    textAlign: "right",
    paddingRight: 2,
  },

  lwvValueWrapper: {
    width: "60%",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  // Special wrapper for Total Amount in Words - single line
  lwvValueWrapperSingleLine: {
    width: "50%",
    flexDirection: "row",
    flexWrap: "nowrap",
  },

  // Bank details tighter layout
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  bankLabel: {
    width: "40%",
    textAlign: "left",
    paddingRight: 6,
    fontSize: 9,
    fontWeight: 500,
  },
  bankValueWrapper: {
    width: "60%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bankValue: {
    flex: 1,
    paddingLeft: 2,
    fontSize: 9,
    textAlign: "left",
  },

  addressBillShipping: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
  },

  billAddressDetails: {
    flex: 1,
    padding: 4,
  },

  shippingAddressDetails: {
    flex: 1,
    padding: 4,
    borderLeftWidth: 1,
    borderColor: "black",
  },

  h3LabelBgGray: {
    height: 22,
    backgroundColor: "#e5e7eb", // background
    flexDirection: "row", // like display:flex
    alignItems: "center", // vertical center
    justifyContent: "center", // horizontal center
    marginBottom: 8,
  },
  h3Text: {
    fontSize: 9,
    fontWeight: "bold",
  },

  amountDetails: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    fontWeight: "bold",
  },

  amountInWord: {
    flex: 1,
    padding: 6,
  },

  labelTotalAmountInWords: {
    width: "100%",
  },

  // Single-row label/value for amount in words
  amountWordsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountWordsLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginRight: 3,
  },
  amountWordsValue: {
    fontSize: 9,
    lineHeight: 1.1,
    flexGrow: 1,
  },

  labelTitleTotalAmountInWords: {
    fontSize: 9,
    fontWeight: "bold",
  },

  labelValueTotalAmountInWords: {
    fontSize: 9,
    marginTop: 1,
  },

  // Divider line for total rows
  taxDivider: {
    borderTopWidth: 1,
    borderColor: "black",
    paddingTop: 4,
    marginTop: 2,
  },

  amountTaxDetails: {
    flex: 1,
    padding: 8,
  },

  bankDetails: {
    flexDirection: "row",
    width: "100%",
  },

  bankDetailsInfo: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },

  termConditionSupplyContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },

  termConditionSupplyTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },
  termConditionSupplyItem: {
    fontSize: 8,
    marginBottom: 2,
    textAlign: "left",
  },

  // Product Table
  productTable: {
    width: "100%",
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch", // Ensures children (cell containers) stretch to fill the row's height
    minHeight: 14,
  },

  rowHeader: {
    flexDirection: "row",
    alignItems: "stretch", // Ensures children (cell containers) stretch to fill the row's height
    height: 24,
  },

  headerRow: {
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
  },

  tableHeaderCellContainer: {
    flexDirection: "row", // Enables flexbox properties for children
    alignItems: "center", // Vertically centers the Text child within this View
    paddingHorizontal: 2, // Small horizontal padding for text inside cells
  },

  tableCellContainer: {
    flexDirection: "row", // Enables flexbox properties for children
    alignItems: "center", // Vertically centers the Text child within this View
    paddingHorizontal: 2, // Small horizontal padding for text inside cells
  },

  // NEW: Style for the actual <Text> content within the cell container
  tableCellText: {
    fontSize: 9,
    flexGrow: 1, // Allows Text to take available horizontal space
  },

  // Column specific width/flex and borders (applied to tableCellContainer)
  serialNo: {
    width: 30, // ~0.3 inches
    borderRightWidth: 1,
  },
  productName: {
    flex: 2, // Takes remaining space
    borderRightWidth: 1,
  },
  hsnCode: {
    width: 60, // ~0.8 inches
    borderRightWidth: 1,
  },
  uom: {
    width: 50, // ~0.7 inches
    borderRightWidth: 1,
  },
  qty: {
    width: 80, // ~1.1 inches
    borderRightWidth: 1,
  },
  rate: {
    width: 70, // ~1.0 inches
    borderRightWidth: 1,
  },
  total: {
    width: 90, // ~1.3 inches
  },

  textCenter: { textAlign: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  textRightPadded: {
    textAlign: "right",
    paddingRight: 6, // Apply padding here to push text from right edge
  },

  footerContainer: {
    width: "100%",
    flexDirection: "row", // display:flex
    height: 90,
  },

  footerSubject: {
    flex: 1,
    height: "100%",
    flexDirection: "column", // display:flex
    justifyContent: "flex-end",
  },

  fSLabel: {
    fontSize: 8,
    paddingBottom: 6,
    paddingLeft: 8,
  },

  footerStamp: {
    flex: 1,
    padding: 8,
    flexDirection: "column",
    alignItems: "center",
  },

  fStampStampImg: {
    width: 92,
    height: 92,
    objectFit: "contain",
    alignSelf: "center",
  },

  fStampLabel: {
    paddingTop: 6,
    fontSize: 8,
    paddingBottom: 6,
    textAlign: "center",
  },

  footerSignature: {
    flex: 1,
    padding: 8,
    flexDirection: "column",
  },

  fSignLabel: {
    marginBottom: 6,
    fontSize: 8,
  },

  fSignPhoto: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  fSignLabelAuth: {
    paddingTop: 6,
    paddingBottom: 6,
    alignSelf: "flex-end",
    fontSize: 8,
  },

  // Keep bottom section together
  bottomBlock: {
    marginTop: 8,
  },

  bankRowHeader: {
    fontSize: 8,
    fontWeight: "bold",
  },
});

function formatCurrencyINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function numberToWordsINR(num: number): string {
  const a = [
    "",
    "ONE ",
    "TWO ",
    "THREE ",
    "FOUR ",
    "FIVE ",
    "SIX ",
    "SEVEN ",
    "EIGHT ",
    "NINE ",
    "TEN ",
    "ELEVEN ",
    "TWELVE ",
    "THIRTEEN ",
    "FOURTEEN ",
    "FIFTEEN ",
    "SIXTEEN ",
    "SEVENTEEN ",
    "EIGHTEEN ",
    "NINETEEN ",
  ];
  const b = [
    "",
    "",
    "TWENTY ",
    "THIRTY ",
    "FORTY ",
    "FIFTY ",
    "SIXTY ",
    "SEVENTY ",
    "EIGHTY ",
    "NINETY ",
  ];

  const [integerPartStr] = num.toFixed(2).split(".");
  let n = parseInt(integerPartStr, 10);
  if (n === 0) return "ZERO RUPEES ONLY.";
  if (n > 999999999) return "NUMBER TOO LARGE";

  const inWords = (val: number, suffix: string) => {
    let str = "";
    if (val > 19) {
      str += b[Math.floor(val / 10)] + a[val % 10];
    } else {
      str += a[val];
    }
    if (val !== 0) {
      str += suffix;
    }
    return str;
  };

  let res = "";
  res += inWords(Math.floor(n / 10000000), "CRORE ");
  n %= 10000000;
  res += inWords(Math.floor(n / 100000), "LAKH ");
  n %= 100000;
  res += inWords(Math.floor(n / 1000), "THOUSAND ");
  n %= 1000;
  res += inWords(Math.floor(n / 100), "HUNDRED ");
  n %= 100;
  if (n > 0 && res.trim() !== "") {
    res += "AND ";
  }
  res += inWords(n, "");
  return res.trim().replace(/\s\s+/g, " ") + " RUPEES ONLY.";
}

type DummyPDFProps = {
  invoice: Invoice;
  profile: CompanyProfile;
};

function DummyPDF({ invoice, profile }: DummyPDFProps) {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );
  const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
  const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
  const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const total = subtotal + totalTax;

  const totalRows = 11;
  const rows = Array.from(
    { length: Math.max(invoice.items.length, totalRows) },
    (_, i) => invoice.items[i]
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.companyLogo}>
              {profile.logo ? (
                <Image src={profile.logo} style={styles.companyLogoImg} />
              ) : (
                <Text></Text>
              )}
            </View>

            <View style={styles.companyDetails}>
              <Text style={styles.companyHeaderName}>
                {profile.companyName || "COMPANY NAME"}
              </Text>
              <Text style={styles.companyHeaderAddress}>
                {profile.companyAddress || ""}
              </Text>
              <Text style={[styles.companyHeaderGSTIN, styles.boldText]}>
                GSTIN: {profile.gstin || ""}
              </Text>
              <Text style={[styles.companyHeaderPAN, styles.boldText]}>
                PAN: {profile.pan || ""}
              </Text>
            </View>

            <View style={styles.companyQR}>
              <Text>QR</Text>
            </View>
          </View>

          {/* Title Tax invoice */}
          <View style={styles.sectionTitle}>
            <Text>TAX INVOICE</Text>
          </View>

          {/* TaX invoice table */}
          <View style={styles.taxTransportInvoiceDetails}>
            {/* Tax Invoice Details */}
            <View style={styles.taxInvoiceDetails}>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Tax Invoice No.</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.invoiceNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Date</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.issueDate}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>
                  Tax Payable on Reverse Charge
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.taxPayableOnReverseCharge ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <View style={styles.stateCodeContainer}>
                  <View style={styles.stateWrapper}>
                    <Text style={styles.stateInlineText}>State</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {profile.companyState || ""}
                    </Text>
                  </View>
                  <View style={styles.codeWrapper}>
                    <Text style={styles.stateInlineText}>Code</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {profile.companyStateCode || ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Transport Invoice Details */}
            <View style={styles.transportInvoiceDetails}>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Transport Mode</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.transportMode || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Vehicle No</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.vehicleNo || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Date of Supply</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.dateOfSupply || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Place of Supply</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.placeOfSupply || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Order No</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.orderNo || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>GR/LR No</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.grLrNo || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>E WAY BILL No</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.eWayBillNo || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressBillShipping}>
            {/* Tax Invoice Details */}
            <View style={styles.billAddressDetails}>
              <View style={styles.h3LabelBgGray}>
                <Text style={styles.h3Text}>
                  DETAILS OF RECEIVER (BILLED TO)
                </Text>
              </View>

              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Name</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.client?.name || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Address</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.client?.address || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>GSTIN</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.client?.gstin || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <View style={styles.stateCodeContainer}>
                  <View style={styles.stateWrapper}>
                    <Text style={styles.stateInlineText}>State</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {invoice.client?.state || ""}
                    </Text>
                  </View>
                  <View style={styles.codeWrapper}>
                    <Text style={styles.stateInlineText}>Code</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {invoice.client?.stateCode || ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Transport Invoice Details */}
            <View style={styles.shippingAddressDetails}>
              <View style={styles.h3LabelBgGray}>
                <Text style={styles.h3Text}>
                  DETAILS OF RECEIVER (SHIPPED TO)
                </Text>
              </View>

              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Name</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={[styles.lwvValue, styles.boldText]}>
                    {invoice.shippingDetails?.name ||
                      invoice.client?.name ||
                      ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>Address</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.shippingDetails?.address ||
                      invoice.client?.address ||
                      ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={styles.lwvLabel}>GSTIN</Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvColon}>:</Text>
                  <Text style={styles.lwvValue}>
                    {invoice.shippingDetails?.gstin || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <View style={styles.stateCodeContainer}>
                  <View style={styles.stateWrapper}>
                    <Text style={styles.stateInlineText}>State</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {invoice.shippingDetails?.state || ""}
                    </Text>
                  </View>
                  <View style={styles.codeWrapper}>
                    <Text style={styles.stateInlineText}>Code</Text>
                    <Text style={styles.lwvColon}>:</Text>
                    <Text style={[styles.stateInlineText, styles.boldText]}>
                      {invoice.shippingDetails?.stateCode || ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.productTable}>
            {/* Header Row */}
            <View style={[styles.rowHeader, styles.headerRow]}>
              <View
                style={[
                  { fontWeight: "bold" },
                  styles.tableHeaderCellContainer,
                  styles.serialNo,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  S.NO
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.productName,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  DESCRIPTION OF GOODS
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.hsnCode,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  HSN CODE
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.uom,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  UOM
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.qty,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  QUANTITY
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.rate,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  RATE
                </Text>
              </View>
              <View
                style={[
                  { fontWeight: "bold" },

                  styles.tableHeaderCellContainer,
                  styles.total,
                ]}
              >
                <Text style={[styles.tableCellText, styles.textCenter]}>
                  AMOUNT
                </Text>
              </View>
            </View>
            {rows.map((item, index) => {
              const hasItem = !!item;
              const lineTotal = hasItem ? item.quantity * item.unitPrice : 0;
              return (
                <View
                  key={
                    (hasItem && (item.id || String(index))) || `empty-${index}`
                  }
                  style={styles.row}
                >
                  <View style={[styles.tableCellContainer, styles.serialNo]}>
                    <Text style={[styles.tableCellText, styles.textCenter]}>
                      {hasItem ? index + 1 : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.productName]}>
                    <Text style={[styles.tableCellText, styles.textLeft]}>
                      {hasItem ? item.description : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.hsnCode]}>
                    <Text style={[styles.tableCellText, styles.textCenter]}>
                      {hasItem ? item.hsnCode || "" : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.uom]}>
                    <Text style={[styles.tableCellText, styles.textCenter]}>
                      {hasItem ? item.uom || "" : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.qty]}>
                    <Text
                      style={[styles.tableCellText, styles.textRightPadded]}
                    >
                      {hasItem ? item.quantity : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.rate]}>
                    <Text
                      style={[styles.tableCellText, styles.textRightPadded]}
                    >
                      {hasItem ? formatCurrencyINR(item.unitPrice) : ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCellContainer, styles.total]}>
                    <Text
                      style={[styles.tableCellText, styles.textRightPadded]}
                    >
                      {hasItem ? formatCurrencyINR(lineTotal) : ""}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Amount */}
          <View style={styles.amountDetails}>
            {/* Tax Invoice Details */}
            <View style={styles.amountInWord}>
              <View style={styles.labelTotalAmountInWords}>
                <Text style={styles.amountWordsLabel}>
                  Total Amount in Words INR:
                </Text>
                <Text style={styles.amountWordsValue}>
                  {numberToWordsINR(total)}
                </Text>
              </View>
            </View>

            {/* Transport Invoice Details */}
            <View style={styles.amountTaxDetails}>
              <View style={styles.labelWithValue}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Total Amount before tax
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(subtotal)}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Add: CGST @ {invoice.cgstRate || 0}%
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(cgstAmount)}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Add: SGST @ {invoice.sgstRate || 0}%
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(sgstAmount)}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWithValue}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Add: IGST @ {invoice.igstRate || 0}%
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(igstAmount)}
                  </Text>
                </View>
              </View>
              <View style={[styles.labelWithValue, styles.taxDivider]}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Total Tax Amount
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(totalTax)}
                  </Text>
                </View>
              </View>
              <View style={[styles.labelWithValue, styles.taxDivider]}>
                <Text style={[styles.lwvLabel, styles.boldText]}>
                  Total Amount after Tax
                </Text>
                <View style={styles.lwvValueWrapper}>
                  <Text style={styles.lwvValueRight}>
                    {formatCurrencyINR(total)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom block kept together */}
          <View wrap={false} style={styles.bottomBlock}>
            {/* BANK DETAILS */}
            <View style={styles.bankDetails}>
              <View style={styles.bankDetailsInfo}>
                <Text style={styles.bankRowHeader}>OUR BANK DETAIL :</Text>

                <View style={styles.bankRow}>
                  <Text style={styles.bankLabel}>A/C NAME</Text>
                  <View style={[styles.bankValueWrapper, styles.boldText]}>
                    <Text style={styles.bankValue}>
                      PARAGON REFRACTORIES & MINERALS
                    </Text>
                  </View>
                </View>
                <View style={styles.bankRow}>
                  <Text style={styles.bankLabel}>A/C NO</Text>
                  <View style={styles.bankValueWrapper}>
                    <Text style={[styles.bankValue, styles.boldText]}>
                      758601010050048
                    </Text>
                  </View>
                </View>
                <View style={styles.bankRow}>
                  <Text style={styles.bankLabel}>BANK</Text>
                  <View style={styles.bankValueWrapper}>
                    <Text style={[styles.bankValue, styles.boldText]}>
                      UNION BANK OF INDIA
                    </Text>
                  </View>
                </View>
                <View style={styles.bankRow}>
                  <Text style={styles.bankLabel}>BRANCH / IFSC</Text>
                  <View style={styles.bankValueWrapper}>
                    <Text style={[styles.bankValue, styles.boldText]}>
                      CITY CENTRE , DURGAPUR / UBIN0815187
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Terms & Condition for Supply: */}
            <View style={styles.termConditionSupplyContainer}>
              <Text style={styles.termConditionSupplyTitle}>
                Terms & Condition for Supply:
              </Text>
              <Text style={styles.termConditionSupplyItem}>
                1. Goods once sold will not be taken back.
              </Text>
              <Text style={styles.termConditionSupplyItem}>
                2. Interest @<Text style={styles.boldText}>18%</Text> p.a. will
                be charged if the payment is not made within the stipulated
                time.
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              {/* Subject */}
              <View style={styles.footerSubject}>
                <Text style={styles.fSLabel}>
                  Subject to{" "}
                  <Text style={styles.boldText}>
                    {invoice.jurisdiction || ""}
                  </Text>{" "}
                  Jurisdiction
                </Text>
              </View>

              {/* Stamp */}
              <View style={styles.footerStamp}>
                {profile.companySeal ? (
                  <Image
                    src={profile.companySeal}
                    style={styles.fStampStampImg}
                  />
                ) : (
                  <View style={styles.fStampStampImg} />
                )}
                <Text style={styles.fStampLabel}>Common seal</Text>
              </View>

              {/* Signature */}
              <View style={styles.footerSignature}>
                <Text style={[styles.fSignLabel, styles.boldText]}>
                  For {profile.companyName}
                </Text>
                {profile.authorizedSignature ? (
                  <Image
                    src={profile.authorizedSignature}
                    style={styles.fSignPhoto}
                  />
                ) : (
                  <View style={styles.fSignPhoto} />
                )}
                <Text style={[styles.fSignLabelAuth, styles.boldText]}>
                  Authorised
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default DummyPDF;
