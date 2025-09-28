// Main Application Logic

class MarketingMetricsApp {
    constructor() {
        this.selectedCompany = 'all';
        this.selectedPeriod = 'realtime';
        this.selectedCategory = 'overview';
        this.charts = {};
        this.updateInterval = null;

        this.init();
    }

    init() {
        // Initialize event listeners
        this.setupEventListeners();

        // Initialize charts
        this.initializeCharts();

        // Start real-time updates
        this.startRealtimeUpdates();

        // Initial data load
        this.updateDashboard();

        // Set current date/time
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    setupEventListeners() {
        // Company selector
        document.getElementById('companySelector').addEventListener('change', (e) => {
            this.selectedCompany = e.target.value;
            this.updateDashboard();
        });

        // Period selector
        document.getElementById('periodSelector').addEventListener('change', (e) => {
            this.selectedPeriod = e.target.value;
            this.updateDashboard();
        });

        // Category buttons
        document.querySelectorAll('#metrics-tab .nav-link').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('#metrics-tab .nav-link').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.selectedCategory = e.currentTarget.dataset.category;
                this.updateDashboard();
            });
        });

        // Date inputs
        document.getElementById('startDate').addEventListener('change', () => this.updateDashboard());
        document.getElementById('endDate').addEventListener('change', () => this.updateDashboard());

        // Listen for data updates
        window.addEventListener('dataUpdate', (e) => {
            if (this.selectedPeriod === 'realtime') {
                this.updateRealtimeData();
            }
        });
    }

    initializeCharts() {
        // Main time series chart
        const mainCtx = document.getElementById('mainChart').getContext('2d');
        this.charts.main = new Chart(mainCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('pt-PT');
                            }
                        }
                    }
                }
            }
        });

        // Market share pie chart
        const marketCtx = document.getElementById('marketShareChart').getContext('2d');
        this.charts.marketShare = new Chart(marketCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });

        // Digital metrics radar chart
        const digitalCtx = document.getElementById('digitalChart').getContext('2d');
        this.charts.digital = new Chart(digitalCtx, {
            type: 'radar',
            data: {
                labels: ['CTR', 'Conversão', 'Engajamento', 'Retenção', 'ROAS'],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateDashboard() {
        if (this.selectedPeriod === 'realtime') {
            this.updateRealtimeData();
        } else {
            this.updateHistoricalData();
        }

        this.updateMetricsTable();
        this.updateCompetitorAnalysis();
    }

    updateRealtimeData() {
        const data = this.selectedCompany === 'all'
            ? dataGenerator.getRealtimeData('all')
            : { [this.selectedCompany]: dataGenerator.getRealtimeData(this.selectedCompany) };

        // Update KPI cards
        this.updateKPICards(data);

        // Update charts with real-time data
        this.updateChartsRealtime(data);

        // Update last update time
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('pt-PT');
    }

    updateHistoricalData() {
        const period = this.getPeriodMapping();
        const { startDate, endDate } = this.getDateRange();

        const data = {};
        const companies = this.selectedCompany === 'all'
            ? dataGenerator.getAllCompanies().map(c => c.id)
            : [this.selectedCompany];

        companies.forEach(companyId => {
            data[companyId] = dataGenerator.getHistoricalData(
                companyId,
                period,
                startDate,
                endDate
            );
        });

        // Update charts with historical data
        this.updateChartsHistorical(data);

        // Update KPIs with aggregated data
        this.updateKPICardsHistorical(data);
    }

    updateKPICards(data) {
        let totalSales = 0;
        let totalROI = 0;
        let totalMarketShare = 0;
        let totalCustomers = 0;
        let count = 0;

        Object.values(data).forEach(companyData => {
            if (companyData) {
                totalSales += companyData.revenue || 0;
                totalROI += parseFloat(companyData.roi || 0);
                totalMarketShare += parseFloat(companyData.marketShare || 0);
                totalCustomers += companyData.totalCustomers || 0;
                count++;
            }
        });

        // Update KPI values
        document.getElementById('totalSales').textContent = this.formatCurrency(totalSales);
        document.getElementById('roiMarketing').textContent = count > 0 ? (totalROI / count).toFixed(1) + '%' : '0%';
        document.getElementById('marketShare').textContent = totalMarketShare.toFixed(1) + '%';
        document.getElementById('activeCustomers').textContent = this.formatNumber(totalCustomers);

        // Update trend indicators (simulated)
        this.updateTrendIndicators();
    }

    updateKPICardsHistorical(data) {
        let totalSales = 0;
        let avgROI = 0;
        let avgMarketShare = 0;
        let totalCustomers = 0;
        let dataPoints = 0;

        Object.values(data).forEach(companyData => {
            if (companyData && companyData.length > 0) {
                const latestPeriod = companyData[companyData.length - 1];
                totalSales += latestPeriod.revenue || 0;
                avgROI += parseFloat(latestPeriod.roi || 0);
                avgMarketShare += parseFloat(latestPeriod.marketShare || 0);
                totalCustomers += latestPeriod.totalCustomers || 0;
                dataPoints++;
            }
        });

        // Update KPI values
        document.getElementById('totalSales').textContent = this.formatCurrency(totalSales);
        document.getElementById('roiMarketing').textContent = dataPoints > 0 ? (avgROI / dataPoints).toFixed(1) + '%' : '0%';
        document.getElementById('marketShare').textContent = avgMarketShare.toFixed(1) + '%';
        document.getElementById('activeCustomers').textContent = this.formatNumber(totalCustomers);

        this.updateTrendIndicators();
    }

    updateTrendIndicators() {
        // Simulate trend indicators
        const trends = ['salesGrowth', 'roiChange', 'shareChange', 'customersGrowth'];
        trends.forEach(trend => {
            const element = document.getElementById(trend);
            const value = (Math.random() * 20 - 5).toFixed(1);
            element.textContent = value + '%';

            const parent = element.parentElement;
            parent.className = parseFloat(value) >= 0 ? 'text-success' : 'text-danger';
            parent.querySelector('i').className = parseFloat(value) >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
        });
    }

    updateChartsRealtime(data) {
        // Update main chart with revenue trends
        const labels = [];
        const datasets = [];

        Object.entries(data).forEach(([companyId, companyData]) => {
            if (companyData) {
                const company = dataGenerator.getCompanyInfo(companyId);
                if (company) {
                    // Get last 24 hours of data for trend
                    const historicalData = dataGenerator.getHistoricalData(companyId, 'daily');
                    const last24Hours = historicalData.slice(-24);

                    if (datasets.length === 0) {
                        labels.push(...last24Hours.map(d => new Date(d.date).toLocaleDateString('pt-PT')));
                    }

                    datasets.push({
                        label: company.name,
                        data: last24Hours.map(d => d.revenue),
                        borderColor: this.getCompanyColor(companyId),
                        tension: 0.1
                    });
                }
            }
        });

        this.charts.main.data.labels = labels;
        this.charts.main.data.datasets = datasets;
        this.charts.main.update();

        // Update market share chart
        this.updateMarketShareChart(data);

        // Update digital metrics chart
        this.updateDigitalChart(data);
    }

    updateChartsHistorical(data) {
        const labels = [];
        const datasets = [];

        Object.entries(data).forEach(([companyId, periods]) => {
            if (periods && periods.length > 0) {
                const company = dataGenerator.getCompanyInfo(companyId);
                if (company) {
                    if (datasets.length === 0) {
                        labels.push(...periods.map(p => p.period || p.date));
                    }

                    datasets.push({
                        label: company.name,
                        data: periods.map(p => p.revenue),
                        borderColor: this.getCompanyColor(companyId),
                        tension: 0.1
                    });
                }
            }
        });

        this.charts.main.data.labels = labels;
        this.charts.main.data.datasets = datasets;
        this.charts.main.update();

        // Update other charts
        const latestData = {};
        Object.entries(data).forEach(([companyId, periods]) => {
            if (periods && periods.length > 0) {
                latestData[companyId] = periods[periods.length - 1];
            }
        });

        this.updateMarketShareChart(latestData);
        this.updateDigitalChart(latestData);
    }

    updateMarketShareChart(data) {
        const labels = [];
        const values = [];

        Object.entries(data).forEach(([companyId, companyData]) => {
            if (companyData) {
                const company = dataGenerator.getCompanyInfo(companyId);
                if (company) {
                    labels.push(company.name);
                    values.push(parseFloat(companyData.marketShare || 0));
                }
            }
        });

        this.charts.marketShare.data.labels = labels;
        this.charts.marketShare.data.datasets[0].data = values;
        this.charts.marketShare.update();
    }

    updateDigitalChart(data) {
        const datasets = [];

        Object.entries(data).forEach(([companyId, companyData]) => {
            if (companyData) {
                const company = dataGenerator.getCompanyInfo(companyId);
                if (company) {
                    datasets.push({
                        label: company.name,
                        data: [
                            parseFloat(companyData.conversionRate || 0) * 10, // Scale for visibility
                            parseFloat(companyData.conversionRate || 0),
                            parseFloat(companyData.socialEngagement || 0) * 10,
                            parseFloat(companyData.retentionRate || 0),
                            Math.min(100, parseFloat(companyData.roi || 0))
                        ],
                        borderColor: this.getCompanyColor(companyId),
                        backgroundColor: this.getCompanyColor(companyId) + '33'
                    });
                }
            }
        });

        this.charts.digital.data.datasets = datasets;
        this.charts.digital.update();
    }

    updateMetricsTable() {
        const tableContainer = document.getElementById('metricsTable');
        let html = '';

        const data = this.selectedCompany === 'all'
            ? dataGenerator.getRealtimeData('all')
            : { [this.selectedCompany]: dataGenerator.getRealtimeData(this.selectedCompany) };

        Object.entries(data).forEach(([companyId, companyData]) => {
            if (companyData) {
                const company = dataGenerator.getCompanyInfo(companyId);
                const metrics = metricsCalculator.calculateAllMetrics(companyData);

                html += `<div class="mb-4">`;
                if (this.selectedCompany === 'all') {
                    html += `<h6 class="text-primary mb-3">${company.name}</h6>`;
                }

                // Filter metrics by selected category
                const categoryMetrics = this.filterMetricsByCategory(metrics);

                Object.entries(categoryMetrics).forEach(([metricKey, metricValue]) => {
                    const metricInfo = metricsCalculator.getMetricInfo(metricKey);
                    const formattedValue = metricsCalculator.formatMetric(metricValue, metricInfo.type);

                    html += `
                        <div class="metric-row">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="metric-name">${metricInfo.label}</span>
                                <span class="metric-value">${formattedValue}</span>
                            </div>
                            <div class="progress mt-2" style="height: 4px;">
                                <div class="progress-bar" style="width: ${this.getMetricProgress(metricKey, metricValue)}%"></div>
                            </div>
                        </div>
                    `;
                });

                html += `</div>`;
            }
        });

        tableContainer.innerHTML = html || '<p class="text-muted">Sem dados disponíveis</p>';
    }

    updateCompetitorAnalysis() {
        if (this.selectedCompany === 'all') {
            document.getElementById('competitorAnalysis').innerHTML =
                '<p class="text-muted">Selecione uma empresa para ver análise competitiva</p>';
            return;
        }

        const analysis = dataGenerator.getCompetitiveAnalysis(this.selectedCompany);
        let html = '';

        analysis.forEach(competitor => {
            const marketShareDiff = parseFloat(competitor.comparison.marketShare);
            const revenueDiff = parseFloat(competitor.comparison.revenue);

            html += `
                <div class="competitor-item">
                    <div class="competitor-name">${competitor.name}</div>
                    <div class="competitor-metrics">
                        <div>
                            <small class="text-muted">Quota</small><br>
                            <strong>${competitor.marketShare}%</strong>
                            <span class="${marketShareDiff >= 0 ? 'text-success' : 'text-danger'} ms-2">
                                ${marketShareDiff >= 0 ? '+' : ''}${marketShareDiff}%
                            </span>
                        </div>
                        <div>
                            <small class="text-muted">Receita</small><br>
                            <strong>€${(competitor.revenue / 1000).toFixed(0)}K</strong>
                            <span class="${revenueDiff >= 0 ? 'text-success' : 'text-danger'} ms-2">
                                ${revenueDiff >= 0 ? '+' : ''}${revenueDiff}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('competitorAnalysis').innerHTML = html || '<p class="text-muted">Sem dados de competidores</p>';
    }

    filterMetricsByCategory(metrics) {
        if (this.selectedCategory === 'overview') {
            // Show key metrics from all categories
            return {
                roiMarketing: metrics.roiMarketing,
                quotaMercado: metrics.quotaMercado,
                taxaRetencao: metrics.taxaRetencao,
                taxaConversaoVendas: metrics.taxaConversaoVendas,
                nps: metrics.nps,
                visitasWebsite: metrics.visitasWebsite
            };
        }

        const categoryMap = {
            financial: ['marginPercentual', 'ros', 'roiMarketing', 'markup'],
            customers: ['taxaRetencao', 'taxaAbandono', 'cac', 'ltv', 'ltvCacRatio', 'nps'],
            market: ['quotaMercado', 'crescimentoMercado'],
            sales: ['taxaConversaoVendas', 'tamanhoDealMedio', 'cicloVendas', 'taxaVitoria'],
            product: ['satisfacaoCliente', 'adocaoProduto', 'usoFeatures'],
            digital: ['visitasWebsite', 'taxaRejeicao', 'paginasPorSessao', 'duracaoMediaSessao', 'engajamentoSocial']
        };

        const selectedMetrics = categoryMap[this.selectedCategory] || [];
        const filtered = {};

        selectedMetrics.forEach(key => {
            if (metrics[key] !== undefined) {
                filtered[key] = metrics[key];
            }
        });

        return filtered;
    }

    getMetricProgress(metricKey, value) {
        // Calculate progress bar width based on metric type and value
        const progressMap = {
            roiMarketing: Math.min(100, Math.max(0, (parseFloat(value) + 50) / 2)),
            taxaRetencao: parseFloat(value),
            taxaConversaoVendas: Math.min(100, parseFloat(value) * 10),
            quotaMercado: Math.min(100, parseFloat(value) * 2),
            nps: Math.min(100, Math.max(0, (parseFloat(value) + 100) / 2))
        };

        return progressMap[metricKey] || Math.min(100, Math.random() * 80 + 20);
    }

    getPeriodMapping() {
        const mapping = {
            today: 'daily',
            week: 'daily',
            month: 'daily',
            quarter: 'monthly',
            year: 'monthly',
            '2years': 'monthly'
        };

        return mapping[this.selectedPeriod] || 'daily';
    }

    getDateRange() {
        const customStart = document.getElementById('startDate').value;
        const customEnd = document.getElementById('endDate').value;

        if (customStart && customEnd) {
            return { startDate: customStart, endDate: customEnd };
        }

        const now = new Date();
        let startDate, endDate;

        switch(this.selectedPeriod) {
            case 'today':
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                break;
            case 'week':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date(now);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date(now);
                break;
            case 'quarter':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 3);
                endDate = new Date(now);
                break;
            case 'year':
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 1);
                endDate = new Date(now);
                break;
            case '2years':
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 2);
                endDate = new Date(now);
                break;
            default:
                return { startDate: null, endDate: null };
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    }

    getCompanyColor(companyId) {
        const colors = {
            techpro: '#1e3a8a',
            innovatech: '#3b82f6',
            smartmarketing: '#10b981',
            digitalwave: '#f59e0b',
            nexusbrands: '#ef4444'
        };

        return colors[companyId] || '#6b7280';
    }

    startRealtimeUpdates() {
        // Update every 5 seconds when in realtime mode
        this.updateInterval = setInterval(() => {
            if (this.selectedPeriod === 'realtime') {
                const indicator = document.getElementById('updateIndicator');
                indicator.innerHTML = '<i class="bi bi-circle-fill blinking"></i> A atualizar...';

                setTimeout(() => {
                    indicator.innerHTML = '<i class="bi bi-circle-fill blinking"></i> Ao Vivo';
                }, 1000);
            }
        }, 5000);
    }

    updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleDateString('pt-PT', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        document.getElementById('currentDateTime').textContent = dateTimeString;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-PT').format(value);
    }
}

// Export data functions
function exportData(format) {
    const data = collectCurrentData();

    switch(format) {
        case 'csv':
            downloadCSV(data);
            break;
        case 'json':
            downloadJSON(data);
            break;
        case 'excel':
            alert('Funcionalidade Excel em desenvolvimento. Use CSV por enquanto.');
            break;
    }
}

function collectCurrentData() {
    const companies = dataGenerator.getAllCompanies();
    const data = [];

    companies.forEach(company => {
        const realtimeData = dataGenerator.getRealtimeData(company.id);
        const metrics = metricsCalculator.calculateAllMetrics(realtimeData);

        data.push({
            empresa: company.name,
            setor: company.sector,
            ...realtimeData,
            ...metrics
        });
    });

    return data;
}

function downloadCSV(data) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(';'),
        ...data.map(row => headers.map(header => row[header] || '').join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `metricas_marketing_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function downloadJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `metricas_marketing_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function printReport() {
    window.print();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.btn-light i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    } else {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MarketingMetricsApp();
});