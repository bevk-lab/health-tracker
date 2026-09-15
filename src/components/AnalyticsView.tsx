import React, { useState, useMemo, useRef } from 'react';
import { VitalsRecord, UserProfile } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  Filter,
  Activity,
  Heart,
  Droplets,
  Thermometer,
  Sparkles,
  Info,
  Download,
  FileText,
  Printer,
  Check,
  Copy,
  X,
  FileDown,
  ShieldCheck,
  User,
  Clock,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  HeartPulse,
  Cloud
} from 'lucide-react';

interface AnalyticsViewProps {
  vitals: VitalsRecord[];
  user?: UserProfile;
}

type TimeFilter = 'today' | '7days' | 'month' | 'year' | 'custom';
type MetricView = 'all' | 'bp' | 'pulse' | 'spo2' | 'bloodsugar' | 'temp';
type ReportTab = 'styled' | 'text' | 'csv';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ vitals, user }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7days');
  const [metricView, setMetricView] = useState<MetricView>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-31');

  // Report Modal & Export States
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTab, setReportTab] = useState<ReportTab>('styled');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Filter vitals based on selected time range
  const filteredData = useMemo(() => {
    if (!vitals || vitals.length === 0) return [];
    const now = new Date();
    const sorted = [...vitals].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    );

    if (timeFilter === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      const todayRecords = sorted.filter((v) => v.date === todayStr);
      return todayRecords.length > 0 ? todayRecords : sorted.slice(-3);
    }

    if (timeFilter === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sorted.filter((v) => new Date(v.date) >= sevenDaysAgo);
    }

    if (timeFilter === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return sorted.filter((v) => new Date(v.date) >= thirtyDaysAgo);
    }

    if (timeFilter === 'year') {
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return sorted.filter((v) => new Date(v.date) >= oneYearAgo);
    }

    if (timeFilter === 'custom') {
      return sorted.filter((v) => v.date >= customStartDate && v.date <= customEndDate);
    }

    return sorted;
  }, [vitals, timeFilter, customStartDate, customEndDate]);

  // Tea summary statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { avgSys: 120, avgDia: 80, avgPulse: 72, avgSpo2: 99, avgSugar: 95, avgTemp: '36.6', anomaliesCount: 0 };
    }
    const count = filteredData.length;
    const avgSys = Math.round(filteredData.reduce((acc, v) => acc + (v.sys || 0), 0) / count);
    const avgDia = Math.round(filteredData.reduce((acc, v) => acc + (v.dia || 0), 0) / count);
    const avgPulse = Math.round(filteredData.reduce((acc, v) => acc + (v.pulse || 0), 0) / count);
    const avgSpo2 = Math.round(filteredData.reduce((acc, v) => acc + (v.spo2 || 0), 0) / count);
    const avgSugar = Math.round(filteredData.reduce((acc, v) => acc + (v.bloodSugar || 0), 0) / count);
    const avgTemp = (filteredData.reduce((acc, v) => acc + (v.temperature || 0), 0) / count).toFixed(1);
    const anomaliesCount = filteredData.filter((v) => v.isAbnormal).length;

    return { avgSys, avgDia, avgPulse, avgSpo2, avgSugar, avgTemp, anomaliesCount };
  }, [filteredData]);

  // Dynamic Trend Insights Calculation
  const trendInsights = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        pulse: { text: 'No pulse entries', pct: 0, direction: 'flat' as const, subtitle: 'Log vitals to unlock comparative trend metrics', value: '--' },
        bp: { text: 'BP data needed', diffSys: 0, direction: 'flat' as const, subtitle: 'Systolic & diastolic trend requires logs', value: '--' },
        sugar: { text: 'Blood sugar normal', pct: 0, direction: 'flat' as const, subtitle: 'Glycemic variability within safe limits', value: '--' },
        spo2: { text: 'SpO2 Oxygen stable', diff: 0, direction: 'flat' as const, subtitle: 'Oxygen saturation monitored at target', value: '--' },
        stability: { score: 100, anomalies: 0, text: '100% Safe Bounds', subtitle: 'Zero abnormal breaches detected' },
        headline: 'Log new vitals to calculate real-time comparative trend insights! ✨'
      };
    }

    const n = filteredData.length;
    let earlierSlice: VitalsRecord[] = [];
    let recentSlice: VitalsRecord[] = [];

    if (n >= 4) {
      const mid = Math.floor(n / 2);
      earlierSlice = filteredData.slice(0, mid);
      recentSlice = filteredData.slice(mid);
    } else if (n >= 2) {
      earlierSlice = [filteredData[0]];
      recentSlice = filteredData.slice(1);
    } else {
      earlierSlice = filteredData;
      recentSlice = filteredData;
    }

    const avg = (arr: VitalsRecord[], key: keyof VitalsRecord) =>
      arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / (arr.length || 1);

    // 1. Pulse / Heart Rate Trend
    const earlierPulse = avg(earlierSlice, 'pulse');
    const recentPulse = avg(recentSlice, 'pulse');
    const pulseDiffPct = earlierPulse > 0 ? Math.round(((recentPulse - earlierPulse) / earlierPulse) * 100) : 0;
    let pulseDirection: 'up' | 'down' | 'flat' = 'flat';
    let pulseText = '';
    let pulseSubtitle = '';

    if (pulseDiffPct > 2) {
      pulseDirection = 'up';
      pulseText = `Your average pulse has increased by +${pulseDiffPct}%`;
      pulseSubtitle = `Shifted from ${Math.round(earlierPulse)} to ${Math.round(recentPulse)} BPM (elevated resting rate)`;
    } else if (pulseDiffPct < -2) {
      pulseDirection = 'down';
      pulseText = `Your average pulse has decreased by ${Math.abs(pulseDiffPct)}%`;
      pulseSubtitle = `Lowered from ${Math.round(earlierPulse)} to ${Math.round(recentPulse)} BPM (improved cardiac recovery)`;
    } else {
      pulseDirection = 'flat';
      pulseText = `Your pulse has remained steady (avg ${Math.round(recentPulse)} BPM)`;
      pulseSubtitle = `Consistent resting heart rate across all ${n} logs`;
    }

    // 2. Blood Pressure Trend
    const earlierSys = avg(earlierSlice, 'sys');
    const recentSys = avg(recentSlice, 'sys');
    const earlierDia = avg(earlierSlice, 'dia');
    const recentDia = avg(recentSlice, 'dia');
    const sysDiff = Math.round(recentSys - earlierSys);
    let bpDirection: 'up' | 'down' | 'flat' = 'flat';
    let bpText = '';
    let bpSubtitle = '';

    if (sysDiff > 2) {
      bpDirection = 'up';
      bpText = `Systolic BP increased by +${sysDiff} mmHg`;
      bpSubtitle = `Trending from ${Math.round(earlierSys)} to ${Math.round(recentSys)} mmHg (monitor salt & hydration)`;
    } else if (sysDiff < -2) {
      bpDirection = 'down';
      bpText = `Systolic BP decreased by ${Math.abs(sysDiff)} mmHg`;
      bpSubtitle = `Trending down to ${Math.round(recentSys)}/${Math.round(recentDia)} mmHg (healthy optimal range)`;
    } else {
      bpDirection = 'flat';
      bpText = `Blood pressure is balanced at ${Math.round(recentSys)}/${Math.round(recentDia)} mmHg`;
      bpSubtitle = `Vascular pressure is steady and within target`;
    }

    // 3. Blood Sugar Trend
    const earlierSugar = avg(earlierSlice, 'bloodSugar');
    const recentSugar = avg(recentSlice, 'bloodSugar');
    const sugarDiffPct = earlierSugar > 0 ? Math.round(((recentSugar - earlierSugar) / earlierSugar) * 100) : 0;
    let sugarDirection: 'up' | 'down' | 'flat' = 'flat';
    let sugarText = '';
    let sugarSubtitle = '';

    if (sugarDiffPct > 3) {
      sugarDirection = 'up';
      sugarText = `Blood sugar is up by +${sugarDiffPct}%`;
      sugarSubtitle = `Averaging ${Math.round(recentSugar)} mg/dL (reflects recent post-meal logs)`;
    } else if (sugarDiffPct < -3) {
      sugarDirection = 'down';
      sugarText = `Blood sugar decreased by ${Math.abs(sugarDiffPct)}%`;
      sugarSubtitle = `Averaging ${Math.round(recentSugar)} mg/dL (steady glycemic regulation)`;
    } else {
      sugarDirection = 'flat';
      sugarText = `Blood sugar stabilized at ${Math.round(recentSugar)} mg/dL`;
      sugarSubtitle = `Normal glycemic curve across pre/post-meal logs`;
    }

    // 4. SpO2 Oxygen Trend
    const earlierSpo2 = avg(earlierSlice, 'spo2');
    const recentSpo2 = avg(recentSlice, 'spo2');
    const spo2Diff = Math.round(recentSpo2 - earlierSpo2);
    let spo2Direction: 'up' | 'down' | 'flat' = 'flat';
    let spo2Text = '';
    let spo2Subtitle = '';

    if (spo2Diff > 0) {
      spo2Direction = 'up';
      spo2Text = `SpO2 Oxygen increased to ${Math.round(recentSpo2)}% (+${spo2Diff}%)`;
      spo2Subtitle = `Peak arterial oxygenation recorded across all logs`;
    } else if (spo2Diff < 0) {
      spo2Direction = 'down';
      spo2Text = `SpO2 Oxygen averaged ${Math.round(recentSpo2)}% (${spo2Diff}%)`;
      spo2Subtitle = `Remains safely above the 95% minimum clinical safety threshold`;
    } else {
      spo2Direction = 'flat';
      spo2Text = `SpO2 Oxygen is rock solid at ${Math.round(recentSpo2)}%`;
      spo2Subtitle = `100% of recorded readings strictly within prime oxygenated state`;
    }

    // Overall Stability & Headline
    const abnormalCount = filteredData.filter((d) => d.isAbnormal).length;
    const normalPct = Math.round(((n - abnormalCount) / n) * 100);
    let headline = '';

    if (abnormalCount === 0) {
      headline = `✨ Peak Vibe: 100% of your ${n} tracked metrics stayed inside optimal green health boundaries!`;
    } else if (pulseDiffPct < 0 && sysDiff <= 0) {
      headline = `✨ Solid Recovery: Your average pulse decreased by ${Math.abs(pulseDiffPct)}% and blood pressure remains well-controlled.`;
    } else if (abnormalCount > 0) {
      headline = `⚠️ Health Alert: ${abnormalCount} readings crossed threshold limits in this ${timeFilter} window. Check your flagged logs below.`;
    } else {
      headline = `📈 Stable vital telemetry confirmed across ${n} chronologically logged health checkpoints.`;
    }

    return {
      pulse: { text: pulseText, pct: pulseDiffPct, direction: pulseDirection, subtitle: pulseSubtitle, value: `${Math.round(recentPulse)} BPM` },
      bp: { text: bpText, diffSys: sysDiff, direction: bpDirection, subtitle: bpSubtitle, value: `${Math.round(recentSys)}/${Math.round(recentDia)}` },
      sugar: { text: sugarText, pct: sugarDiffPct, direction: sugarDirection, subtitle: sugarSubtitle, value: `${Math.round(recentSugar)} mg/dL` },
      spo2: { text: spo2Text, diff: spo2Diff, direction: spo2Direction, subtitle: spo2Subtitle, value: `${Math.round(recentSpo2)}%` },
      stability: {
        score: normalPct,
        anomalies: abnormalCount,
        text: `${normalPct}% Normal Range`,
        subtitle: abnormalCount === 0 ? 'Zero abnormal breaches detected' : `${abnormalCount} anomaly flags detected in this period`
      },
      headline
    };
  }, [filteredData, timeFilter]);

  // Latest vital sign reading
  const latestVital = useMemo(() => {
    if (!vitals || vitals.length === 0) return null;
    return vitals[vitals.length - 1];
  }, [vitals]);

  // Helper for Age
  const userAge = useMemo(() => {
    if (!user?.dob) return 24;
    const birth = new Date(user.dob);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }, [user?.dob]);

  // Generate Formatted Plaintext Report
  const generatedTextReport = useMemo(() => {
    const now = new Date();
    const timestampStr = now.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    const reportId = `SLAY-RPT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const patientName = user?.fullName || 'Gen Z Patient';
    const dob = user?.dob || '2004-02-14';
    const phone = user?.phone || '+84 90 123 4567';
    const emergency = user?.emergencyContact ? `${user.emergencyContact.name} (${user.emergencyContact.relationship}) - ${user.emergencyContact.phone}` : 'None provided';
    const allergies = user?.knownAllergies ? `  • Medications: ${user.knownAllergies.medications || 'None'}\n  • Food: ${user.knownAllergies.food || 'None'}\n  • Drinks: ${user.knownAllergies.drinks || 'None'}` : 'None recorded';

    let latestVitalsSection = 'No vitals logged yet.';
    if (latestVital) {
      latestVitalsSection = `  • Timestamp: ${latestVital.date} at ${latestVital.time || '12:00'} (${latestVital.tag || 'Routine'})
  • Blood Pressure: ${latestVital.sys}/${latestVital.dia} mmHg [Normal: 90-120 / 60-80]
  • Pulse / Heart Rate: ${latestVital.pulse} BPM [Normal: 60-100]
  • SpO2 Blood Oxygen: ${latestVital.spo2}% [Normal: >=95%]
  • Blood Sugar: ${latestVital.bloodSugar} mg/dL [Normal: 70-130]
  • Body Temperature: ${latestVital.temperature} °C [Normal: 36.1 - 37.5]
  • Meal Context: ${latestVital.mealStatus}
  • Allergy Symptoms: ${latestVital.hasAllergyReaction ? `YES (${latestVital.allergyDetails || 'Reported'})` : 'None'}
  • Anomaly Flag: ${latestVital.isAbnormal ? `ALERT - ${latestVital.anomalyReasons.join(', ')}` : 'Normal range ✅'}`;
    }

    let historyTable = 'No entries recorded in selected range.';
    if (filteredData.length > 0) {
      const rows = filteredData.map((d) => {
        const flag = d.isAbnormal ? `⚠️ ALERT: ${d.anomalyReasons.join('; ')}` : 'OK';
        return `${d.date.padEnd(11)} ${(d.time || '--:--').padEnd(7)} ${(d.sys + '/' + d.dia).padEnd(10)} ${(d.pulse + ' BPM').padEnd(11)} ${(d.spo2 + '%').padEnd(8)} ${(d.bloodSugar + ' mg/dL').padEnd(14)} ${(d.temperature + ' °C').padEnd(10)} ${flag}`;
      });
      historyTable = `Date        Time    SYS/DIA    Pulse       SpO2     Blood Sugar    Temp       Status / Red Flags\n` +
        `----------------------------------------------------------------------------------------------------\n` +
        rows.join('\n');
    }

    return `====================================================================================================
                        SLAYHEALTH CLINICAL VITALS SUMMARY & TREND REPORT
====================================================================================================
Report ID     : ${reportId}
Generated At  : ${timestampStr}
Time Filter   : ${timeFilter.toUpperCase()} (${filteredData.length} records analyzed)
Application   : SlayHealth Web Platform (Cloud Firestore Sync)

----------------------------------------------------------------------------------------------------
[1] PATIENT DEMOGRAPHICS & CLINICAL PROFILE
----------------------------------------------------------------------------------------------------
Full Name        : ${patientName}
Date of Birth    : ${dob} (Age: ${userAge})
Gender           : ${user?.gender || 'Female 🌸'}
Primary Phone    : ${phone}
Residential Addr : ${user?.address || '123 Nguyen Hue Blvd, District 1'}
Emergency Contact: ${emergency}

Known Allergies:
${allergies}

----------------------------------------------------------------------------------------------------
[2] LATEST RECORDED VITAL SIGNS
----------------------------------------------------------------------------------------------------
${latestVitalsSection}

----------------------------------------------------------------------------------------------------
[3] STATISTICAL AGGREGATES & HISTORICAL AVERAGES (${timeFilter.toUpperCase()})
----------------------------------------------------------------------------------------------------
Total Records Analyzed : ${filteredData.length}
Average Blood Pressure : ${stats.avgSys} / ${stats.avgDia} mmHg
Average Pulse Rate     : ${stats.avgPulse} BPM
Average SpO2 Oxygen    : ${stats.avgSpo2}%
Average Blood Sugar    : ${stats.avgSugar} mg/dL
Average Body Temp      : ${stats.avgTemp} °C
Total Anomaly Triggers : ${stats.anomaliesCount} flag(s) detected

----------------------------------------------------------------------------------------------------
[4] CHRONOLOGICAL VITALS LOG
----------------------------------------------------------------------------------------------------
${historyTable}

====================================================================================================
DISCLAIMER:
This digital summary is compiled via SlayHealth cloud tracking metrics for personal monitoring and
physician consultation. Not an automated diagnostic substitute for emergency clinical care.
====================================================================================================`;
  }, [user, userAge, latestVital, filteredData, stats, timeFilter]);

  // Generate CSV Data
  const generatedCsv = useMemo(() => {
    const headers = ['Date', 'Time', 'SYS_BP', 'DIA_BP', 'Pulse_BPM', 'SpO2_Percent', 'BloodSugar_mgdL', 'Temperature_C', 'Tag', 'Meal_Status', 'Allergy_Reaction', 'Is_Abnormal', 'Anomaly_Reasons'];
    const rows = filteredData.map((d) => [
      d.date,
      d.time || '12:00',
      d.sys,
      d.dia,
      d.pulse,
      d.spo2,
      d.bloodSugar,
      d.temperature,
      `"${d.tag || ''}"`,
      d.mealStatus,
      d.hasAllergyReaction ? 'YES' : 'NO',
      d.isAbnormal ? 'TRUE' : 'FALSE',
      `"${(d.anomalyReasons || []).join('; ')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }, [filteredData]);

  // Trigger File Download
  const handleDownloadTextReport = () => {
    setIsDownloading(true);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `SlayHealth_Summary_${user?.fullName?.replace(/\s+/g, '_') || 'Patient'}_${dateStr}.txt`;
    const blob = new Blob([generatedTextReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsDownloading(false), 500);
  };

  const handleDownloadCsv = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `SlayHealth_Vitals_Data_${dateStr}.csv`;
    const blob = new Blob([generatedCsv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTextReport);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Print / Save to PDF
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      handleDownloadTextReport();
      return;
    }

    const patientName = user?.fullName || 'Gen Z Patient';
    const dob = user?.dob || '2004-02-14';
    const phone = user?.phone || '+84 90 123 4567';
    const nowStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SlayHealth Report - ${patientName}</title>
        <style>
          @page { margin: 15mm; size: auto; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.4; }
          .header-box { border: 2px solid #0f172a; background-color: #fce7f3; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: 900; margin: 0; color: #831843; }
          .subtitle { font-size: 12px; font-weight: 700; color: #475569; margin-top: 4px; }
          .badge { display: inline-block; background-color: #fef08a; border: 1.5px solid #0f172a; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .card { border: 2px solid #0f172a; border-radius: 12px; padding: 14px; background: #fff; }
          .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .stat-card { border: 1.5px solid #0f172a; border-radius: 10px; padding: 10px; text-align: center; }
          .stat-val { font-size: 20px; font-weight: 900; }
          .stat-label { font-size: 10px; font-weight: 700; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #f1f5f9; border: 1px solid #0f172a; padding: 8px; text-align: left; font-weight: 800; font-size: 11px; }
          td { border: 1px solid #cbd5e1; padding: 6px 8px; font-weight: 600; }
          .alert-row { background-color: #fee2e2; color: #991b1b; }
          .footer { margin-top: 30px; border-top: 1.5px solid #94a3b8; padding-top: 10px; font-size: 10px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span class="badge">OFFICIAL CLINICAL SUMMARY ✨</span>
              <h1 class="title" style="margin-top: 6px;">SlayHealth Medical Trend Report</h1>
              <div class="subtitle">Personalized Health Vital Signs & Historical Analytics (Cloud Database)</div>
            </div>
            <div style="text-align: right; font-size: 11px; font-weight: 700;">
              <div>Generated: ${nowStr}</div>
              <div style="color: #9333ea;">Timeframe: ${timeFilter.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Patient Profile</div>
            <div><strong>Name:</strong> ${patientName}</div>
            <div><strong>DOB:</strong> ${dob} (Age: ${userAge}) | <strong>Gender:</strong> ${user?.gender || 'Female'}</div>
            <div><strong>Phone:</strong> ${phone}</div>
            <div><strong>Emergency Contact:</strong> ${user?.emergencyContact?.name || 'Thao Lam'} (${user?.emergencyContact?.phone || '+84 91 999 8888'})</div>
          </div>

          <div class="card">
            <div class="card-title">Allergies & Medical Alerts</div>
            <div><strong>Medications:</strong> ${user?.knownAllergies?.medications || 'None recorded'}</div>
            <div><strong>Food:</strong> ${user?.knownAllergies?.food || 'None recorded'}</div>
            <div><strong>Drinks / Other:</strong> ${user?.knownAllergies?.drinks || 'None recorded'}</div>
            <div><strong>Red Flag Breaches:</strong> <span style="color: #dc2626; font-weight: 900;">${stats.anomaliesCount} flag(s) in this period</span></div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 20px; background-color: #faf5ff;">
          <div class="card-title" style="color: #6b21a8;">Latest Vital Signs Snapshot (${latestVital ? `${latestVital.date} ${latestVital.time || ''}` : 'N/A'})</div>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center;">
            <div><div style="font-size: 18px; font-weight: 900; color: #7e22ce;">${latestVital ? `${latestVital.sys}/${latestVital.dia}` : '--'}</div><div style="font-size: 10px; font-weight: 700;">BP (mmHg)</div></div>
            <div><div style="font-size: 18px; font-weight: 900; color: #dc2626;">${latestVital ? latestVital.pulse : '--'}</div><div style="font-size: 10px; font-weight: 700;">Pulse (BPM)</div></div>
            <div><div style="font-size: 18px; font-weight: 900; color: #0284c7;">${latestVital ? `${latestVital.spo2}%` : '--'}</div><div style="font-size: 10px; font-weight: 700;">SpO2 Oxygen</div></div>
            <div><div style="font-size: 18px; font-weight: 900; color: #059669;">${latestVital ? latestVital.bloodSugar : '--'}</div><div style="font-size: 10px; font-weight: 700;">Sugar (mg/dL)</div></div>
            <div><div style="font-size: 18px; font-weight: 900; color: #ea580c;">${latestVital ? `${latestVital.temperature}°C` : '--'}</div><div style="font-size: 10px; font-weight: 700;">Temp (°C)</div></div>
          </div>
        </div>

        <div class="stat-grid">
          <div class="stat-card" style="background-color: #fef9c3;">
            <div class="stat-val">${stats.avgSys}/${stats.avgDia}</div>
            <div class="stat-label">Avg Blood Pressure (mmHg)</div>
          </div>
          <div class="stat-card" style="background-color: #fee2e2;">
            <div class="stat-val">${stats.avgPulse} BPM</div>
            <div class="stat-label">Avg Pulse Rate</div>
          </div>
          <div class="stat-card" style="background-color: #e0f2fe;">
            <div class="stat-val">${stats.avgSpo2}%</div>
            <div class="stat-label">Avg SpO2 Level</div>
          </div>
          <div class="stat-card" style="background-color: #dcfce7;">
            <div class="stat-val">${stats.avgSugar} mg/dL</div>
            <div class="stat-label">Avg Blood Sugar</div>
          </div>
          <div class="stat-card" style="background-color: #fae8ff;">
            <div class="stat-val">${stats.avgTemp} °C</div>
            <div class="stat-label">Avg Body Temp</div>
          </div>
          <div class="stat-card" style="background-color: #fee2e2;">
            <div class="stat-val" style="color: #b91c1c;">${stats.anomaliesCount}</div>
            <div class="stat-label">Anomaly Breaches</div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Recent Chronological Observations (${filteredData.length} Total Logs)</div>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>SYS/DIA</th>
                <th>Pulse</th>
                <th>SpO2</th>
                <th>Sugar</th>
                <th>Temp</th>
                <th>Context / Alert</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(d => `
                <tr class="${d.isAbnormal ? 'alert-row' : ''}">
                  <td>${d.date} ${d.time || ''}</td>
                  <td>${d.sys}/${d.dia}</td>
                  <td>${d.pulse} BPM</td>
                  <td>${d.spo2}%</td>
                  <td>${d.bloodSugar}</td>
                  <td>${d.temperature}°C</td>
                  <td>${d.isAbnormal ? `⚠️ ${(d.anomalyReasons || []).join(', ')}` : (d.tag || 'Routine')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          Report compiled by SlayHealth Personal Health Tracker. This document provides tracked metrics for medical review and is not an autonomous diagnostic determination.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Custom Dot with Red Marker for Abnormal Readings
  const renderAnomalyDot = (props: any, metricKey: keyof VitalsRecord) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    let isMetricAbnormal = false;
    if (metricKey === 'sys' && (payload.sys > 140 || payload.sys < 90)) isMetricAbnormal = true;
    if (metricKey === 'dia' && (payload.dia > 90 || payload.dia < 60)) isMetricAbnormal = true;
    if (metricKey === 'pulse' && (payload.pulse > 100 || payload.pulse < 60)) isMetricAbnormal = true;
    if (metricKey === 'spo2' && payload.spo2 < 95) isMetricAbnormal = true;
    if (metricKey === 'bloodSugar' && (payload.bloodSugar > 130 || payload.bloodSugar < 70)) isMetricAbnormal = true;
    if (metricKey === 'temperature' && payload.temperature > 38.0) isMetricAbnormal = true;

    if (isMetricAbnormal || payload.isAbnormal) {
      return (
        <g key={`anomaly-${payload.id}-${metricKey}`}>
          <circle cx={cx} cy={cy} r={8} fill="#ef4444" stroke="#000000" strokeWidth={2} className="animate-pulse" />
          <circle cx={cx} cy={cy} r={3} fill="#ffffff" />
        </g>
      );
    }
    return <circle key={`dot-${payload.id}-${metricKey}`} cx={cx} cy={cy} r={4} fill="#0f172a" stroke="#fff" strokeWidth={1.5} />;
  };

  return (
    <div id="view-analytics" className="space-y-6 animate-fadeIn">
      {/* Title Banner & Action Bar */}
      <div className="bg-[#fbcfe8] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-white border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-black text-pink-700 mb-1 shadow-[1px_1px_0px_0px_#000]">
            PAGE 3: HEALTH ANALYTICS & TEA 🧋
          </div>
          <h2 className="text-2xl font-black text-slate-900">The Tea on My Health 📈</h2>
          <p className="text-xs font-semibold text-slate-700">
            Interactive trend visualizer with red alert logic & downloadable clinical summary synced to Cloud Firestore.
          </p>
        </div>

        {/* Action Buttons: Red Flags & Download Health Summary */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="bg-yellow-300 border-2 border-slate-900 px-3 py-2 rounded-2xl text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-red-600" />
            <span>{stats.anomaliesCount} Red Flags</span>
          </span>

          <button
            id="btn-download-health-summary"
            onClick={() => setIsReportModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 cursor-pointer"
            title="Download formatted health report and trends"
          >
            <Download size={16} />
            <span>Download Health Summary</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Filters & Metric Selector */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
        {/* Time Filters */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1">
              <Calendar size={14} className="text-purple-600" />
              <span>Time Frame Filter:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today' as TimeFilter, label: 'Today ⚡' },
              { id: '7days' as TimeFilter, label: '7 Days 📅' },
              { id: 'month' as TimeFilter, label: 'Month 🗓️' },
              { id: 'year' as TimeFilter, label: 'Year 🌟' },
              { id: 'custom' as TimeFilter, label: 'Custom Range ⚙️' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id)}
                className={`py-1.5 px-3.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                  timeFilter === f.id
                    ? 'bg-purple-300 text-slate-900 shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                    : 'bg-slate-50 text-slate-700 hover:bg-purple-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeFilter === 'custom' && (
            <div className="mt-3 p-3 bg-purple-50 border-2 border-slate-900 rounded-2xl flex flex-wrap items-center gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Metric Selector Tabs */}
        <div className="pt-2 border-t border-slate-200">
          <span className="text-xs font-black uppercase text-slate-700 block mb-2">
            Selected Stream:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as MetricView, label: 'All-in-One 🌈', bg: 'bg-yellow-200' },
              { id: 'bp' as MetricView, label: 'Blood Pressure 🩺', bg: 'bg-yellow-300' },
              { id: 'pulse' as MetricView, label: 'Pulse Rate 💓', bg: 'bg-red-300' },
              { id: 'spo2' as MetricView, label: 'SpO2 Oxygen 🫁', bg: 'bg-sky-300' },
              { id: 'bloodsugar' as MetricView, label: 'Blood Sugar 🩸', bg: 'bg-emerald-300' },
              { id: 'temp' as MetricView, label: 'Body Temp 🌡️', bg: 'bg-purple-300' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetricView(m.id)}
                className={`py-1.5 px-3 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                  metricView === m.id
                    ? `${m.bg} text-slate-900 shadow-[2px_2px_0px_0px_#000]`
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threshold Guide Badge Bar */}
      <div className="bg-[#fefce8] border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800">
        <div className="flex items-center gap-1.5 text-red-600 font-black">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 border border-slate-900"></span>
          <span>Red Marker Thresholds:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">SYS &gt; 140 / &lt; 90</span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">DIA &gt; 90 / &lt; 60</span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">Pulse &gt; 100 / &lt; 60</span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">SpO2 &lt; 95%</span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">Sugar &gt; 130 / &lt; 70</span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded-md">Temp &gt; 38°C</span>
        </div>
      </div>

      {/* Dynamic Trend Insights Summary Section Above the Chart */}
      <div id="analytics-trend-summary" className="bg-[#e0e7ff] border-3 border-slate-900 rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b-2 border-slate-900/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center text-white shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Trend Tea &amp; Summary Insights ☕
                </h3>
                <span className="bg-white border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full text-purple-700 shadow-[1px_1px_0px_0px_#000]">
                  Dynamic Insights ⚡
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-700">
                Calculated from {filteredData.length} entries in the <strong className="text-purple-800 uppercase">{timeFilter}</strong> timeframe.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl text-xs font-black text-slate-800 shadow-[1.5px_1.5px_0px_0px_#000] self-start sm:self-auto flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Health Vibe: <strong className="text-purple-700">{trendInsights.stability.text}</strong></span>
          </div>
        </div>

        {/* Dynamic Highlight Banner */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5">
          <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs font-extrabold text-slate-900 leading-snug">
            {trendInsights.headline}
          </p>
        </div>

        {/* 4 Trend Insight Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Pulse / Heart Rate Trend */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                  <Heart size={12} className="text-red-500" />
                  <span>Pulse Trajectory</span>
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 flex items-center gap-0.5 ${
                  trendInsights.pulse.direction === 'down'
                    ? 'bg-emerald-100 text-emerald-800'
                    : trendInsights.pulse.direction === 'up'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {trendInsights.pulse.direction === 'down' && <ArrowDownRight size={11} />}
                  {trendInsights.pulse.direction === 'up' && <ArrowUpRight size={11} />}
                  {trendInsights.pulse.direction === 'flat' && <Minus size={11} />}
                  <span>{trendInsights.pulse.pct !== 0 ? `${trendInsights.pulse.pct > 0 ? '+' : ''}${trendInsights.pulse.pct}%` : 'Steady'}</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                {trendInsights.pulse.text}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 mt-1 border-t border-slate-100 pt-1.5">
              {trendInsights.pulse.subtitle}
            </p>
          </div>

          {/* Card 2: Blood Pressure Trend */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                  <Activity size={12} className="text-purple-600" />
                  <span>Blood Pressure</span>
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 flex items-center gap-0.5 ${
                  trendInsights.bp.direction === 'down'
                    ? 'bg-emerald-100 text-emerald-800'
                    : trendInsights.bp.direction === 'up'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {trendInsights.bp.direction === 'down' && <ArrowDownRight size={11} />}
                  {trendInsights.bp.direction === 'up' && <ArrowUpRight size={11} />}
                  {trendInsights.bp.direction === 'flat' && <Minus size={11} />}
                  <span>{trendInsights.bp.diffSys !== 0 ? `${trendInsights.bp.diffSys > 0 ? '+' : ''}${trendInsights.bp.diffSys} mmHg` : 'Optimal'}</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                {trendInsights.bp.text}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 mt-1 border-t border-slate-100 pt-1.5">
              {trendInsights.bp.subtitle}
            </p>
          </div>

          {/* Card 3: Blood Sugar Trend */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                  <Droplets size={12} className="text-emerald-600" />
                  <span>Glycemic Tea</span>
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 flex items-center gap-0.5 ${
                  trendInsights.sugar.direction === 'down'
                    ? 'bg-emerald-100 text-emerald-800'
                    : trendInsights.sugar.direction === 'up'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {trendInsights.sugar.direction === 'down' && <ArrowDownRight size={11} />}
                  {trendInsights.sugar.direction === 'up' && <ArrowUpRight size={11} />}
                  {trendInsights.sugar.direction === 'flat' && <Minus size={11} />}
                  <span>{trendInsights.sugar.pct !== 0 ? `${trendInsights.sugar.pct > 0 ? '+' : ''}${trendInsights.sugar.pct}%` : 'Balanced'}</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                {trendInsights.sugar.text}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 mt-1 border-t border-slate-100 pt-1.5">
              {trendInsights.sugar.subtitle}
            </p>
          </div>

          {/* Card 4: Oxygen & Safety Trend */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-sky-600" />
                  <span>Oxygen &amp; Safety</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 bg-sky-100 text-sky-800 flex items-center gap-0.5">
                  <Check size={11} />
                  <span>Target Range</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                {trendInsights.spo2.text}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 mt-1 border-t border-slate-100 pt-1.5">
              {trendInsights.spo2.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Line Chart Canvas */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-4 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <span>📈 Health Trend Curve</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 border border-slate-900 px-2 py-0.5 rounded-full">
              {filteredData.length} records analyzed
            </span>
          </h3>

          {/* Direct Quick Download Trigger */}
          <button
            onClick={handleDownloadTextReport}
            className="self-start sm:self-auto text-xs font-extrabold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-xl border border-slate-900 shadow-[1px_1px_0px_0px_#000] cursor-pointer"
          >
            <FileDown size={14} />
            <span>Quick Export .TXT</span>
          </button>
        </div>

        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }}
                tickFormatter={(val, idx) => {
                  const item = filteredData[idx];
                  return item ? `${item.date.slice(5)} ${item.time || ''}` : val;
                }}
              />
              <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} domain={['auto', 'auto']} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data: VitalsRecord = payload[0].payload;
                    return (
                      <div className="bg-white border-3 border-slate-900 p-3.5 rounded-2xl shadow-[4px_4px_0px_0px_#000] text-xs font-bold space-y-1 z-50">
                        <div className="text-slate-900 font-black border-b border-slate-200 pb-1 flex items-center justify-between gap-3">
                          <span>🗓️ {data.date} {data.time}</span>
                          <span className="text-[10px] bg-yellow-200 px-1.5 py-0.5 rounded border border-slate-900">
                            {data.tag}
                          </span>
                        </div>
                        <div className="text-purple-700">🩺 BP: {data.sys}/{data.dia} mmHg</div>
                        <div className="text-red-600">💓 Pulse: {data.pulse} BPM</div>
                        <div className="text-sky-600">🫁 SpO2: {data.spo2}%</div>
                        <div className="text-emerald-600">🩸 Sugar: {data.bloodSugar} mg/dL</div>
                        <div className="text-orange-600">🌡️ Temp: {data.temperature}°C</div>
                        {data.isAbnormal && (
                          <div className="mt-2 pt-1 border-t border-red-200 text-red-600 font-extrabold flex items-start gap-1">
                            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                            <span>Warning: {(data.anomalyReasons || []).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 800 }} />

              {/* Reference Lines for Thresholds */}
              <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High SYS (140)', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Low SYS / High DIA (90)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />

              {(metricView === 'all' || metricView === 'bp') && (
                <>
                  <Line
                    type="monotone"
                    dataKey="sys"
                    name="SYS BP (mmHg)"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={(props) => renderAnomalyDot(props, 'sys')}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dia"
                    name="DIA BP (mmHg)"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    strokeDasharray="4 2"
                    dot={(props) => renderAnomalyDot(props, 'dia')}
                  />
                </>
              )}

              {(metricView === 'all' || metricView === 'pulse') && (
                <Line
                  type="monotone"
                  dataKey="pulse"
                  name="Pulse (BPM)"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={(props) => renderAnomalyDot(props, 'pulse')}
                />
              )}

              {(metricView === 'all' || metricView === 'spo2') && (
                <Line
                  type="monotone"
                  dataKey="spo2"
                  name="SpO2 (%)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={(props) => renderAnomalyDot(props, 'spo2')}
                />
              )}

              {(metricView === 'all' || metricView === 'bloodsugar') && (
                <Line
                  type="monotone"
                  dataKey="bloodSugar"
                  name="Blood Sugar (mg/dL)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={(props) => renderAnomalyDot(props, 'bloodSugar')}
                />
              )}

              {(metricView === 'all' || metricView === 'temp') && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Body Temp (°C)"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={(props) => renderAnomalyDot(props, 'temperature')}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#fef9c3] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Avg Blood Pressure</span>
          <div className="text-lg font-black text-slate-900 mt-1">{stats.avgSys}/{stats.avgDia}</div>
          <span className="text-[10px] font-bold text-slate-600">mmHg</span>
        </div>

        <div className="bg-[#fee2e2] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Avg Pulse Rate</span>
          <div className="text-lg font-black text-slate-900 mt-1">{stats.avgPulse}</div>
          <span className="text-[10px] font-bold text-slate-600">BPM</span>
        </div>

        <div className="bg-[#e0f2fe] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Avg SpO2 Level</span>
          <div className="text-lg font-black text-slate-900 mt-1">{stats.avgSpo2}%</div>
          <span className="text-[10px] font-bold text-slate-600">Oxygen</span>
        </div>

        <div className="bg-[#dcfce7] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Avg Blood Sugar</span>
          <div className="text-lg font-black text-slate-900 mt-1">{stats.avgSugar}</div>
          <span className="text-[10px] font-bold text-slate-600">mg/dL</span>
        </div>

        <div className="bg-[#fae8ff] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Avg Body Temp</span>
          <div className="text-lg font-black text-slate-900 mt-1">{stats.avgTemp}°C</div>
          <span className="text-[10px] font-bold text-slate-600">Temperature</span>
        </div>

        <div className="bg-[#fee2e2] border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-red-600">Alert Triggers</span>
          <div className="text-lg font-black text-red-600 mt-1">{stats.anomaliesCount}</div>
          <span className="text-[10px] font-bold text-slate-600">breaches detected</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DOWNLOAD HEALTH SUMMARY MODAL & PREVIEW DIALOG                           */}
      {/* ========================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white border-3 border-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#000] overflow-hidden animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-purple-100 border-b-3 border-slate-900 p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      Download Health Summary
                    </h3>
                    <span className="bg-yellow-300 border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                      PDF &amp; TXT Ready ✨
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    Export your latest vitals and {timeFilter.toUpperCase()} historical trend telemetry from Cloud Firestore.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-red-100 border-2 border-slate-900 flex items-center justify-center text-slate-800 hover:text-red-700 shadow-[1px_1px_0px_0px_#000] transition-colors cursor-pointer"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-50 border-b-2 border-slate-900 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setReportTab('styled')}
                  className={`px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-extrabold transition-all cursor-pointer ${
                    reportTab === 'styled'
                      ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📄 Medical PDF / Preview
                </button>
                <button
                  onClick={() => setReportTab('text')}
                  className={`px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-extrabold transition-all cursor-pointer ${
                    reportTab === 'text'
                      ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📝 Plaintext Report (.txt)
                </button>
                <button
                  onClick={() => setReportTab('csv')}
                  className={`px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-extrabold transition-all cursor-pointer ${
                    reportTab === 'csv'
                      ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📊 Data Table (.csv)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="bg-white hover:bg-purple-50 text-slate-800 border-2 border-slate-900 px-2.5 py-1 rounded-xl text-xs font-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                  title="Copy formatted summary to clipboard"
                >
                  {copiedNotification ? (
                    <>
                      <Check size={13} className="text-green-600" />
                      <span className="text-green-700 font-extrabold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Preview Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50 space-y-4">
              {reportTab === 'styled' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Patient Banner */}
                  <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] overflow-hidden flex items-center justify-center font-black text-purple-900 text-lg">
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Patient" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span>{user?.fullName?.slice(0, 2) || 'BL'}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-slate-900">{user?.fullName || 'Becky Lam'}</h4>
                            <span className="bg-emerald-200 border border-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                              Active Tracked
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">
                            DOB: {user?.dob || '2004-02-14'} ({userAge} yrs) • {user?.gender || 'Female'} • {user?.phone || '+84 90 123 4567'}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right text-xs font-semibold text-slate-600 bg-purple-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                        <div>Report Window: <strong className="text-purple-700">{timeFilter.toUpperCase()}</strong></div>
                        <div>Anomalies Flagged: <strong className="text-red-600">{stats.anomaliesCount}</strong></div>
                      </div>
                    </div>

                    {/* Allergies and Emergency Contact pills */}
                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                      <div className="bg-pink-50 border border-slate-900 rounded-xl p-2">
                        <span className="text-pink-700 font-extrabold uppercase text-[10px] block">Emergency Contact:</span>
                        <div className="text-slate-900">{user?.emergencyContact?.name || 'Thao Lam'} ({user?.emergencyContact?.relationship || 'Mother'})</div>
                        <div className="text-slate-600 text-[11px]">{user?.emergencyContact?.phone || '+84 91 999 8888'}</div>
                      </div>

                      <div className="bg-amber-50 border border-slate-900 rounded-xl p-2">
                        <span className="text-amber-800 font-extrabold uppercase text-[10px] block">Known Allergies:</span>
                        <div className="text-slate-800 text-[11px]">
                          <strong>Meds:</strong> {user?.knownAllergies?.medications || 'Penicillin (Rash)'} | <strong>Food:</strong> {user?.knownAllergies?.food || 'Shellfish'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Vitals Highlight */}
                  {latestVital && (
                    <div className="bg-[#faf5ff] border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase text-purple-900 flex items-center gap-1.5">
                          <Activity size={15} />
                          <span>Latest Recorded Vitals ({latestVital.date} at {latestVital.time || '12:00'})</span>
                        </span>
                        <span className="text-[10px] bg-white border border-slate-900 px-2 py-0.5 rounded-md font-bold">
                          Tag: {latestVital.tag || 'Routine'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        <div className="bg-white border border-slate-900 rounded-xl p-2">
                          <span className="text-[10px] font-bold text-slate-500 block">BP (mmHg)</span>
                          <span className="text-base font-black text-purple-700">{latestVital.sys}/{latestVital.dia}</span>
                        </div>
                        <div className="bg-white border border-slate-900 rounded-xl p-2">
                          <span className="text-[10px] font-bold text-slate-500 block">Pulse</span>
                          <span className="text-base font-black text-red-600">{latestVital.pulse} <span className="text-[10px]">BPM</span></span>
                        </div>
                        <div className="bg-white border border-slate-900 rounded-xl p-2">
                          <span className="text-[10px] font-bold text-slate-500 block">SpO2 Oxygen</span>
                          <span className="text-base font-black text-sky-600">{latestVital.spo2}%</span>
                        </div>
                        <div className="bg-white border border-slate-900 rounded-xl p-2">
                          <span className="text-[10px] font-bold text-slate-500 block">Blood Sugar</span>
                          <span className="text-base font-black text-emerald-600">{latestVital.bloodSugar} <span className="text-[10px]">mg/dL</span></span>
                        </div>
                        <div className="bg-white border border-slate-900 rounded-xl p-2 col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold text-slate-500 block">Body Temp</span>
                          <span className="text-base font-black text-orange-600">{latestVital.temperature}°C</span>
                        </div>
                      </div>

                      {latestVital.isAbnormal && (
                        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 text-xs font-bold p-2 rounded-xl flex items-center gap-2">
                          <AlertTriangle size={14} className="shrink-0" />
                          <span>Flagged: {(latestVital.anomalyReasons || []).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Period Statistics Summary */}
                  <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000] space-y-2">
                    <span className="text-xs font-black uppercase text-slate-700 block">
                      Historical Aggregates ({filteredData.length} entries analyzed)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="bg-yellow-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-500">Avg Blood Pressure</span>
                        <div className="text-base font-black text-slate-900">{stats.avgSys}/{stats.avgDia} mmHg</div>
                      </div>
                      <div className="bg-red-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-500">Avg Pulse Rate</span>
                        <div className="text-base font-black text-red-700">{stats.avgPulse} BPM</div>
                      </div>
                      <div className="bg-sky-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-500">Avg SpO2 Oxygen</span>
                        <div className="text-base font-black text-sky-700">{stats.avgSpo2}%</div>
                      </div>
                      <div className="bg-emerald-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-500">Avg Blood Sugar</span>
                        <div className="text-base font-black text-emerald-700">{stats.avgSugar} mg/dL</div>
                      </div>
                      <div className="bg-purple-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-slate-500">Avg Temperature</span>
                        <div className="text-base font-black text-purple-700">{stats.avgTemp} °C</div>
                      </div>
                      <div className="bg-rose-50 border border-slate-900 rounded-xl p-2 text-center">
                        <span className="text-[10px] font-bold text-red-600">Red Flag Breaches</span>
                        <div className="text-base font-black text-red-700">{stats.anomaliesCount} alerts</div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Historical Table */}
                  <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000] overflow-x-auto">
                    <span className="text-xs font-black uppercase text-slate-700 block mb-2">
                      Recent Entry Telemetry
                    </span>
                    <table className="w-full text-left text-xs font-bold">
                      <thead>
                        <tr className="border-b-2 border-slate-900 text-slate-600 text-[10px] uppercase">
                          <th className="pb-1.5">Date & Time</th>
                          <th className="pb-1.5">BP</th>
                          <th className="pb-1.5">Pulse</th>
                          <th className="pb-1.5">SpO2</th>
                          <th className="pb-1.5">Sugar</th>
                          <th className="pb-1.5">Temp</th>
                          <th className="pb-1.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredData.slice(-6).map((d) => (
                          <tr key={d.id} className={d.isAbnormal ? 'bg-red-50 text-red-900' : 'text-slate-800'}>
                            <td className="py-1.5 whitespace-nowrap">{d.date} <span className="text-[10px] text-slate-500">{d.time || ''}</span></td>
                            <td className="py-1.5 font-black">{d.sys}/{d.dia}</td>
                            <td className="py-1.5">{d.pulse}</td>
                            <td className="py-1.5">{d.spo2}%</td>
                            <td className="py-1.5">{d.bloodSugar}</td>
                            <td className="py-1.5">{d.temperature}°C</td>
                            <td className="py-1.5">
                              {d.isAbnormal ? (
                                <span className="bg-red-200 border border-red-400 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-black">
                                  ALERT
                                </span>
                              ) : (
                                <span className="text-emerald-700 text-[10px] font-extrabold">Normal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {reportTab === 'text' && (
                <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {generatedTextReport}
                </div>
              )}

              {reportTab === 'csv' && (
                <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700">Comma Separated Values Format</span>
                    <button
                      onClick={handleDownloadCsv}
                      className="text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 border border-slate-900 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download .CSV</span>
                    </button>
                  </div>
                  <div className="bg-slate-100 font-mono text-[11px] p-3 rounded-xl border border-slate-300 text-slate-800 overflow-x-auto whitespace-pre max-h-64 select-all">
                    {generatedCsv}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer: Action Triggers */}
            <div className="bg-white border-t-3 border-slate-900 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs font-bold text-slate-500">
                Ready to share with your physician or save to your device.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrintPdf}
                  className="bg-pink-300 hover:bg-pink-400 text-slate-900 border-2 border-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  id="modal-btn-download-txt"
                  onClick={handleDownloadTextReport}
                  disabled={isDownloading}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download size={15} />
                  <span>{isDownloading ? 'Generating...' : 'Download .TXT Report'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
