import React, { useMemo } from 'react';
import { Colors, DownloadIcon, PlusIcon, EditIcon, DeleteIcon, formatDate } from '../UtilsAndComponents';

const FinancePage = ({ tripData, settings, onAddIndependentExpense, onEditExpense, onDeleteExpense }) => {
    const allExpenses = useMemo(() => {
        const activityExpenses = [];
        tripData.days.forEach(day => {
            day.activities.forEach(act => {
                if (act.expenses) {
                    act.expenses.forEach(exp => {
                        activityExpenses.push({
                            ...exp,
                            date: day.date,
                            activityName: act.name,
                            source: 'activity',
                            dayIndex: day.index,
                            activityId: act.id
                        });
                    });
                }
            });
        });

        const independent = (tripData.independentExpenses || []).map(exp => ({
            ...exp,
            source: 'independent'
        }));

        return [...activityExpenses, ...independent].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [tripData]);

    const totalsByCurrency = useMemo(() => {
        const totals = {};
        allExpenses.forEach(exp => {
            totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
        });
        return totals;
    }, [allExpenses]);

    const settlements = useMemo(() => {
        const result = {};

        settings.currencies.forEach(({ code }) => {
            const expensesInCurrency = allExpenses.filter(e => e.currency === code);
            if (expensesInCurrency.length === 0) return;

            const total = expensesInCurrency.reduce((sum, e) => sum + e.amount, 0);
            const perPerson = total / settings.familyMembers.length;

            const balances = {};
            settings.familyMembers.forEach(member => {
                const paid = expensesInCurrency
                    .filter(e => e.payer === member)
                    .reduce((sum, e) => sum + e.amount, 0);
                balances[member] = paid - perPerson;
            });

            const debtors = Object.entries(balances).filter(([_, bal]) => bal < 0).sort((a, b) => a[1] - b[1]);
            const creditors = Object.entries(balances).filter(([_, bal]) => bal > 0).sort((a, b) => b[1] - a[1]);

            const transactions = [];
            let i = 0, j = 0;
            while (i < debtors.length && j < creditors.length) {
                const [debtor, debtAmount] = debtors[i];
                const [creditor, creditAmount] = creditors[j];
                const amount = Math.min(-debtAmount, creditAmount);

                if (amount > 0.01) {
                    transactions.push({ from: debtor, to: creditor, amount });
                }

                debtors[i][1] += amount;
                creditors[j][1] -= amount;

                if (Math.abs(debtors[i][1]) < 0.01) i++;
                if (Math.abs(creditors[j][1]) < 0.01) j++;
            }

            result[code] = { total, perPerson, transactions };
        });

        return result;
    }, [allExpenses, settings]);

    const handleExportPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('請允許開啟彈出視窗以匯出 PDF');
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>財務報表 - ${new Date().toLocaleDateString()}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        h1 { text-align: center; color: #333; margin-bottom: 30px; }
                        h2 { border-bottom: 2px solid #666; padding-bottom: 10px; margin-top: 30px; font-size: 18px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { bg-color: #f2f2f2; font-weight: bold; background-color: #eee; }
                        .amount { text-align: right; font-family: 'Courier New', monospace; }
                        .summary-box { display: flex; gap: 20px; margin-bottom: 20px; }
                        .summary-item { border: 1px solid #ddd; padding: 15px; border-radius: 8px; flex: 1; text-align: center; }
                        .summary-amount { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <h1>旅行財務報表</h1>
                    
                    <h2>1. 總花費匯總</h2>
                    <div class="summary-box">
                        ${Object.entries(totalsByCurrency).map(([currency, total]) => `
                            <div class="summary-item">
                                <div class="summary-amount">${total.toFixed(currency === 'TWD' ? 0 : 2)} ${currency}</div>
                            </div>
                        `).join('')}
                    </div>

                    <h2>2. 分帳結算</h2>
                    ${Object.entries(settlements).map(([currency, data]) => `
                        <h3>${currency} (每人應付: ${data.perPerson.toFixed(2)})</h3>
                        <table>
                            <thead>
                                <tr><th>付款人</th><th>收款人</th><th class="amount">金額 (${currency})</th></tr>
                            </thead>
                            <tbody>
                                ${data.transactions.length > 0 ? data.transactions.map(t => `
                                    <tr>
                                        <td>${t.from}</td>
                                        <td>${t.to}</td>
                                        <td class="amount">${t.amount.toFixed(2)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="3" style="text-align:center">無需結算</td></tr>'}
                            </tbody>
                        </table>
                    `).join('')}

                    <h2>3. 詳細花費列表</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>項目</th>
                                <th>類別</th>
                                <th>付款人</th>
                                <th class="amount">金額</th>
                                <th>幣別</th>
                                <th>備註</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allExpenses.map(exp => `
                                <tr>
                                    <td>${new Date(exp.date).toLocaleDateString()}</td>
                                    <td>${exp.description} ${exp.activityName ? `(${exp.activityName})` : ''}</td>
                                    <td>${exp.category || '-'}</td>
                                    <td>${exp.payer}</td>
                                    <td class="amount">${exp.amount}</td>
                                    <td>${exp.currency}</td>
                                    <td>${exp.note || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        產生時間: ${new Date().toLocaleString()}
                    </div>
                    
                    <script>
                        window.onload = () => { window.print(); };
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
            <h2 className={`text-2xl font-bold ${Colors.TEXT_PRIMARY} mb-4`}>財務總覽</h2>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} mb-3`}>總花費</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(totalsByCurrency).map(([currency, total]) => (
                        <div key={currency} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-3 text-center`}>
                            <div className={`text-2xl font-bold ${currency === 'EUR' ? 'text-emerald-400' :
                                currency === 'TWD' ? 'text-blue-400' :
                                    Colors.TEXT_PRIMARY
                                }`}>
                                {total.toFixed(currency === 'TWD' ? 0 : 2)}
                            </div>
                            <div className={`text-sm ${Colors.TEXT_MUTED}`}>{currency}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>結算明細</h3>
                    <button onClick={handleExportPDF} className={`px-3 py-1.5 rounded-lg ${Colors.BTN_PRIMARY} text-sm`}>
                        <DownloadIcon className="w-4 h-4 inline mr-1" /> 匯出
                    </button>
                </div>

                {Object.entries(settlements).map(([currency, data]) => (
                    <div key={currency} className="mb-4 last:mb-0">
                        <div className={`font-bold ${Colors.TEXT_PRIMARY} mb-2`}>{currency} 結算</div>
                        <div className={`text-sm ${Colors.TEXT_SECONDARY} mb-2`}>
                            每人應付: {data.perPerson.toFixed(currency === 'TWD' ? 0 : 2)} {currency}
                        </div>
                        <div className="space-y-1">
                            {data.transactions.map((t, i) => (
                                <div key={i} className={`text-sm ${Colors.TEXT_PRIMARY} bg-white/5 rounded px-2 py-1`}>
                                    {t.from} → {t.to}: {t.amount.toFixed(currency === 'TWD' ? 0 : 2)} {currency}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>所有花費</h3>
                    <button onClick={onAddIndependentExpense} className={`px-3 py-1.5 rounded-lg ${Colors.BTN_ACCENT} text-sm`}>
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增獨立花費
                    </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allExpenses.map(exp => (
                        <div key={exp.id} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-3`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className={`font-semibold ${Colors.TEXT_PRIMARY}`}>{exp.description}</div>
                                    <div className={`text-xs ${Colors.TEXT_MUTED} mt-1`}>
                                        {formatDate(exp.date)} • {exp.payer} • {exp.category}
                                        {exp.activityName && ` • ${exp.activityName}`}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`font-bold text-lg ${exp.currency === 'EUR' ? 'text-emerald-400' :
                                        exp.currency === 'TWD' ? 'text-blue-400' :
                                            Colors.TEXT_PRIMARY
                                        }`}>
                                        {exp.amount} {exp.currency}
                                    </div>
                                    <button onClick={() => onEditExpense(exp)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDeleteExpense(exp)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-600`}>
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinancePage;
