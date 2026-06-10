import moment from "moment";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import * as XLSX from "xlsx";
import { DATA_BELONGS_TO } from "../../constants";
import { getParentUserId } from "../../common_utilities";
import {
  fetchUserProfileDetails,
  getFamilyMember,
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getGoalDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/goal";
import { getLiabilityDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { getIncomeDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/income";
import { getExpenseDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/expense";
import { getOtherInvestments } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getInsuranceDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import {
  FetchRiskQuestionsUrl,
  FetchUserRiskAnswersUrl,
} from "../../FrappeIntegration-Services/services/financial-planning-api/yourprofileapi";

const NDA_LINK =
  "https://docs.google.com/document/d/1k-_aYgBXiKbKm4aC7W2iFYnfAdN1e1lC/edit";

const normalizeObjectData = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  }
  if (typeof value === "object") return value;
  return {};
};

const formatExportDate = (value) => {
  if (!value) return "";

  const parsed = moment(
    value,
    [
      "DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss.SSSSSS",
      moment.ISO_8601,
    ],
    true
  );

  if (parsed.isValid()) return parsed.format("DD MMM YYYY");
  const fallback = moment(new Date(value));
  return fallback.isValid() ? fallback.format("DD MMM YYYY") : "";
};

const parseFlexibleDate = (value) => {
  if (!value) return null;

  const parsed = moment(
    value,
    [
      "DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss.SSSSSS",
      moment.ISO_8601,
    ],
    true
  );

  if (parsed.isValid()) return parsed;

  const fallback = moment(new Date(value));
  return fallback.isValid() ? fallback : null;
};

const getAgeFromDate = (value) => {
  if (!value) return "";
  const parsed = moment(
    value,
    [
      "DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss.SSSSSS",
      moment.ISO_8601,
    ],
    true
  );
  return parsed.isValid() ? moment().diff(parsed, "years") : "";
};

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const text = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matchAny = (value, keywords = []) => {
  const normalized = text(value);
  return keywords.some((keyword) => normalized.includes(text(keyword)));
};

const blank = (count, styleId = "NB") =>
  Array.from({ length: count }, () => ({ value: "", styleId }));

const rowData = (cells) => cells;

const sheetNameSafe = (value) =>
  String(value || "Sheet")
    .replace(/[\[\]:*?/\\]/g, " ")
    .slice(0, 31);

const buildWorksheetModel = ({
  sheetName,
  columns = [],
  rows = [],
  defaultColumnWidth = 140,
}) => ({
  sheetName: sheetNameSafe(sheetName),
  columns: columns.length > 0 ? columns : [defaultColumnWidth],
  rows,
});

const STYLE_INDEX = {
  NB: 1,
  Title: 2,
  Blue: 3,
  Orange: 4,
  Calc: 5,
  Input: 6,
  Currency: 7,
  CurrencyCalc: 8,
  Percent: 9,
  Link: 10,
};

const XLSX_STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="2">
    <numFmt numFmtId="164" formatCode="&quot;₹&quot; #,##0"/>
    <numFmt numFmtId="165" formatCode="0%"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><sz val="14"/><b/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><sz val="11"/><b/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
    <font><sz val="11"/><u/><color rgb="FF0000FF"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF143F6B"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF68B1F"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD9E8EE"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="11">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
  <dxfs count="0"/>
  <tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4"/>
</styleSheet>`;

const applyCellStyleRef = (xml, cellRef, styleIndex) => {
  const cellPattern = new RegExp(`<c([^>]*) r="${cellRef}"([^>]*)>`, "g");
  return xml.replace(cellPattern, (match, before, after) => {
    const attrs = `${before}${after}`.replace(/\s+s="\d+"/, "");
    return `<c${attrs} r="${cellRef}" s="${styleIndex}">`;
  });
};

const buildWorkbookBuffer = async (sheetModels) => {
  const workbook = XLSX.utils.book_new();

  sheetModels.forEach((sheetModel) => {
    const worksheet = {};
    const merges = [];
    let maxCol = 0;

    sheetModel.rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      row.forEach((cell) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        const isNumber = cell.type === "Number" || typeof cell.value === "number";
        worksheet[cellRef] = {
          t: isNumber ? "n" : "s",
          v: isNumber ? safeNumber(cell.value) : String(cell.value ?? ""),
        };

        if (cell.href) {
          worksheet[cellRef].l = { Target: cell.href };
        }

        if (cell.mergeAcross) {
          merges.push({
            s: { r: rowIndex, c: colIndex },
            e: { r: rowIndex, c: colIndex + cell.mergeAcross },
          });
        }

        maxCol = Math.max(maxCol, colIndex + (cell.mergeAcross || 0));
        colIndex += (cell.mergeAcross || 0) + 1;
      });
    });

    worksheet["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(sheetModel.rows.length - 1, 0), c: Math.max(maxCol, 0) },
    });
    worksheet["!cols"] = sheetModel.columns.map((width) => ({
      wpx: safeNumber(width) || 140,
    }));
    worksheet["!merges"] = merges;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetModel.sheetName);
  });

  const baseBuffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
    compression: true,
  });

  const zipEntries = unzipSync(new Uint8Array(baseBuffer));
  zipEntries["xl/styles.xml"] = strToU8(XLSX_STYLES_XML);

  sheetModels.forEach((sheetModel, sheetIndex) => {
    const sheetPath = `xl/worksheets/sheet${sheetIndex + 1}.xml`;
    const file = zipEntries[sheetPath];
    if (!file) return;

    let xml = strFromU8(file);

    sheetModel.rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      row.forEach((cell) => {
        const styleIndex = STYLE_INDEX[cell.styleId] ?? STYLE_INDEX.Input;
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        xml = applyCellStyleRef(xml, cellRef, styleIndex);
        colIndex += (cell.mergeAcross || 0) + 1;
      });
    });

    zipEntries[sheetPath] = strToU8(xml);
  });

  return new Blob([zipSync(zipEntries)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

const formatPercentText = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return `${safeNumber(value)}%`;
};

const formatBooleanText = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const normalized = text(value);
  if (["1", "yes", "true", "y"].includes(normalized)) return "Yes";
  if (["0", "no", "false", "n"].includes(normalized)) return "No";
  return String(value);
};

const getDisplayName = (person = {}) =>
  person?.name ||
  person?.user_name ||
  person?.full_name ||
  [person?.first_name, person?.last_name].filter(Boolean).join(" ").trim() ||
  "";

const buildMemberNameResolver = (profile, familyMembers = []) => {
  const memberNameMap = new Map();

  const registerMember = (member) => {
    if (!member) return;

    const displayName = getDisplayName(member);
    if (!displayName) return;

    [
      member.user_id,
      member.id,
      member.value,
      member.fp_user_id,
      member.member_id,
      member.user_profile_id,
    ]
      .filter((identifier) => identifier !== undefined && identifier !== null && identifier !== "")
      .forEach((identifier) => {
        memberNameMap.set(String(identifier), displayName);
      });
  };

  registerMember(profile);
  familyMembers.forEach(registerMember);

  return (...values) => {
    const candidates = values.filter(
      (candidate) => candidate !== undefined && candidate !== null && candidate !== ""
    );

    for (const candidate of candidates) {
      const mappedName = memberNameMap.get(String(candidate));
      if (mappedName) return mappedName;
    }

    for (const candidate of candidates) {
      if (typeof candidate === "string" && /[a-zA-Z]/.test(candidate)) return candidate;
    }

    return candidates[0] || "";
  };
};

const buildDetailSheetModel = ({
  sheetName,
  title,
  headers,
  dataRows,
  widths,
}) => {
  const rows = [];
  rows.push(
    rowData([
      {
        value: title || sheetName,
        styleId: "Blue",
        mergeAcross: Math.max(headers.length - 1, 0),
      },
    ])
  );
  rows.push(
    rowData(
      headers.map((header) => ({
        value: header,
        styleId: "Orange",
      }))
    )
  );

  dataRows.forEach((dataRow) => {
    rows.push(
      rowData(
        dataRow.map((value) => {
          if (typeof value === "number" && Number.isFinite(value)) {
            return {
              value,
              styleId: "Input",
              type: "Number",
            };
          }
          return {
            value: value ?? "",
            styleId: "Input",
          };
        })
      )
    );
  });

  if (!dataRows.length) {
    rows.push(
      rowData([
        {
          value: "No data available",
          styleId: "Input",
          mergeAcross: Math.max(headers.length - 1, 0),
        },
      ])
    );
  }

  return buildWorksheetModel({
    sheetName,
    columns: widths,
    rows,
  });
};

const totalPair = (items) =>
  items.reduce(
    (acc, item) => ({
      self: acc.self + safeNumber(item.self),
      spouse: acc.spouse + safeNumber(item.spouse),
    }),
    { self: 0, spouse: 0 }
  );

const splitByOwner = (rows, matchFn, amountFn, ownerFn, spouseIdentifiers = []) =>
  rows.reduce(
    (acc, row) => {
      if (!matchFn(row)) return acc;
      const owner = text(ownerFn(row));
      const ownerRaw = ownerFn(row);
      const amount = safeNumber(amountFn(row));
      const isSpouse =
        spouseIdentifiers.includes(String(ownerRaw)) ||
        owner.includes("spouse") ||
        owner.includes("wife") ||
        owner.includes("husband");

      if (isSpouse) {
        acc.spouse += amount;
      } else {
        acc.self += amount;
      }
      return acc;
    },
    { self: 0, spouse: 0 }
  );

const allocateExpensesBySection = (expenses, spouseIdentifiers = []) => {
  const sections = {
    mandatory: [
      {
        label: " Household/Grocery/Utility",
        matchers: [["household expenses"], ["grocery", "utility", "household"]],
      },
      {
        label: "Rental Paid",
        matchers: [["house rent"], ["rent"]],
      },
      {
        label: "Education - Kid 1",
        matchers: [["education"], ["education", "kid 1"]],
      },
      {
        label: "Education - Kid 2",
        matchers: [["education"], ["education", "kid 2"]],
      },
      {
        label: "Daily Travel",
        matchers: [["travel"], ["travel", "commute"]],
      },
      {
        label: "Home Loan 1 EMI",
        matchers: [[], ["home loan 1"]],
      },
      {
        label: "Home Loan 2 EMI",
        matchers: [[], ["home loan 2"]],
      },
      {
        label: "Car Loan EMI",
        matchers: [[], ["car loan"]],
      },
      {
        label: "Personal Loan EMI",
        matchers: [[], ["personal loan"]],
      },
      {
        label: "Other Loan EMI",
        matchers: [[], ["loan"]],
      },
      {
        label: "Medicines & Checkup",
        matchers: [["medical"], ["medicine", "checkup", "medical", "therapy"]],
      },
      {
        label: "Miscelleaneous",
        matchers: [["other expenses"], ["misc", "other"]],
      },
      {
        label: "Other Mandatory Expenses",
        matchers: [],
      },
    ],
    wishful: [
      {
        label: "Gifts / Events / Celebrations",
        matchers: [["gifts and donations"], ["gift", "event", "celebration"]],
      },
      {
        label: "Life Style / Shopping / Dining",
        matchers: [["other expenses"], ["shopping", "dining", "lifestyle"]],
      },
      {
        label: "Kid's Lifestyle / Classes",
        matchers: [["education"], ["class", "kid lifestyle"]],
      },
      {
        label: "Charity / Donation",
        matchers: [["gifts and donations"], ["charity", "donation"]],
      },
      {
        label: "Club Membership / Subscriptions",
        matchers: [["club membership and subscriptions"], ["club", "subscription", "gym"]],
      },
      {
        label: "Vacation / Stay / Travel",
        matchers: [["vacation", "hotel leisure and entertainment"], ["vacation", "holiday", "travel", "hotel", "leisure", "entertainment"]],
      },
      {
        label: "Other Wishful Expenses",
        matchers: [],
      },
    ],
  };

  const totals = Object.fromEntries(
    Object.entries(sections).map(([sectionName, rows]) => [
      sectionName,
      rows.map((row) => ({ label: row.label, self: 0, spouse: 0 })),
    ])
  );

  const dynamicExpenseRows = {
    mandatory: [],
    wishful: [],
  };

  const addDynamicExpenseRow = (sectionName, label, amount, isSpouse) => {
    const normalizedLabel = String(label || "").trim() || "Other Expense";
    const existingRow = dynamicExpenseRows[sectionName].find(
      (row) => text(row.label) === text(normalizedLabel)
    );

    if (existingRow) {
      if (isSpouse) {
        existingRow.spouse += amount;
      } else {
        existingRow.self += amount;
      }
      return;
    }

    dynamicExpenseRows[sectionName].push({
      label: normalizedLabel,
      self: isSpouse ? 0 : amount,
      spouse: isSpouse ? amount : 0,
    });
  };

  expenses.forEach((expense) => {
    const sectionName =
      text(expense.user_expense_category) === "mandatory" ? "mandatory" : "wishful";
    const definitions = sections[sectionName];
    const categoryText = expense.expense_category_type || "";
    const expenseName = String(expense.user_expense_name || "").trim();
    const detailText = `${expenseName} ${expense.user_expense_type || ""}`;

    const ownerRaw = expense.user_expense_for;
    const owner = text(ownerRaw);
    const amount = safeNumber(expense.user_expense_amount);
    const isSpouse =
      spouseIdentifiers.includes(String(ownerRaw)) ||
      owner.includes("spouse") ||
      owner.includes("wife") ||
      owner.includes("husband");

    if (matchAny(categoryText, ["other expenses"])) {
      addDynamicExpenseRow(
        sectionName,
        expenseName || categoryText || `Other ${sectionName} expense`,
        amount,
        isSpouse
      );
      return;
    }

    let targetIndex = definitions.findIndex(({ matchers }) => {
      if (!matchers.length) return false;
      const [categoryKeywords = [], detailKeywords = []] = matchers;
      const categoryMatched = categoryKeywords.length
        ? matchAny(categoryText, categoryKeywords)
        : false;
      const detailMatched = detailKeywords.length ? matchAny(detailText, detailKeywords) : false;
      return categoryMatched || detailMatched;
    });

    if (targetIndex < 0) {
      addDynamicExpenseRow(
        sectionName,
        expenseName || categoryText || `Other ${sectionName} expense`,
        amount,
        isSpouse
      );
      return;
    }

    if (isSpouse) {
      totals[sectionName][targetIndex].spouse += amount;
    } else {
      totals[sectionName][targetIndex].self += amount;
    }
  });

  return {
    mandatory: [...totals.mandatory, ...dynamicExpenseRows.mandatory],
    wishful: [...totals.wishful, ...dynamicExpenseRows.wishful],
  };
};

const getGoalDisplayFrequency = (goal) => {
  if (goal.user_goal_freq) return goal.user_goal_freq;
  if (goal.user_goal_occurance) return goal.user_goal_occurance;
  return "";
};

const getGoalDisplayPriority = (goal) => {
  const priority = goal.user_goal_priority || "";
  const type = goal.user_goal_type || "";
  if (priority && type) return `${priority} / ${type === "Critical" ? "Critical" : "Non Critical"}`;
  if (priority) return priority;
  if (type) return type === "Critical" ? "Critical" : "Non Critical";
  return "";
};

const splitItemsByOwner = (items, amountFn, ownerFn, matchFn, spouseIdentifiers = []) =>
  items.reduce(
    (acc, item) => {
      const match = matchFn(item);
      if (!match) return acc;

      const ownerRaw = ownerFn(item);
      const owner = text(ownerRaw);
      const amount = safeNumber(amountFn(item));
      const isSpouse =
        spouseIdentifiers.includes(String(ownerRaw)) ||
        owner.includes("spouse") ||
        owner.includes("wife") ||
        owner.includes("husband");

      if (isSpouse) {
        acc.spouse += amount;
      } else {
        acc.self += amount;
      }

      return acc;
    },
    { self: 0, spouse: 0 }
  );

const buildDataSheetModel = ({
  profile,
  familyMembers,
  incomes,
  expenses,
  liabilities,
  assets,
  insurances,
  goals,
  riskQuestions,
  riskAnswers,
}) => {
  const resolveMemberName = buildMemberNameResolver(profile, familyMembers);
  const spouse = familyMembers.find((member) =>
    matchAny(member.relation, ["spouse", "wife", "husband"])
  );
  const spouseIdentifiers = [
    spouse?.user_id,
    spouse?.id,
    spouse?.value,
    spouse?.fp_user_id,
    spouse?.member_id,
    spouse?.user_profile_id,
  ]
    .filter((identifier) => identifier !== undefined && identifier !== null && identifier !== "")
    .map(String);
  const dependents = familyMembers
    .filter((member) => member !== spouse)
    .slice(0, 4);

  const currentYearEnding = moment().month() >= 3 ? moment().year() + 1 : moment().year();
  const currentMonthLabel = moment().format("MMMM");
  const monthRemain = 12 - moment().month() - 1;
  const selfAge = profile.user_age || getAgeFromDate(profile.user_dob) || "";
  const spouseAge = spouse?.user_age || getAgeFromDate(spouse?.dob) || "";
  const selfRetirementAge = safeNumber(profile.user_retirement_age);
  const spouseRetirementAge = safeNumber(spouse?.retirement_age);

  const classifyIncomeRow = (row) => {
    const categoryText = text(row.income_category_type);
    const nameText = text(row.user_income_name);
    const combinedText = `${categoryText} ${nameText}`.trim();
    const frequencyText = text(row.user_income_freq);

    if (
      (combinedText.includes("bonus") && !frequencyText.includes("month")) ||
      frequencyText.includes("year")
    ) {
      return "bonus";
    }

    if (
      frequencyText.includes("month") &&
      (combinedText.includes("salary") || combinedText.includes("wage"))
    ) {
      return "monthly";
    }

    if (combinedText.includes("rental")) return "rental";
    if (combinedText.includes("business")) return "business";
    if (combinedText.includes("interest")) return "interest";
    if (combinedText.includes("pension")) return "pension";
    if (combinedText.includes("other")) return "other";

    return frequencyText.includes("month") ? "monthly" : "other";
  };

  const incomeSplit = (targetType) =>
    splitItemsByOwner(
      incomes,
      (row) => row.user_income_amount,
      (row) => row.user_income_for,
      (row) => classifyIncomeRow(row) === targetType,
      spouseIdentifiers
    );

  const assetSplit = (keywords) =>
    splitByOwner(
      assets,
      (row) =>
        matchAny(
          `${row.asset_category_type || ""} ${row.asset_sub_category_type || ""} ${row.user_asset_name || ""}`,
          keywords
        ),
      (row) => row.user_asset_current_amount || row.user_asset_investment_amount,
      (row) => row.user_asset_for,
      spouseIdentifiers
    );

  const assetMatches = (row, keywords = []) =>
    matchAny(
      `${row.asset_category_type || ""} ${row.asset_sub_category_type || ""} ${row.asset_type_name || ""} ${row.asset_type_name_uuid || ""} ${row.user_asset_name || ""}`,
      keywords
    );

  const assetSplitCustom = (matchFn) =>
    splitItemsByOwner(
      assets,
      (row) => row.user_asset_current_amount || row.user_asset_investment_amount,
      (row) => row.user_asset_for,
      matchFn,
      spouseIdentifiers
    );

  const assetSplitAmountCustom = (amountFn, matchFn) =>
    splitItemsByOwner(
      assets,
      amountFn,
      (row) => row.user_asset_for,
      matchFn,
      spouseIdentifiers
    );

  const isRecurringAssetContribution = (row) =>
    text(row.user_asset_occurance).includes("recurring") ||
    text(row.user_asset_freq).includes("month") ||
    safeNumber(row.user_asset_sip_amount) > 0;

  const isSavingsOrCashAsset = (row) =>
    assetMatches(row, [
      "saving account",
      "savings account",
      "saving_account",
      "cash",
    ]);

  const isLiquidMutualFundAsset = (row) =>
    !isSavingsOrCashAsset(row) &&
    assetMatches(row, ["liquid fund", "money market", "arbitrage", "liquid", "cash management"]);

  const insuranceSplit = (keywords) =>
    splitByOwner(
      insurances,
      (row) =>
        matchAny(
          `${row.insurance_category_type || ""} ${row.insurance_type || ""} ${row.user_insurance_name || ""}`,
          keywords
        ),
      (row) => row.user_insurance_premium_amount || row.user_insurance_premium,
      (row) => row.user_insurance_for || row.insurance_for_name,
      spouseIdentifiers
    );

  const monthlyIncomeRows = [
    [" Monthly Income (NET of Tax & any Contribution)", incomeSplit("monthly")],
    ["Bonus (Yearly Net of Tax))", incomeSplit("bonus")],
    ["Rental Income", incomeSplit("rental")],
    ["Business Income", incomeSplit("business")],
    ["Interest Income", incomeSplit("interest")],
    ["Pension Income", incomeSplit("pension")],
    ["Other Income", incomeSplit("other")],
  ].map(([label, value]) => ({ label, ...value }));

  const allocatedExpenses = allocateExpensesBySection(expenses, spouseIdentifiers);
  const mandatoryExpenseRows = allocatedExpenses.mandatory;
  const wishfulExpenseRows = allocatedExpenses.wishful;

  const contributionRows = [
    ["Health Insurance", insuranceSplit(["health"])],
    ["Life Insurance", insuranceSplit(["life", "term"])],
    ["Other Insurance", insuranceSplit(["insurance"])],
    [
      "PPF",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["ppf"]) && isRecurringAssetContribution(row)
      ),
    ],
    [
      "NPS",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["nps"]) && isRecurringAssetContribution(row)
      ),
    ],
    [
      "SSY",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["ssy", "sukanya"]) && isRecurringAssetContribution(row)
      ),
    ],
    [
      "SIP - Debt",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["debt mutual fund", "debt mf"]) && isRecurringAssetContribution(row)
      ),
    ],
    [
      "SIP - Equity",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["equity mutual fund", "equity mf"]) && isRecurringAssetContribution(row)
      ),
    ],
    [
      "SIP - Commodity",
      assetSplitAmountCustom(
        (row) => row.user_asset_sip_amount,
        (row) => assetMatches(row, ["commodity", "gold", "sgb"]) && isRecurringAssetContribution(row)
      ),
    ],
  ].map(([label, value]) => ({ label, ...value }));

  const liquidAssets = [
    [
      "Savings Bank / Cash",
      assetSplitCustom(
        (row) => isSavingsOrCashAsset(row)
      ),
    ],
    ["Other / Receivables", assetSplit(["receivable", "other"])],
    [
      "Mutual Fund - Liquid / Arbitrage",
      assetSplitCustom((row) => isLiquidMutualFundAsset(row)),
    ],
  ].map(([label, value]) => ({ label, ...value }));

  const debtAssets = [
    ["Debt Mutual Funds", assetSplit(["debt mutual fund", "debt mf"])],
    ["NSC", assetSplit(["nsc"])],
    ["PPF", assetSplit(["ppf"])],
    ["Sukanya Samriddhi Yojana", assetSplit(["ssy", "sukanya"])],
    ["Post Office Schemes", assetSplit(["post office"])],
    ["Other Govt Scheme", assetSplit(["government scheme", "govt scheme"])],
    ["EPF", assetSplit(["epf"])],
    [
      "EPF Contribution Monthly",
      assetSplitAmountCustom(
        (row) => safeNumber(row.user_asset_epf_employee) + safeNumber(row.user_asset_epf_employer),
        (row) => assetMatches(row, ["epf"])
      ),
    ],
    ["NPS", assetSplit(["nps"])],
    ["Fixed Deposit", assetSplit(["fixed deposit", "fd"])],
    ["Recurring Deposit", assetSplit(["recurring deposit", "rd"])],
    ["Debentures", assetSplit(["debenture"])],
    ["Public Bonds", assetSplit(["public bond"])],
    ["Private Bonds", assetSplit(["private bond"])],
    ["Pension Schemes", assetSplit(["pension scheme"])],
    ["Gratuity", assetSplit(["gratuity"])],
    [
      "Other Debt",
      assetSplitCustom((row) => {
        const assetText = text(
          `${row.asset_category_type || ""} ${row.asset_sub_category_type || ""} ${row.user_asset_name || ""}`
        );
        const includedDebtMatchers = [
          "debt mutual fund",
          "debt mf",
          "nsc",
          "ppf",
          "sukanya",
          "ssy",
          "post office",
          "government scheme",
          "govt scheme",
          "epf",
          "nps",
          "fixed deposit",
          "fd",
          "recurring deposit",
          "rd",
          "debenture",
          "public bond",
          "private bond",
          "pension scheme",
          "gratuity",
          "saving account",
          "savings account",
          "saving",
          "cash",
          "liquid",
        ];

        if (!assetText.includes("debt")) return false;
        return !includedDebtMatchers.some((keyword) => assetText.includes(text(keyword)));
      }),
    ],
  ].map(([label, value]) => ({ label, ...value }));

  const equityAssets = [
    ["Equity MF", assetSplit(["equity mf"])],
    ["Stocks", assetSplit(["stock", "share"])],
    ["Futures & Options", assetSplit(["future", "option"])],
    ["PMS", assetSplit(["pms"])],
    ["Global", assetSplit(["global"])],
    ["NPS - Equity", assetSplit(["nps equity"])],
    ["Vested ESOPs", assetSplit(["esop"])],
  ].map(([label, value]) => ({ label, ...value }));

  const liabilityRows = liabilities.map((item) => {
    const endDate = parseFlexibleDate(item.user_liability_end_date);
    const monthsRemaining = endDate ? Math.max(endDate.diff(moment(), "months"), 0) : "";
    const yearsRemaining =
      typeof monthsRemaining === "number" ? Number((monthsRemaining / 12).toFixed(1)) : "";

    return {
      category: item.liability_category_type || "",
      subCategory: item.liability_sub_category_type || "",
      name: item.user_liability_name || "Liability",
      principal: safeNumber(item.user_liability_outstanding_amount),
      rate: safeNumber(item.user_liability_emi_rate) / 100,
      year: endDate ? endDate.year() : "",
      endDate: formatExportDate(item.user_liability_end_date),
      monthsRemaining,
      yearsRemaining,
      emi: safeNumber(item.user_liability_emi_amount),
    };
  });

  const totalIncome = totalPair(monthlyIncomeRows);
  const totalMandatory = totalPair(mandatoryExpenseRows);
  const totalWishful = totalPair(wishfulExpenseRows);
  const totalContribution = totalPair(contributionRows);
  const totalLiquid = totalPair(liquidAssets);
  const totalDebt = totalPair(debtAssets);
  const totalEquity = totalPair(equityAssets);
  const totalLiabilities = liabilityRows.reduce((sum, row) => sum + row.principal, 0);
  const totalFamilyIncome = totalIncome.self + totalIncome.spouse;
  const totalFamilyMandatory = totalMandatory.self + totalMandatory.spouse;
  const totalFamilyWishful = totalWishful.self + totalWishful.spouse;
  const totalFamilyContribution = totalContribution.self + totalContribution.spouse;
  const totalMonthlyExpenses = totalFamilyMandatory + totalFamilyWishful;
  const monthlyGrossSurplus = totalFamilyIncome - totalMonthlyExpenses;
  const monthlyNetSurplus = monthlyGrossSurplus - totalFamilyContribution;
  const totalAssetsIndividual = {
    self: totalLiquid.self + totalDebt.self + totalEquity.self,
    spouse: totalLiquid.spouse + totalDebt.spouse + totalEquity.spouse,
  };
  const totalAssetsFamily = totalAssetsIndividual.self + totalAssetsIndividual.spouse;

  const riskAnswersMap = new Map(
    riskAnswers.map((answer) => [String(answer.risk_question_id), answer])
  );

  const rows = [];
  const add = (cells) => rows.push(rowData(cells));

  add([{ value: "" }, { value: "*Please do not make changes to the coloured cells*", styleId: "Title", mergeAcross: 4 }, ...blank(4)]);
  add(blank(10));
  add([{ value: "" }, { value: "" }, { value: "Auto Calculated", styleId: "Blue" }, { value: "Not To Fill Ths Column / Row", styleId: "Blue" }, ...blank(6)]);
  add([{ value: "" }, { value: "" }, { value: "Manual Work", styleId: "Orange" }, { value: "To Fill This Column / Row", styleId: "Orange" }, ...blank(6)]);
  add(blank(10));

  add([
    { value: "Personal Details", styleId: "Blue" },
    { value: "Self", styleId: "Orange" },
    { value: "Spouse", styleId: "Orange" },
    { value: "", styleId: "NB" },
    { value: "Family Composition", styleId: "Blue", mergeAcross: 3 },
    ...blank(2),
  ]);

  [
    ["Current Financial Year Ending", currentYearEnding, currentYearEnding],
    [
      "Client Name",
      resolveMemberName(profile.user_id, profile.user_name, profile.name, profile.full_name),
      resolveMemberName(spouse?.user_id, spouse?.user_name, spouse?.name, spouse?.full_name),
    ],
    ["DOB", formatExportDate(profile.user_dob), formatExportDate(spouse?.dob)],
    ["Current Age", selfAge, spouseAge],
    ["Address", profile.address || "", ""],
    ["Profession & Company", profile.user_occupation || "", spouse?.occupation || ""],
    ["Risk Appettite", profile.risk_appetite || "", ""],
    ["Retirement Age", selfRetirementAge, spouseRetirementAge],
    [
      "Years To Retirement",
      Math.max(selfRetirementAge - safeNumber(selfAge), 0),
      Math.max(spouseRetirementAge - safeNumber(spouseAge), 0),
    ],
    [
      "Retirement Year",
      currentYearEnding + Math.max(selfRetirementAge - safeNumber(selfAge), 0),
      currentYearEnding + Math.max(spouseRetirementAge - safeNumber(spouseAge), 0),
    ],
    ["Life Expectancy Age", safeNumber(profile.user_life_expectancy), safeNumber(spouse?.life_expectancy_age)],
    [
      "Post Retirement Years",
      Math.max(safeNumber(profile.user_life_expectancy) - selfRetirementAge, 0),
      Math.max(safeNumber(spouse?.life_expectancy_age) - spouseRetirementAge, 0),
    ],
  ].forEach((entry, index) => {
    const dep = dependents[index] || {};
    add([
      {
        value: entry[0],
        styleId: ["Years To Retirement", "Retirement Year", "Post Retirement Years"].includes(entry[0])
          ? "Blue"
          : "Orange",
      },
      { value: entry[1], styleId: typeof entry[1] === "number" ? "Calc" : "Input", type: typeof entry[1] === "number" ? "Number" : "String" },
      { value: entry[2], styleId: typeof entry[2] === "number" ? "Calc" : "Input", type: typeof entry[2] === "number" ? "Number" : "String" },
      { value: "", styleId: "NB" },
      {
        value:
          index === 0
            ? "Name of Dependent"
            : resolveMemberName(dep.user_id, dep.user_name, dep.name, dep.full_name),
        styleId: index === 0 ? "Orange" : "Input",
      },
      { value: index === 0 ? "Relation" : dep.relation || "", styleId: index === 0 ? "Orange" : "Input" },
      { value: index === 0 ? "DOB" : formatExportDate(dep.dob), styleId: index === 0 ? "Orange" : "Input" },
      { value: index === 0 ? "Age" : dep.user_age || getAgeFromDate(dep.dob), styleId: index === 0 ? "Orange" : "Input" },
      { value: index === 6 ? "NDA LINK" : "", styleId: "NB" },
      { value: index === 7 ? NDA_LINK : "", styleId: index === 7 ? "Link" : "NB", href: index === 7 ? NDA_LINK : undefined },
    ]);
  });

  add(blank(10));
  add([{ value: "Family Cashflow", styleId: "Blue", mergeAcross: 2 }, ...blank(7)]);
  add([{ value: "Monthly Income", styleId: "Blue" }, { value: "Self", styleId: "Orange" }, { value: "Spouse", styleId: "Orange" }, ...blank(7)]);
  monthlyIncomeRows.forEach((row, idx) =>
    add([
      { value: idx === 2 ? "Other Monthly Income" : row.label, styleId: idx === 2 ? "Blue" : "Orange" },
      { value: row.self, styleId: "Currency", type: "Number" },
      { value: row.spouse, styleId: "Currency", type: "Number" },
      ...blank(7),
    ])
  );
  add([{ value: "Total Monthly Income (ex. bonus)", styleId: "Calc" }, { value: totalIncome.self, styleId: "CurrencyCalc", type: "Number" }, { value: totalIncome.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
  add([{ value: "Salary Increment", styleId: "Orange" }, { value: 0, styleId: "Percent", type: "Number" }, { value: 0, styleId: "Percent", type: "Number" }, ...blank(7)]);
  add([{ value: "Total Family Monthly Income", styleId: "Calc" }, { value: totalFamilyIncome, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);

  add(blank(10));
  add([{ value: "Monthly Mandatory Expenses", styleId: "Blue", mergeAcross: 2 }, ...blank(7)]);
  add([{ value: "Category", styleId: "Blue" }, { value: "Self", styleId: "Orange" }, { value: "Spouse", styleId: "Orange" }, ...blank(7)]);
  mandatoryExpenseRows.forEach((row) =>
    add([
      { value: row.label, styleId: "Orange" },
      { value: row.self, styleId: "Currency", type: "Number" },
      { value: row.spouse, styleId: "Currency", type: "Number" },
      ...blank(7),
    ])
  );
  add([{ value: "Total Monthly Individual Expenses", styleId: "Calc" }, { value: totalMandatory.self, styleId: "CurrencyCalc", type: "Number" }, { value: totalMandatory.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
  add([{ value: "Total Monthly Family Expenses", styleId: "Calc" }, { value: totalFamilyMandatory, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);

  add(blank(10));
  add([{ value: "Monthly Wishful Expenses", styleId: "Blue", mergeAcross: 2 }, ...blank(7)]);
  wishfulExpenseRows.forEach((row) =>
    add([
      { value: row.label, styleId: "Orange" },
      { value: row.self, styleId: "Currency", type: "Number" },
      { value: row.spouse, styleId: "Currency", type: "Number" },
      ...blank(7),
    ])
  );
  add([{ value: "Total Monthly Individual Expenses", styleId: "Calc" }, { value: totalWishful.self, styleId: "CurrencyCalc", type: "Number" }, { value: totalWishful.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
  add([{ value: "Total Monthly Family Expenses", styleId: "Calc" }, { value: totalFamilyWishful, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);
  add(blank(10));
  add([{ value: "Total Monthly Expenses (M + W)", styleId: "Calc" }, { value: totalMonthlyExpenses, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);
  add(blank(10));
  add([{ value: "Monthly Gross Surplus", styleId: "Calc" }, { value: monthlyGrossSurplus, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);
  add(blank(10));

  add([{ value: "Monthly Contributions", styleId: "Blue" }, { value: "Self", styleId: "Orange" }, { value: "Spouse", styleId: "Orange" }, ...blank(7)]);
  contributionRows.forEach((row) =>
    add([
      { value: row.label, styleId: "Orange" },
      { value: row.self, styleId: "Currency", type: "Number" },
      { value: row.spouse, styleId: "Currency", type: "Number" },
      ...blank(7),
    ])
  );
  add([{ value: "Total Monthly Individual Contributions", styleId: "Calc" }, { value: totalContribution.self, styleId: "CurrencyCalc", type: "Number" }, { value: totalContribution.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
  add([{ value: "Total Monthly Family Contributions", styleId: "Calc" }, { value: totalFamilyContribution, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);
  add(blank(10));
  add([{ value: "Monthly Net Surplus", styleId: "Calc" }, { value: monthlyNetSurplus, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);

  add(blank(10));
  add([{ value: "Financial Goals", styleId: "Blue", mergeAcross: 7 }, ...blank(2)]);
  add([{ value: "One Time Goal", styleId: "Blue", mergeAcross: 7 }, ...blank(2)]);
  add([
    { value: "Financial Year Ending", styleId: "Orange" },
    { value: "Goals", styleId: "Orange" },
    { value: "No Of Years To Goal", styleId: "Blue" },
    { value: "Current Value", styleId: "Orange" },
    { value: "Inflation", styleId: "Orange" },
    { value: "Goal Amount", styleId: "Blue" },
    { value: "Critical / Non Critical", styleId: "Orange" },
    { value: "Frequency (yrs)", styleId: "Orange" },
  ]);
  goals.slice(0, 15).forEach((goal) => {
    const goalDate =
      parseFlexibleDate(goal.user_goal_end_date) ||
      parseFlexibleDate(goal.user_goal_start_date);
    const goalYear = goalDate ? goalDate.year() : currentYearEnding;
    const yearsToGoal = goalDate
      ? Math.max(goalDate.diff(moment(), "years", true), 0)
      : "";
    add([
      { value: goalYear, styleId: "Input", type: "Number" },
      { value: goal.user_goal_name || "", styleId: "Input" },
      {
        value: yearsToGoal === "" ? "" : Number(yearsToGoal.toFixed(1)),
        styleId: "Input",
        type: yearsToGoal === "" ? "String" : "Number",
      },
      { value: safeNumber(goal.user_goal_amount), styleId: "Currency", type: "Number" },
      { value: safeNumber(goal.user_goal_growth_rate) / 100, styleId: "Percent", type: "Number" },
      { value: safeNumber(goal.user_goal_amount), styleId: "Currency", type: "Number" },
      { value: getGoalDisplayPriority(goal), styleId: "Input" },
      { value: getGoalDisplayFrequency(goal), styleId: "Input" },
    ]);
  });

  add(blank(10));
  add([{ value: "Financial Assets & Liabilities", styleId: "Blue", mergeAcross: 7 }, ...blank(2)]);

  const addAssetSection = (title, sectionRows, total) => {
    add([{ value: title, styleId: "Blue" }, { value: "Self", styleId: "Orange" }, { value: "Spouse", styleId: "Orange" }, ...blank(7)]);
    sectionRows.forEach((row) =>
      add([
        { value: row.label, styleId: "Orange" },
        { value: row.self, styleId: "Currency", type: "Number" },
        { value: row.spouse, styleId: "Currency", type: "Number" },
        ...blank(7),
      ])
    );
    add([{ value: `Total ${title}`, styleId: "Calc" }, { value: total.self, styleId: "CurrencyCalc", type: "Number" }, { value: total.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
    add(blank(10));
  };

  addAssetSection("Liquid Assets", liquidAssets, totalLiquid);
  addAssetSection("Debt Assets", debtAssets, totalDebt);
  addAssetSection("Equity Assets", equityAssets, totalEquity);

  add([
    { value: "Category", styleId: "Orange" },
    { value: "Sub Category", styleId: "Orange" },
    { value: "Liability Name", styleId: "Orange" },
    { value: "Principal Outstanding", styleId: "Orange" },
    { value: "Interest Rate P.A.", styleId: "Orange" },
    { value: "Ending Date", styleId: "Orange" },
    { value: "FY End Year", styleId: "Blue" },
    { value: "Months Remaining", styleId: "Blue" },
    { value: "Years Remaining", styleId: "Blue" },
    { value: "EMI", styleId: "Blue" },
  ]);
  liabilityRows.forEach((row) =>
    add([
      { value: row.category, styleId: "Input" },
      { value: row.subCategory, styleId: "Input" },
      { value: row.name, styleId: "Input" },
      { value: row.principal, styleId: "Currency", type: "Number" },
      { value: row.rate, styleId: "Percent", type: "Number" },
      { value: row.endDate, styleId: "Input" },
      { value: row.year, styleId: "Input", type: row.year ? "Number" : "String" },
      {
        value: row.monthsRemaining,
        styleId: "Input",
        type: typeof row.monthsRemaining === "number" ? "Number" : "String",
      },
      {
        value: row.yearsRemaining,
        styleId: "Input",
        type: typeof row.yearsRemaining === "number" ? "Number" : "String",
      },
      { value: row.emi, styleId: "Currency", type: "Number" },
    ])
  );
  add([
    { value: "Total Liabilities", styleId: "Calc", mergeAcross: 2 },
    { value: totalLiabilities, styleId: "CurrencyCalc", type: "Number" },
    ...blank(6),
  ]);
  add(blank(10));
  add([{ value: "Total Assets Individual", styleId: "Calc" }, { value: totalAssetsIndividual.self, styleId: "CurrencyCalc", type: "Number" }, { value: totalAssetsIndividual.spouse, styleId: "CurrencyCalc", type: "Number" }, ...blank(7)]);
  add([{ value: "Total Assets Family", styleId: "Calc" }, { value: totalAssetsFamily, styleId: "CurrencyCalc", type: "Number", mergeAcross: 1 }, ...blank(7)]);
  add([{ value: "Networth", styleId: "Blue" }, { value: totalAssetsFamily - totalLiabilities, styleId: "Blue", type: "Number" }, ...blank(8)]);

  add(blank(10));
  add([
    { value: "Financial Year Ending", styleId: "Orange" },
    { value: "Current Month", styleId: "Orange" },
    { value: "Inflow Month Remain", styleId: "Orange" },
    { value: "Outflow Month Remain", styleId: "Orange" },
    ...blank(6),
  ]);
  add([
    { value: `March ${currentYearEnding}`, styleId: "Input" },
    { value: currentMonthLabel, styleId: "Input" },
    { value: monthRemain, styleId: "Input", type: "Number" },
    { value: monthRemain, styleId: "Input", type: "Number" },
    ...blank(6),
  ]);

  add(blank(10));
  add([{ value: "Risk Questionnaire", styleId: "Blue", mergeAcross: 6 }, { value: "Answer", styleId: "Orange", mergeAcross: 2 }, { value: "", styleId: "NB" }]);
  riskQuestions.slice(0, 6).forEach((question, index) => {
    const answer = riskAnswersMap.get(String(question.risk_question_id));
    const selectedOption = question.options?.find(
      (option) => String(option.risk_option_points) === String(answer?.risk_option_id)
    );
    add([
      { value: `Question ${index + 1}`, styleId: "Input" },
      { value: question.risk_question_text || "", styleId: "Input", mergeAcross: 5 },
      { value: selectedOption?.risk_option_text || "", styleId: "Input", mergeAcross: 2 },
      { value: "", styleId: "NB" },
    ]);
  });

  return buildWorksheetModel({
    sheetName: "Data Sheet",
    columns: [190, 95, 95, 95, 120, 120, 120, 120, 120, 80],
    rows,
  });
};

const buildProfileSheetModel = ({ profile, familyMembers }) => {
  const resolveMemberName = buildMemberNameResolver(profile, familyMembers);
  const spouse = familyMembers.find((member) =>
    matchAny(member.relation, ["spouse", "wife", "husband"])
  );
  const dependents = familyMembers.filter((member) => member !== spouse);

  return buildDetailSheetModel({
    sheetName: "Profile Details",
    title: "Profile And Family Details",
    headers: [
      "Section",
      "Name",
      "Relation",
      "DOB",
      "Age",
      "Gender",
      "Profession / Company",
      "Retirement Age",
      "Life Expectancy Age",
      "Risk Appetite",
      "Address",
      "Remarks",
    ],
    widths: [120, 160, 120, 100, 70, 90, 180, 100, 120, 110, 220, 180],
    dataRows: [
      [
        "Primary",
        resolveMemberName(profile.user_id, profile.user_name, profile.name, profile.full_name),
        "Self",
        formatExportDate(profile.user_dob),
        profile.user_age || getAgeFromDate(profile.user_dob),
        profile.user_gender || "",
        profile.user_occupation || "",
        profile.user_retirement_age || "",
        profile.user_life_expectancy || "",
        profile.risk_appetite || "",
        profile.address || "",
        profile.remarks || "",
      ],
      spouse
        ? [
            "Primary",
            resolveMemberName(
              spouse.user_id,
              spouse.user_name,
              spouse.name,
              spouse.full_name
            ),
            spouse.relation || "Spouse",
            formatExportDate(spouse.dob),
            spouse.user_age || getAgeFromDate(spouse.dob),
            spouse.gender || "",
            spouse.occupation || "",
            spouse.retirement_age || "",
            spouse.life_expectancy_age || "",
            "",
            spouse.address || "",
            spouse.remarks || "",
          ]
        : null,
      ...dependents.map((member) => [
        "Dependent",
        resolveMemberName(member.user_id, member.user_name, member.name, member.full_name),
        member.relation || "",
        formatExportDate(member.dob),
        member.user_age || getAgeFromDate(member.dob),
        member.gender || "",
        member.occupation || "",
        member.retirement_age || "",
        member.life_expectancy_age || "",
        "",
        member.address || "",
        member.remarks || "",
      ]),
    ].filter(Boolean),
  });
};

const buildIncomeDetailsSheetModel = (incomes, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Income Details",
    title: "Income Details",
    headers: [
      "Category",
      "Income Name",
      "Income For",
      "Amount",
      "Fixed / Variable",
      "One Time / Recurring",
      "Frequency",
      "Growth Rate",
      "Start Date",
      "End Date",
      "Valid Till",
      "Remarks",
    ],
    widths: [130, 170, 110, 90, 110, 130, 100, 90, 100, 100, 120, 180],
    dataRows: incomes.map((item) => [
      item.income_category_type || "",
      item.user_income_name || "",
      resolveMemberName(item.user_income_for, item.income_for_name),
      safeNumber(item.user_income_amount),
      item.user_income_type || "",
      item.user_income_occurance || "",
      item.user_income_freq || "",
      formatPercentText(item.user_income_growth_rate),
      formatExportDate(item.user_income_start_date),
      formatExportDate(item.user_income_end_date),
      item.user_income_valid_till || "",
      item.user_income_remarks || item.remarks || "",
    ]),
  });

const buildExpenseDetailsSheetModel = (expenses, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Expense Details",
    title: "Expense Details",
    headers: [
      "Category",
      "Expense Name",
      "Expense For",
      "Amount",
      "Fixed / Variable",
      "Mandatory / Wishful",
      "One Time / Recurring",
      "Frequency",
      "Growth Rate",
      "Start Date",
      "End Date",
      "Valid Till",
      "Remarks",
    ],
    widths: [130, 170, 110, 90, 110, 130, 130, 100, 90, 100, 100, 120, 180],
    dataRows: expenses.map((item) => [
      item.expense_category_type || "",
      item.user_expense_name || "",
      resolveMemberName(item.user_expense_for, item.expense_for_name),
      safeNumber(item.user_expense_amount),
      item.user_expense_type || "",
      item.user_expense_category || "",
      item.user_expense_occurance || "",
      item.user_expense_freq || "",
      formatPercentText(item.user_expense_growth_rate),
      formatExportDate(item.user_expense_start_date || item.user_expense_one_time_date),
      formatExportDate(item.user_expense_end_date),
      item.user_expense_valid_till || "",
      item.user_expense_remarks || item.remarks || "",
    ]),
  });

const buildGoalDetailsSheetModel = (goals, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Goal Details",
    title: "Goal Details",
    headers: [
      "Category",
      "Goal Name",
      "Goal For",
      "Current Value",
      "Goal Amount",
      "Priority",
      "Goal Type",
      "One Time / Recurring",
      "Frequency",
      "Growth / Inflation",
      "Start Date",
      "End Date",
      "Valid Till",
      "Funded By",
      "Context",
      "Remarks",
    ],
    widths: [120, 170, 110, 95, 95, 100, 100, 130, 100, 95, 100, 100, 120, 110, 160, 180],
    dataRows: goals.map((item) => [
      item.goal_category_type || "",
      item.user_goal_name || "",
      resolveMemberName(item.user_goal_for, item.goalforname, item.goal_for_member),
      safeNumber(item.user_goal_current_amount || item.user_goal_present_value),
      safeNumber(item.user_goal_amount),
      item.user_goal_priority || "",
      item.user_goal_type || "",
      item.user_goal_occurance || "",
      item.user_goal_freq || "",
      formatPercentText(item.user_goal_growth_rate),
      formatExportDate(item.user_goal_start_date),
      formatExportDate(item.user_goal_end_date),
      item.user_goal_valid_till || "",
      item.user_goal_funded_by || "",
      item.user_goal_context || "",
      item.user_goal_remarks || item.remarks || "",
    ]),
  });

const buildAssetDetailsSheetModel = (assets, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Asset Details",
    title: "Asset Details",
    headers: [
      "Category",
      "Sub Category",
      "Asset Type",
      "Asset Name",
      "Owner",
      "Holding Form",
      "Source",
      "Investment Amount",
      "Current Amount",
      "Purchase Date",
      "Maturity Date",
      "Maturity Amount",
      "Frequency",
      "One Time / Recurring",
      "Growth Rate",
      "Return Rate",
      "Valid Till",
      "Remarks",
    ],
    widths: [120, 140, 140, 180, 100, 110, 100, 110, 110, 100, 100, 110, 90, 130, 90, 90, 110, 180],
    dataRows: assets.map((item) => [
      item.asset_category_type || "",
      item.asset_sub_category_type || "",
      item.asset_sub_name_uuid || item.asset_name_uuid || "",
      item.user_asset_name || "",
      resolveMemberName(item.user_asset_for, item.asset_for_name),
      item.user_asset_holding_form || item.user_asset_mode || "",
      item.user_asset_source || "",
      safeNumber(item.user_asset_investment_amount),
      safeNumber(item.user_asset_current_amount),
      formatExportDate(item.user_asset_purchase_date),
      formatExportDate(item.user_asset_maturity_date),
      safeNumber(item.user_asset_maturity_amount),
      item.user_asset_freq || "",
      item.user_asset_occurance || "",
      formatPercentText(item.user_asset_growth_rate),
      formatPercentText(item.user_asset_ror),
      item.user_asset_valid_till || "",
      item.user_asset_remarks || item.remarks || "",
    ]),
  });

const buildLiabilityDetailsSheetModel = (liabilities, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Liability Details",
    title: "Liability Details",
    headers: [
      "Category",
      "Sub Category",
      "Liability Name",
      "Owner",
      "Outstanding Amount",
      "EMI Amount",
      "Interest Rate",
      "Start Date",
      "End Date",
      "Tenure (Months)",
      "Remarks",
    ],
    widths: [120, 140, 200, 100, 120, 100, 100, 100, 100, 110, 180],
    dataRows: liabilities.map((item) => [
      item.liability_category_type || "",
      item.liability_sub_category_type || "",
      item.user_liability_name || "",
      resolveMemberName(item.user_liability_for, item.liability_for_name),
      safeNumber(item.user_liability_outstanding_amount),
      safeNumber(item.user_liability_emi_amount),
      formatPercentText(item.user_liability_emi_rate),
      formatExportDate(item.user_liability_start_date),
      formatExportDate(item.user_liability_end_date),
      safeNumber(item.user_liability_tenure_months),
      item.user_liability_remarks || item.remarks || "",
    ]),
  });

const buildInsuranceDetailsSheetModel = (insurances, resolveMemberName) =>
  buildDetailSheetModel({
    sheetName: "Insurance Details",
    title: "Insurance Details",
    headers: [
      "Category",
      "Policy Holder",
      "Insurance Type",
      "Policy Name",
      "Sum Assured",
      "Premium Amount",
      "Premium Frequency",
      "Start Date",
      "End Date",
      "Policy Term",
      "Pay Till FY",
      "Maturity Amount",
      "Bonus Start Year",
      "Bonus Frequency",
      "Bonus Amount",
      "Life Cover",
      "Remarks",
    ],
    widths: [120, 120, 130, 180, 110, 110, 110, 100, 100, 100, 100, 110, 110, 110, 100, 90, 180],
    dataRows: insurances.map((item) => [
      item.insurance_category_type || "",
      resolveMemberName(item.user_insurance_for, item.insurance_for_name),
      item.insurance_type || "",
      item.user_insurance_name || "",
      safeNumber(item.user_insurance_sum_assured),
      safeNumber(item.user_insurance_premium_amount || item.user_insurance_premium),
      item.user_insurance_premium_freq || "",
      formatExportDate(item.user_insurance_start_date),
      formatExportDate(item.user_insurance_end_date),
      item.user_insurance_policy_term || "",
      item.user_insurance_pay_till_fy || "",
      safeNumber(item.user_insurance_maturity_amount),
      item.user_insurance_bonus_start_year || "",
      item.user_insurance_bonus_freq || "",
      safeNumber(item.user_insurance_bonus_amount),
      formatBooleanText(item.user_insurance_life_cover),
      item.user_insurance_remarks || item.remarks || "",
    ]),
  });

const buildRiskAnswersSheetModel = (riskQuestions, riskAnswers) => {
  const answerMap = new Map(
    riskAnswers.map((answer) => [String(answer.risk_question_id), answer])
  );

  return buildDetailSheetModel({
    sheetName: "Risk Answers",
    title: "Risk Questionnaire Answers",
    headers: ["Question No.", "Question", "Selected Answer", "Answer Id", "Score"],
    widths: [90, 420, 240, 90, 70],
    dataRows: riskQuestions.map((question, index) => {
      const answer = answerMap.get(String(question.risk_question_id));
      const selectedOption = question.options?.find(
        (option) =>
          String(option.risk_option_points) === String(answer?.risk_option_id) ||
          String(option.risk_option_id) === String(answer?.risk_option_id)
      );

      return [
        index + 1,
        question.risk_question_text || "",
        selectedOption?.risk_option_text || "",
        answer?.risk_option_id || "",
        selectedOption?.risk_option_points || "",
      ];
    }),
  });
};

export const downloadFinancialPlanningReport = async () => {
  const userId = getParentUserId();

  const [
    profileRes,
    familyRes,
    goalsRes,
    liabilitiesRes,
    assetsRes,
    incomeRes,
    expenseRes,
    insuranceRes,
    riskQuestionsRes,
    riskAnswersRes,
  ] = await Promise.all([
    fetchUserProfileDetails(userId),
    getFamilyMember(userId),
    getGoalDetails(userId),
    getLiabilityDetails(userId, null),
    getOtherInvestments({
      user_id: userId,
      data_belongs_to: DATA_BELONGS_TO,
    }),
    getIncomeDetails(userId),
    getExpenseDetails(userId),
    getInsuranceDetails(userId, ""),
    FetchRiskQuestionsUrl(),
    FetchUserRiskAnswersUrl(userId),
  ]);

  const profile = normalizeObjectData(profileRes?.data);
  const familyMembers = familyRes?.data || [];
  const goals = goalsRes?.data || [];
  const liabilities = liabilitiesRes?.data || [];
  const assets = assetsRes?.data?.listing || [];
  const incomes = incomeRes?.data || [];
  const expenses = expenseRes?.data || [];
  const insurances = insuranceRes?.data || [];
  const riskQuestions = riskQuestionsRes?.data || [];
  const riskAnswers = riskAnswersRes?.data || [];
  const resolveMemberName = buildMemberNameResolver(profile, familyMembers);

  if (
    !profileRes?.data &&
    !familyMembers.length &&
    !goals.length &&
    !liabilities.length &&
    !assets.length &&
    !incomes.length &&
    !expenses.length &&
    !insurances.length &&
    !riskQuestions.length
  ) {
    throw new Error("No report data available to export.");
  }

  const blob = await buildWorkbookBuffer([
    buildDataSheetModel({
      profile,
      familyMembers,
      incomes,
      expenses,
      liabilities,
      assets,
      insurances,
      goals,
      riskQuestions,
      riskAnswers,
    }),
    buildProfileSheetModel({
      profile,
      familyMembers,
    }),
    buildIncomeDetailsSheetModel(incomes, resolveMemberName),
    buildExpenseDetailsSheetModel(expenses, resolveMemberName),
    buildGoalDetailsSheetModel(goals, resolveMemberName),
    buildAssetDetailsSheetModel(assets, resolveMemberName),
    buildLiabilityDetailsSheetModel(liabilities, resolveMemberName),
    buildInsuranceDetailsSheetModel(insurances, resolveMemberName),
    buildRiskAnswersSheetModel(riskQuestions, riskAnswers),
  ]);
  const today = moment().format("YYYY-MM-DD");
  const fileName = `financial-planning-report-${today}.xlsx`;

  if (window.navigator?.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
    return fileName;
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);

  return fileName;
};
