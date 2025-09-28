// App V2 - Raw Data Viewer for Energy Drinks Market

class EnergyDrinksDataViewer {
    constructor() {
        this.selectedBrand = 'all';
        this.selectedView = 'raw';
        this.selectedPeriod = 'daily';
        this.startDate = null;
        this.endDate = null;
        this.charts = {};

        this.init();
    }

    init() {
        // Set date range (last 30 days by default)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        document.getElementById('endDate').value = today.toISOString().split('T')[0];
        document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];

        this.startDate = thirtyDaysAgo;
        this.endDate = today;

        // Initialize event listeners
        this.setupEventListeners();

        // Initialize charts
        this.initializeCharts();

        // Load initial data
        this.updateView();

        // Update datetime
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);

        // Load timeline
        this.loadTimeline();
    }

    setupEventListeners() {
        // Brand selector
        document.getElementById('brandSelector').addEventListener('change', (e) => {
            this.selectedBrand = e.target.value;
            this.updateView();
        });

        // Period selector
        document.getElementById('periodType').addEventListener('change', (e) => {
            this.selectedPeriod = e.target.value;
            this.updateView();
        });

        // View type buttons
        document.querySelectorAll('[data-view]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.selectedView = e.currentTarget.dataset.view;
                this.updateView();
            });
        });

        // Date filters
        window.applyDateFilter = () => {
            this.startDate = new Date(document.getElementById('startDate').value);
            this.endDate = new Date(document.getElementById('endDate').value);
            this.updateView();
        };

        // Export functions
        window.exportCurrentView = (format) => {
            this.exportData(format, false);
        };

        window.exportAllData = () => {
            this.exportData('json', true);
        };
    }

    initializeCharts() {
        // Market share pie chart
        const marketCtx = document.getElementById('marketShareChart').getContext('2d');
        this.charts.marketShare = new Chart(marketCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#0066CC', '#FFD700', '#00AA00', '#FF0000',
                        '#FFB300', '#FF6600', '#9C27B0', '#424242'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
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

        // Time series chart
        const timeCtx = document.getElementById('timeSeriesChart').getContext('2d');
        this.charts.timeSeries = new Chart(timeCtx, {
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
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateView() {
        // Update overview cards
        this.updateOverviewCards();

        // Update data table based on view
        this.updateDataTable();

        // Update charts
        this.updateCharts();
    }

    updateOverviewCards() {
        let totalUnits = 0;
        let totalRevenue = 0;
        let totalCustomersB2C = 0;
        let totalCustomersB2B = 0;
        let marketShare = 0;

        if (this.selectedBrand === 'all') {
            // Sum all brands
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                if (data.length > 0) {
                    const latest = data[data.length - 1];
                    totalUnits += latest.unitsSold || 0;
                    totalRevenue += latest.netRevenue || 0;
                    totalCustomersB2C += latest.totalB2CCustomers || 0;
                    totalCustomersB2B += latest.totalB2BCustomers || 0;
                    marketShare = 100; // All brands = 100%
                }
            });
        } else {
            const data = this.getFilteredData(this.selectedBrand);
            if (data.length > 0) {
                // Sum period data
                data.forEach(day => {
                    totalUnits += day.unitsSold || 0;
                    totalRevenue += day.netRevenue || 0;
                });

                const latest = data[data.length - 1];
                totalCustomersB2C = latest.totalB2CCustomers || 0;
                totalCustomersB2B = latest.totalB2BCustomers || 0;
                marketShare = parseFloat(latest.marketShare) || 0;
            }
        }

        // Update displays
        document.getElementById('marketShareDisplay').textContent = marketShare.toFixed(1) + '%';
        document.getElementById('marketShareBar').style.width = marketShare + '%';
        document.getElementById('unitsSoldDisplay').textContent = this.formatNumber(totalUnits);
        document.getElementById('revenueDisplay').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('customersDisplay').textContent = this.formatNumber(totalCustomersB2C + totalCustomersB2B);
    }

    updateDataTable() {
        const container = document.getElementById('dataTableContainer');
        let html = '';

        switch(this.selectedView) {
            case 'raw':
                html = this.generateRawDataTable();
                break;
            case 'financial':
                html = this.generateFinancialTable();
                break;
            case 'customers':
                html = this.generateCustomersTable();
                break;
            case 'sales':
                html = this.generateSalesTable();
                break;
            case 'marketing':
                html = this.generateMarketingTable();
                break;
            case 'digital':
                html = this.generateDigitalTable();
                break;
            case 'competition':
                html = this.generateCompetitionTable();
                break;
            case 'decisions':
                html = this.generateDecisionsTable();
                break;
            case 'transactions':
                html = this.generateTransactionsTable();
                break;
            default:
                html = this.generateRawDataTable();
        }

        container.innerHTML = html;

        // Update count
        const rows = container.querySelectorAll('tbody tr').length;
        document.getElementById('dataCount').textContent = rows;
    }

    generateRawDataTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        // Key columns for raw data view
        const columns = [
            'Data', 'Marca', 'Quota Mercado (%)', 'Unidades Vendidas',
            'Receita Bruta (€)', 'Descontos (€)', 'Receita Líquida (€)',
            'Custos Diretos (€)', 'Custos Indiretos (€)', 'Marketing Total (€)',
            'Novos Clientes B2C', 'Clientes Perdidos B2C', 'Total Clientes B2C',
            'Total Clientes B2B', 'Visitas Realizadas', 'Leads Gerados'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                data.forEach(row => {
                    html += '<tr>';
                    html += `<td>${row.date}</td>`;
                    html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                    html += `<td>${row.marketShare}</td>`;
                    html += `<td>${this.formatNumber(row.unitsSold)}</td>`;
                    html += `<td>${this.formatCurrency(row.grossRevenue)}</td>`;
                    html += `<td>${this.formatCurrency(row.discountsGiven)}</td>`;
                    html += `<td>${this.formatCurrency(row.netRevenue)}</td>`;
                    html += `<td>${this.formatCurrency(row.totalDirectCost)}</td>`;
                    html += `<td>${this.formatCurrency(row.totalIndirectCost)}</td>`;
                    html += `<td>${this.formatCurrency(row.totalMarketingSpend)}</td>`;
                    html += `<td>${row.newB2CCustomers}</td>`;
                    html += `<td>${row.lostB2CCustomers}</td>`;
                    html += `<td>${this.formatNumber(row.totalB2CCustomers)}</td>`;
                    html += `<td>${row.totalB2BCustomers}</td>`;
                    html += `<td>${row.completedVisits}</td>`;
                    html += `<td>${row.leadsGenerated}</td>`;
                    html += '</tr>';
                });
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);

            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${row.marketShare}</td>`;
                html += `<td>${this.formatNumber(row.unitsSold)}</td>`;
                html += `<td>${this.formatCurrency(row.grossRevenue)}</td>`;
                html += `<td>${this.formatCurrency(row.discountsGiven)}</td>`;
                html += `<td>${this.formatCurrency(row.netRevenue)}</td>`;
                html += `<td>${this.formatCurrency(row.totalDirectCost)}</td>`;
                html += `<td>${this.formatCurrency(row.totalIndirectCost)}</td>`;
                html += `<td>${this.formatCurrency(row.totalMarketingSpend)}</td>`;
                html += `<td>${row.newB2CCustomers}</td>`;
                html += `<td>${row.lostB2CCustomers}</td>`;
                html += `<td>${this.formatNumber(row.totalB2CCustomers)}</td>`;
                html += `<td>${row.totalB2BCustomers}</td>`;
                html += `<td>${row.completedVisits}</td>`;
                html += `<td>${row.leadsGenerated}</td>`;
                html += '</tr>';
            });
        }

        html += '</tbody></table>';
        return html;
    }

    generateFinancialTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        const columns = [
            'Data', 'Marca', 'Vendas Brutas (€)', 'Descontos (€)', 'Devoluções (€)',
            'Vendas Líquidas (€)', 'Custo Materiais (€)', 'Custo Mão-Obra (€)',
            'Custo Embalagem (€)', 'Custos Fixos Produção (€)', 'Custos Admin (€)',
            'Custos Armazenagem (€)', 'Custos Distribuição (€)', 'Lucro Bruto (€)',
            'Lucro Operacional (€)', 'Margem %'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const processData = (brand, data) => {
            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${this.formatCurrency(row.grossRevenue)}</td>`;
                html += `<td>${this.formatCurrency(row.discountsGiven)}</td>`;
                html += `<td>${this.formatCurrency(row.returnsValue)}</td>`;
                html += `<td>${this.formatCurrency(row.netRevenue)}</td>`;
                html += `<td>${this.formatCurrency(row.directMaterialCost)}</td>`;
                html += `<td>${this.formatCurrency(row.directLaborCost)}</td>`;
                html += `<td>${this.formatCurrency(row.packagingCost)}</td>`;
                html += `<td>${this.formatCurrency(row.fixedProductionCost)}</td>`;
                html += `<td>${this.formatCurrency(row.administrativeCost)}</td>`;
                html += `<td>${this.formatCurrency(row.storageCost)}</td>`;
                html += `<td>${this.formatCurrency(row.distributionCost)}</td>`;
                html += `<td>${this.formatCurrency(row.grossProfit)}</td>`;
                html += `<td>${this.formatCurrency(row.operatingProfit)}</td>`;
                html += `<td>${((row.grossProfit / row.netRevenue) * 100).toFixed(2)}%</td>`;
                html += '</tr>';
            });
        };

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                processData(brand, data);
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);
            processData(brand, data);
        }

        html += '</tbody></table>';
        return html;
    }

    generateCustomersTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        const columns = [
            'Data', 'Marca', 'Total B2C', 'Novos B2C', 'Perdidos B2C', 'Retidos B2C',
            'Reativados B2C', 'Inativos B2C', 'Total B2B', 'Novos B2B', 'Perdidos B2B',
            'Via Publicidade', 'Via Promoção', 'Via Referência', 'Via Digital',
            'Frequência Compra', 'Valor Médio (€)', 'Taxa Recompra %'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const processData = (brand, data) => {
            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${this.formatNumber(row.totalB2CCustomers)}</td>`;
                html += `<td>${row.newB2CCustomers}</td>`;
                html += `<td>${row.lostB2CCustomers}</td>`;
                html += `<td>${row.retainedB2CCustomers}</td>`;
                html += `<td>${row.reactivatedB2CCustomers}</td>`;
                html += `<td>${row.inactiveB2CCustomers}</td>`;
                html += `<td>${row.totalB2BCustomers}</td>`;
                html += `<td>${row.newB2BCustomers}</td>`;
                html += `<td>${row.lostB2BCustomers}</td>`;
                html += `<td>${row.customersViaAdvertising}</td>`;
                html += `<td>${row.customersViaPromotion}</td>`;
                html += `<td>${row.customersViaReferral}</td>`;
                html += `<td>${row.customersViaDigital}</td>`;
                html += `<td>${row.averagePurchaseFrequency?.toFixed(2)}</td>`;
                html += `<td>${this.formatCurrency(row.averagePurchaseValue)}</td>`;
                html += `<td>${row.repurchaseRate}</td>`;
                html += '</tr>';
            });
        };

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                processData(brand, data);
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);
            processData(brand, data);
        }

        html += '</tbody></table>';
        return html;
    }

    generateSalesTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        const columns = [
            'Data', 'Marca', 'Vendedores', 'Supervisores', 'Gestores',
            'Visitas Planeadas', 'Visitas Realizadas', 'Duração Média (min)',
            'Leads Gerados', 'Leads Qualificados', 'Propostas', 'Negociações',
            'Negócios Fechados', 'Valor Fechado (€)', 'Tamanho Médio Deal (€)',
            'Salários (€)', 'Comissões (€)', 'Custos Visitas (€)'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const processData = (brand, data) => {
            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${row.numberOfSalespeople}</td>`;
                html += `<td>${row.numberOfSupervisors}</td>`;
                html += `<td>${row.numberOfRegionalManagers}</td>`;
                html += `<td>${row.plannedVisits}</td>`;
                html += `<td>${row.completedVisits}</td>`;
                html += `<td>${row.averageVisitDuration}</td>`;
                html += `<td>${row.leadsGenerated}</td>`;
                html += `<td>${row.qualifiedLeads}</td>`;
                html += `<td>${row.proposalsSent}</td>`;
                html += `<td>${row.negotiationsActive}</td>`;
                html += `<td>${row.dealsClosedCount}</td>`;
                html += `<td>${this.formatCurrency(row.dealsClosedValue)}</td>`;
                html += `<td>${this.formatCurrency(row.averageDealSize)}</td>`;
                html += `<td>${this.formatCurrency(row.salesForceSalaries)}</td>`;
                html += `<td>${this.formatCurrency(row.salesCommissions)}</td>`;
                html += `<td>${this.formatCurrency(row.visitCosts)}</td>`;
                html += '</tr>';
            });
        };

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                processData(brand, data);
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);
            processData(brand, data);
        }

        html += '</tbody></table>';
        return html;
    }

    generateMarketingTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        const columns = [
            'Data', 'Marca', 'TV (€)', 'Rádio (€)', 'Online (€)', 'Outdoor (€)',
            'Patrocínios (€)', 'Promoções (€)', 'Sampling (€)', 'Digital (€)',
            'Influencers (€)', 'Total Marketing (€)', 'TV GRPs', 'Rádio GRPs',
            'Cobertura %', 'Frequência', 'Share of Voice %'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const processData = (brand, data) => {
            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${this.formatCurrency(row.tvAdvertising)}</td>`;
                html += `<td>${this.formatCurrency(row.radioAdvertising)}</td>`;
                html += `<td>${this.formatCurrency(row.onlineAdvertising)}</td>`;
                html += `<td>${this.formatCurrency(row.outdoorAdvertising)}</td>`;
                html += `<td>${this.formatCurrency(row.sponsorships)}</td>`;
                html += `<td>${this.formatCurrency(row.promotions)}</td>`;
                html += `<td>${this.formatCurrency(row.sampling)}</td>`;
                html += `<td>${this.formatCurrency(row.digitalMarketing)}</td>`;
                html += `<td>${this.formatCurrency(row.influencerMarketing)}</td>`;
                html += `<td>${this.formatCurrency(row.totalMarketingSpend)}</td>`;
                html += `<td>${row.tvGRPs}</td>`;
                html += `<td>${row.radioGRPs}</td>`;
                html += `<td>${row.adCoverage?.toFixed(1)}%</td>`;
                html += `<td>${row.adFrequency?.toFixed(1)}</td>`;
                html += `<td>${row.shareOfVoice}%</td>`;
                html += '</tr>';
            });
        };

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                processData(brand, data);
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);
            processData(brand, data);
        }

        html += '</tbody></table>';
        return html;
    }

    generateDigitalTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';

        const columns = [
            'Data', 'Marca', 'Visitantes Únicos', 'Sessões', 'Page Views',
            'Bounce Rate %', 'Duração Sessão (s)', 'Impressões', 'Cliques',
            'CTR %', 'CPC (€)', 'Conversões', 'Taxa Conv %',
            'Facebook', 'Instagram', 'TikTok', 'Engagement %'
        ];

        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        const processData = (brand, data) => {
            data.forEach(row => {
                html += '<tr>';
                html += `<td>${row.date}</td>`;
                html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
                html += `<td>${this.formatNumber(row.uniqueWebsiteVisitors)}</td>`;
                html += `<td>${this.formatNumber(row.totalSessions)}</td>`;
                html += `<td>${this.formatNumber(row.pageViews)}</td>`;
                html += `<td>${row.bounceRate}</td>`;
                html += `<td>${row.avgSessionDuration}</td>`;
                html += `<td>${this.formatNumber(row.campaignImpressions)}</td>`;
                html += `<td>${this.formatNumber(row.campaignClicks)}</td>`;
                html += `<td>${row.campaignCTR}</td>`;
                html += `<td>${row.campaignCPC}</td>`;
                html += `<td>${row.campaignConversions}</td>`;
                html += `<td>${row.campaignConversionRate}</td>`;
                html += `<td>${this.formatNumber(row.facebookFollowers)}</td>`;
                html += `<td>${this.formatNumber(row.instagramFollowers)}</td>`;
                html += `<td>${this.formatNumber(row.tiktokFollowers)}</td>`;
                html += `<td>${row.engagementRate}</td>`;
                html += '</tr>';
            });
        };

        if (this.selectedBrand === 'all') {
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                processData(brand, data);
            });
        } else {
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);
            const data = this.getFilteredData(this.selectedBrand);
            processData(brand, data);
        }

        html += '</tbody></table>';
        return html;
    }

    generateCompetitionTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';
        html += '<th>Marca</th><th>Quota Mercado %</th><th>Preço Médio 250ml</th>';
        html += '<th>Funcionários</th><th>Pontos Venda</th><th>Investimento Mkt/Ano</th>';
        html += '<th>Posicionamento</th><th>Target</th>';
        html += '</tr></thead><tbody>';

        marketSimulator.getAllBrands().forEach(brand => {
            const latestData = marketSimulator.getHistoricalData(brand.id, 'daily').slice(-1)[0];
            const annualMarketing = marketSimulator.getHistoricalData(brand.id, 'yearly').slice(-1)[0];

            html += '<tr>';
            html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
            html += `<td>${(brand.marketShare * 100).toFixed(1)}%</td>`;
            html += `<td>€${brand.basePrice250ml}</td>`;
            html += `<td>${brand.employees}</td>`;
            html += `<td>${latestData?.activePointsOfSale || 0}</td>`;
            html += `<td>${this.formatCurrency(annualMarketing?.totalMarketingSpend || 0)}</td>`;
            html += `<td>${brand.positioning}</td>`;
            html += `<td>${brand.target}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    generateDecisionsTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';
        html += '<th>Data</th><th>Marca</th><th>Decisão</th><th>Investimento</th><th>Impacto</th>';
        html += '</tr></thead><tbody>';

        const allDecisions = [];

        Object.entries(marketSimulator.brandDecisions).forEach(([brandId, decisions]) => {
            const brand = marketSimulator.getBrandInfo(brandId);
            decisions.forEach(decision => {
                allDecisions.push({
                    date: decision.date,
                    brand: brand,
                    decision: decision.decision,
                    investment: decision.investment,
                    impact: decision.impact
                });
            });
        });

        // Add market events
        marketSimulator.marketEvents.forEach(event => {
            allDecisions.push({
                date: event.date,
                brand: { name: 'MERCADO', color: '#000000' },
                decision: event.description,
                investment: 0,
                impact: event.impact
            });
        });

        // Sort by date
        allDecisions.sort((a, b) => new Date(b.date) - new Date(a.date));

        allDecisions.forEach(item => {
            html += '<tr>';
            html += `<td>${item.date}</td>`;
            html += `<td><span class="badge" style="background-color: ${item.brand.color}">${item.brand.name}</span></td>`;
            html += `<td>${item.decision}</td>`;
            html += `<td>${this.formatCurrency(item.investment)}</td>`;
            html += `<td><small>${JSON.stringify(item.impact)}</small></td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    generateTransactionsTable() {
        let html = '<table class="table table-sm table-hover">';
        html += '<thead class="table-light"><tr>';
        html += '<th>ID</th><th>Data</th><th>Marca</th><th>Tipo</th><th>Canal</th>';
        html += '<th>SKU</th><th>Quantidade</th><th>Preço Unit</th><th>Desconto</th><th>Total</th>';
        html += '</tr></thead><tbody>';

        const transactions = marketSimulator.getTransactions(
            this.selectedBrand === 'all' ? null : this.selectedBrand,
            this.startDate?.toISOString(),
            this.endDate?.toISOString(),
            100
        );

        transactions.forEach(trx => {
            const brand = marketSimulator.getBrandInfo(trx.brandId);
            html += '<tr>';
            html += `<td><small>${trx.id}</small></td>`;
            html += `<td>${trx.date.split('T')[0]}</td>`;
            html += `<td><span class="badge" style="background-color: ${brand.color}">${brand.name}</span></td>`;
            html += `<td>${trx.type}</td>`;
            html += `<td>${trx.channel}</td>`;
            html += `<td>${trx.sku}</td>`;
            html += `<td>${trx.quantity}</td>`;
            html += `<td>€${trx.unitPrice.toFixed(2)}</td>`;
            html += `<td>€${trx.discount.toFixed(2)}</td>`;
            html += `<td>€${trx.totalValue.toFixed(2)}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    updateCharts() {
        // Update market share chart
        const labels = [];
        const values = [];

        marketSimulator.getAllBrands().forEach(brand => {
            labels.push(brand.name);
            values.push((brand.marketShare * 100).toFixed(1));
        });

        this.charts.marketShare.data.labels = labels;
        this.charts.marketShare.data.datasets[0].data = values;
        this.charts.marketShare.update();

        // Update time series chart
        this.updateTimeSeriesChart();
    }

    updateTimeSeriesChart() {
        const datasets = [];

        if (this.selectedBrand === 'all') {
            // Show all brands revenue evolution
            marketSimulator.getAllBrands().forEach(brand => {
                const data = this.getFilteredData(brand.id);
                if (data.length > 0) {
                    datasets.push({
                        label: brand.name,
                        data: data.map(d => d.netRevenue),
                        borderColor: brand.color,
                        backgroundColor: brand.color + '33',
                        tension: 0.1
                    });
                }
            });
        } else {
            // Show selected brand metrics
            const data = this.getFilteredData(this.selectedBrand);
            const brand = marketSimulator.getBrandInfo(this.selectedBrand);

            if (data.length > 0) {
                datasets.push({
                    label: 'Receita Líquida',
                    data: data.map(d => d.netRevenue),
                    borderColor: brand.color,
                    yAxisID: 'y'
                });
            }
        }

        const data = this.getFilteredData(this.selectedBrand === 'all' ? 'volt' : this.selectedBrand);
        this.charts.timeSeries.data.labels = data.map(d => d.date);
        this.charts.timeSeries.data.datasets = datasets;
        this.charts.timeSeries.update();
    }

    loadTimeline() {
        const container = document.getElementById('timelineContainer');
        let html = '<div class="timeline">';

        // Combine all events and decisions
        const allEvents = [];

        // Add market events
        marketSimulator.marketEvents.forEach(event => {
            allEvents.push({
                date: event.date,
                type: 'market',
                title: 'Evento de Mercado',
                description: event.description,
                impact: event.impact
            });
        });

        // Add brand decisions
        Object.entries(marketSimulator.brandDecisions).forEach(([brandId, decisions]) => {
            const brand = marketSimulator.getBrandInfo(brandId);
            decisions.forEach(decision => {
                allEvents.push({
                    date: decision.date,
                    type: 'decision',
                    brand: brand.name,
                    brandColor: brand.color,
                    title: `${brand.name}: Decisão Estratégica`,
                    description: decision.decision,
                    investment: decision.investment,
                    impact: decision.impact
                });
            });
        });

        // Sort by date (most recent first)
        allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display last 20 events
        allEvents.slice(0, 20).forEach(event => {
            const icon = event.type === 'market' ? 'bi-globe' : 'bi-lightbulb';
            const color = event.type === 'market' ? 'danger' : 'primary';

            html += `
                <div class="d-flex mb-3">
                    <div class="flex-shrink-0">
                        <span class="badge bg-${color} rounded-circle p-2">
                            <i class="bi ${icon}"></i>
                        </span>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${event.title}</h6>
                            <small class="text-muted">${event.date}</small>
                        </div>
                        <p class="mb-1">${event.description}</p>
                        ${event.investment ? `<small class="text-muted">Investimento: ${this.formatCurrency(event.investment)}</small>` : ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    getFilteredData(brandId) {
        return marketSimulator.getHistoricalData(
            brandId,
            this.selectedPeriod,
            this.startDate?.toISOString(),
            this.endDate?.toISOString()
        );
    }

    exportData(format, all = false) {
        let data;
        let filename;

        if (all) {
            // Export everything
            data = marketSimulator.exportData('json');
            filename = `mercado_bebidas_energeticas_completo_${new Date().toISOString().split('T')[0]}`;
        } else {
            // Export current view
            if (this.selectedBrand === 'all') {
                data = {};
                marketSimulator.getAllBrands().forEach(brand => {
                    data[brand.id] = this.getFilteredData(brand.id);
                });
            } else {
                data = this.getFilteredData(this.selectedBrand);
            }
            filename = `${this.selectedView}_${this.selectedBrand}_${new Date().toISOString().split('T')[0]}`;
        }

        if (format === 'csv') {
            this.downloadCSV(data, filename);
        } else {
            this.downloadJSON(data, filename);
        }
    }

    downloadCSV(data, filename) {
        let csv = '';

        // Handle different data structures
        if (Array.isArray(data)) {
            // Simple array of records
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                csv = headers.join(';') + '\n';
                data.forEach(row => {
                    csv += headers.map(h => row[h] || '').join(';') + '\n';
                });
            }
        } else if (typeof data === 'object') {
            // Multiple brands
            Object.entries(data).forEach(([brandId, brandData]) => {
                if (Array.isArray(brandData) && brandData.length > 0) {
                    if (csv === '') {
                        const headers = ['brandId', ...Object.keys(brandData[0])];
                        csv = headers.join(';') + '\n';
                    }
                    brandData.forEach(row => {
                        csv += [brandId, ...Object.values(row)].join(';') + '\n';
                    });
                }
            });
        }

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    }

    downloadJSON(data, filename) {
        const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.json`;
        link.click();
    }

    updateDateTime() {
        const now = new Date();
        document.getElementById('currentDateTime').textContent = now.toLocaleString('pt-PT');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-PT').format(value || 0);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dataViewer = new EnergyDrinksDataViewer();

    // Show initial help
    console.log('🔋 Simulador de Bebidas Energéticas Carregado!');
    console.log('📊 2 anos de dados disponíveis para 8 marcas');
    console.log('💡 Use os filtros para explorar os dados');
    console.log('📥 Exporte em CSV ou JSON para análise externa');
});