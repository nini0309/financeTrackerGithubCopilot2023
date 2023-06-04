function generateReportContent() {
  const transactions = Transaction.all;
  const balance = Transaction.total();
  const incomes = Transaction.incomes();
  const expenses = Transaction.expenses();

  const transactionsHTML = transactions.map((transaction) => {
    return `
      <tr>
        <td>${transaction.description}</td>
        <td>${Utils.formatCurrency(transaction.amount)}</td>
        <td>${transaction.date}</td>
      </tr>
    `;
  }).join('');

  const reportHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Transaction Report</title>
  </head>
  <body style="font-family: Arial, sans-serif; padding: 10px;">
    <h1 style="text-align: center; font-size: 20px; color: #336699; page-break-after: avoid; margin: 0;">Transaction Report</h1>
    <br>
    <div class="balance" style="color: #336699;">
      <h3 style="text-align: center; font-size: 14px; color: #336699; margin: 0;">Balance: ${Utils.formatCurrency(balance)}</h3>
    </div>
    <br>
    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
      <tr>
        <th style="padding: 5px; text-align: left; font-size: 12px; color: green;">Income</th>
        <th style="padding: 5px; text-align: left; font-size: 12px; color: red;">Expense</th>
      </tr>
      <tr>
        <td style="padding: 5px; text-align: left; font-size: 12px;">${Utils.formatCurrency(incomes)}</td>
        <td style="padding: 5px; text-align: left; font-size: 12px;">${Utils.formatCurrency(expenses)}</td>
      </tr>
    </table>
    <br>
    <h3 style="color: #336699; font-size: 12px; margin: 0;">Transactions:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="padding: 5px; text-align: left; font-size: 12px; color: #336699;">Description</th>
        <th style="padding: 5px; text-align: left; font-size: 12px; color: #336699;">Amount</th>
        <th style="padding: 5px; text-align: left; font-size: 12px; color: #336699;">Date</th>
      </tr>
      ${transactionsHTML}
    </table>
  </body>
  </html>
  
  
  
  
  `;

  return reportHTML;
}


async function downloadPDF() {
  const reportContent = generateReportContent();
  const pdfContent = await generatePDFContent(reportContent);
  downloadPDFFile(pdfContent);
}


async function generatePDFContent(content) {
  const jsPDF = await import('https://cdn.skypack.dev/jspdf@2.4.0');
  const doc = new jsPDF.default();

  await doc.html(content, {
    callback: function (doc) {
      return doc.output();
    }
  });

  return doc.output('blob');
}


function downloadPDFFile(pdfContent) {
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transaction_report.pdf';
  link.click();
  URL.revokeObjectURL(url);
}

document.getElementById('generate-report').addEventListener('click', downloadPDF);