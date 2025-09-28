// App V3 - Sistema Melhorado com Terminologia PT-PT

class SimuladorMetricasMarketing {
    constructor() {
        this.marcaSelecionada = 'all';
        this.categoriaSelecionada = 'overview';
        this.periodoSelecionado = 'daily';
        this.dataInicio = null;
        this.dataFim = null;
        this.charts = {};

        this.init();
    }

    init() {
        // Definir período padrão (últimos 30 dias)
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

        document.getElementById('endDate').value = hoje.toISOString().split('T')[0];
        document.getElementById('startDate').value = trintaDiasAtras.toISOString().split('T')[0];

        this.dataInicio = trintaDiasAtras;
        this.dataFim = hoje;

        // Configurar eventos
        this.configurarEventos();

        // Carregar vista inicial
        this.atualizarVista();

        // Atualizar data/hora
        this.atualizarDataHora();
        setInterval(() => this.atualizarDataHora(), 1000);
    }

    configurarEventos() {
        // Seletor de marca
        document.getElementById('brandSelector').addEventListener('change', (e) => {
            this.marcaSelecionada = e.target.value;
            this.atualizarVista();
        });

        // Seletor de período
        document.getElementById('periodType').addEventListener('change', (e) => {
            this.periodoSelecionado = e.target.value;
            this.atualizarVista();
        });

        // Navegação por categorias
        document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('#categoryTabs .nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.categoriaSelecionada = e.currentTarget.dataset.category;
                this.atualizarVista();
            });
        });

        // Datas
        document.getElementById('startDate').addEventListener('change', () => {
            this.dataInicio = new Date(document.getElementById('startDate').value);
            this.atualizarVista();
        });

        document.getElementById('endDate').addEventListener('change', () => {
            this.dataFim = new Date(document.getElementById('endDate').value);
            this.atualizarVista();
        });

        // Função de exportação Excel
        window.exportarParaExcel = () => this.exportarParaExcel();
    }

    atualizarVista() {
        const container = document.getElementById('dataContent');

        switch(this.categoriaSelecionada) {
            case 'overview':
                container.innerHTML = this.gerarVisaoGeral();
                break;
            case 'financial':
                container.innerHTML = this.gerarDadosFinanceiros();
                break;
            case 'customers':
                container.innerHTML = this.gerarDadosClientes();
                break;
            case 'market':
                container.innerHTML = this.gerarDadosMercado();
                break;
            case 'sales':
                container.innerHTML = this.gerarDadosVendas();
                break;
            case 'marketing':
                container.innerHTML = this.gerarDadosMarketing();
                break;
            case 'digital':
                container.innerHTML = this.gerarDadosDigitais();
                break;
        }

        // Atualizar gráficos
        this.atualizarGraficos();
    }

    atualizarGraficos() {
        const chartsArea = document.getElementById('chartsArea');
        if (!chartsArea) return;

        chartsArea.style.display = 'block';

        const dados = this.obterDadosFiltrados();
        if (dados.length === 0) return;

        // Preparar dados para gráficos
        const labels = [];
        const vendasData = [];
        const receitaData = [];
        const clientesData = [];

        // Agregar dados por período
        const dadosAgregados = this.agregarDadosPorPeriodo(dados);

        dadosAgregados.forEach(d => {
            labels.push(d.label);
            vendasData.push(d.unitsSold);
            receitaData.push(d.netRevenue);
            clientesData.push(d.totalCustomers);
        });

        // Gráfico Principal (Linha/Área)
        this.criarGraficoPrincipal(labels, vendasData, receitaData);

        // Gráfico Pizza (Quota de Mercado)
        this.criarGraficoPizza();

        // Gráfico de Comparação (Barras)
        this.criarGraficoComparacao(labels, clientesData);
    }

    agregarDadosPorPeriodo(dados) {
        const agregados = [];

        if (this.periodoSelecionado === 'daily') {
            // Últimos 30 dias
            const ultimosDias = dados.slice(-30);
            ultimosDias.forEach(d => {
                agregados.push({
                    label: new Date(d.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
                    unitsSold: d.unitsSold,
                    netRevenue: d.netRevenue,
                    totalCustomers: d.totalB2CCustomers + d.totalB2BCustomers
                });
            });
        } else if (this.periodoSelecionado === 'monthly') {
            // Agregar por mês
            const meses = {};
            dados.forEach(d => {
                const mes = new Date(d.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short' });
                if (!meses[mes]) {
                    meses[mes] = {
                        label: mes,
                        unitsSold: 0,
                        netRevenue: 0,
                        totalCustomers: 0,
                        count: 0
                    };
                }
                meses[mes].unitsSold += d.unitsSold;
                meses[mes].netRevenue += d.netRevenue;
                meses[mes].totalCustomers = d.totalB2CCustomers + d.totalB2BCustomers;
                meses[mes].count++;
            });

            Object.values(meses).forEach(m => agregados.push(m));
        } else if (this.periodoSelecionado === 'yearly') {
            // Agregar por ano
            const anos = {};
            dados.forEach(d => {
                const ano = new Date(d.date).getFullYear();
                if (!anos[ano]) {
                    anos[ano] = {
                        label: ano.toString(),
                        unitsSold: 0,
                        netRevenue: 0,
                        totalCustomers: 0
                    };
                }
                anos[ano].unitsSold += d.unitsSold;
                anos[ano].netRevenue += d.netRevenue;
                anos[ano].totalCustomers = d.totalB2CCustomers + d.totalB2BCustomers;
            });

            Object.values(anos).forEach(a => agregados.push(a));
        }

        return agregados;
    }

    criarGraficoPrincipal(labels, vendasData, receitaData) {
        const ctx = document.getElementById('mainChart');
        if (!ctx) return;

        if (this.charts.main) {
            this.charts.main.destroy();
        }

        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas (unidades)',
                    data: vendasData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                }, {
                    label: 'Receita Líquida (€)',
                    data: receitaData,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução de Vendas e Receita'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Unidades Vendidas'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Receita (€)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    criarGraficoPizza() {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        if (this.charts.pie) {
            this.charts.pie.destroy();
        }

        const marcas = marketSimulator.getAllBrands();
        const labels = [];
        const data = [];
        const colors = [];

        marcas.forEach((marca, index) => {
            labels.push(marca.name);
            const dadosMarca = marketSimulator.getHistoricalData(marca.id, this.dataInicio, this.dataFim);
            const vendas = dadosMarca.reduce((sum, d) => sum + d.unitsSold, 0);
            data.push(vendas);
            colors.push(`hsl(${index * 45}, 70%, 50%)`);
        });

        this.charts.pie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição do Mercado'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    criarGraficoComparacao(labels, clientesData) {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.slice(-12),
                datasets: [{
                    label: 'Base de Clientes',
                    data: clientesData.slice(-12),
                    backgroundColor: 'rgba(147, 51, 234, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução da Base de Clientes'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Clientes'
                        }
                    }
                }
            }
        });
    }

    gerarVisaoGeral() {
        let html = `
            <div class="row">
                <div class="col-md-3">
                    <div class="data-card">
                        <div class="metric-label">Quota de Mercado</div>
                        <div class="metric-value">${this.calcularQuotaMercado()}<span class="metric-unit">%</span></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="data-card">
                        <div class="metric-label">Vendas (Período)</div>
                        <div class="metric-value">${this.formatarNumero(this.calcularVendasPeriodo())}<span class="metric-unit">un</span></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="data-card">
                        <div class="metric-label">Volume de Negócios</div>
                        <div class="metric-value">${this.formatarMoeda(this.calcularVolumeNegocios())}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="data-card">
                        <div class="metric-label">Base de Clientes</div>
                        <div class="metric-value">${this.formatarNumero(this.calcularTotalClientes())}</div>
                    </div>
                </div>
            </div>

            <div class="data-section">
                <h5 class="section-title">Dados Disponíveis para Cálculo de Métricas</h5>
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Importante:</strong> Todos os valores abaixo são dados brutos.
                    As métricas devem ser calculadas usando as fórmulas do curso.
                </div>
                ${this.gerarTabelaResumo()}
            </div>
        `;
        return html;
    }

    gerarDadosFinanceiros() {
        const dados = this.obterDadosFiltrados();

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas Financeiras</h5>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-cash-stack"></i> Proveitos</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Vendas Brutas</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'grossRevenue'))}</td>
                                </tr>
                                <tr>
                                    <th>Descontos Concedidos</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'discountsGiven'))}</td>
                                </tr>
                                <tr>
                                    <th>Devoluções</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'returnsValue'))}</td>
                                </tr>
                                <tr class="table-primary">
                                    <th>Vendas Líquidas</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'netRevenue'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-box-seam"></i> Custos Diretos de Produção</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Custo das Matérias-Primas</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'directMaterialCost'))}</td>
                                </tr>
                                <tr>
                                    <th>Custo da Mão-de-Obra Direta</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'directLaborCost'))}</td>
                                </tr>
                                <tr>
                                    <th>Custo das Embalagens</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'packagingCost'))}</td>
                                </tr>
                                <tr class="table-warning">
                                    <th>Total dos Custos Diretos</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'totalDirectCost'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-building"></i> Custos Indiretos</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Custos Fixos de Produção</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'fixedProductionCost'))}</td>
                                </tr>
                                <tr>
                                    <th>Custos Administrativos</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'administrativeCost'))}</td>
                                </tr>
                                <tr>
                                    <th>Custos de Armazenagem</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'storageCost'))}</td>
                                </tr>
                                <tr>
                                    <th>Custos de Distribuição</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'distributionCost'))}</td>
                                </tr>
                                <tr class="table-warning">
                                    <th>Total dos Custos Indiretos</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'totalIndirectCost'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-megaphone"></i> Esforço de Marketing</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Publicidade TV</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'tvAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Publicidade Rádio</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'radioAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Publicidade Online</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'onlineAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Patrocínios</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'sponsorships'))}</td>
                                </tr>
                                <tr>
                                    <th>Promoções</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'promotions'))}</td>
                                </tr>
                                <tr class="table-info">
                                    <th>Esforço Total de Marketing</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'totalMarketingSpend'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-graph-up"></i> Resultados</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Margem Bruta</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'grossProfit'))}</td>
                                </tr>
                                <tr class="table-success">
                                    <th>Resultado Operacional</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'operatingProfit'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarDadosClientes() {
        const dados = this.obterDadosFiltrados();
        const ultimoDado = dados[dados.length - 1] || {};

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas de Clientes</h5>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-people-fill"></i> Balanço de Clientes B2C</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">N.º Total de Clientes B2C</th>
                                    <td class="text-end">${this.formatarNumero(ultimoDado.totalB2CCustomers || 0)}</td>
                                </tr>
                                <tr>
                                    <th>N.º Novos Clientes (período)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'newB2CCustomers'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Clientes Perdidos (período)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'lostB2CCustomers'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Clientes Retidos</th>
                                    <td class="text-end">${this.formatarNumero(ultimoDado.retainedB2CCustomers || 0)}</td>
                                </tr>
                                <tr>
                                    <th>N.º Clientes Reativados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'reactivatedB2CCustomers'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Clientes Inativos</th>
                                    <td class="text-end">${this.formatarNumero(ultimoDado.inactiveB2CCustomers || 0)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-funnel"></i> Origem dos Novos Clientes</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Via Publicidade</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'customersViaAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Via Promoção</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'customersViaPromotion'))}</td>
                                </tr>
                                <tr>
                                    <th>Via Recomendação</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'customersViaReferral'))}</td>
                                </tr>
                                <tr>
                                    <th>Via Digital</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'customersViaDigital'))}</td>
                                </tr>
                                <tr>
                                    <th>Espontâneos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'customersViaSpontaneous'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-currency-euro"></i> Custos de Aquisição e Manutenção</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Esforço de Marketing</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'totalMarketingSpend'))}</td>
                                </tr>
                                <tr>
                                    <th>Esforço Comercial</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'totalCommercialCost'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Novos Clientes</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'newB2CCustomers'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-shop"></i> Clientes B2B</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">N.º Total de Clientes B2B</th>
                                    <td class="text-end">${this.formatarNumero(ultimoDado.totalB2BCustomers || 0)}</td>
                                </tr>
                                <tr>
                                    <th>N.º Novos Clientes B2B</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'newB2BCustomers'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Clientes B2B Perdidos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'lostB2BCustomers'))}</td>
                                </tr>
                                <tr>
                                    <th>N.º Pontos de Venda Ativos</th>
                                    <td class="text-end">${this.formatarNumero(ultimoDado.activePointsOfSale || 0)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-cart-check"></i> Comportamento de Compra</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Frequência Média de Compra</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'averagePurchaseFrequency').toFixed(2)} vezes</td>
                                </tr>
                                <tr>
                                    <th>Valor Médio por Compra</th>
                                    <td class="text-end">${this.formatarMoeda(this.calcularMedia(dados, 'averagePurchaseValue'))}</td>
                                </tr>
                                <tr>
                                    <th>Quantidade Média por Compra</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'averagePurchaseQuantity').toFixed(1)} un</td>
                                </tr>
                                <tr>
                                    <th>Intervalo Médio entre Compras</th>
                                    <td class="text-end">${Math.round(this.calcularMedia(dados, 'averageTimeBetweenPurchases'))} dias</td>
                                </tr>
                                <tr>
                                    <th>Taxa de Recompra</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'repurchaseRate').toFixed(1)}%</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-emoji-smile"></i> Satisfação e Lealdade</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Inquéritos Enviados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'satisfactionSurveysSent'))}</td>
                                </tr>
                                <tr>
                                    <th>Inquéritos Respondidos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'satisfactionSurveysAnswered'))}</td>
                                </tr>
                                <tr>
                                    <th>Promotores (9-10)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'npsPromoters'))}</td>
                                </tr>
                                <tr>
                                    <th>Neutros (7-8)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'npsNeutral'))}</td>
                                </tr>
                                <tr>
                                    <th>Detratores (0-6)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'npsDetractors'))}</td>
                                </tr>
                                <tr>
                                    <th>Reclamações Recebidas</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'complaintsReceived'))}</td>
                                </tr>
                                <tr>
                                    <th>Reclamações Resolvidas</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'complaintsSolved'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarDadosMercado() {
        const dados = this.obterDadosFiltrados();

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas de Mercado e Valor de Marca</h5>

                <div class="row">
                    <div class="col-md-12">
                        <h6 class="text-muted mb-3"><i class="bi bi-pie-chart"></i> Quotas de Mercado Atuais</h6>
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Marca</th>
                                    <th class="text-end">Quota de Mercado (%)</th>
                                    <th class="text-end">Vendas (unidades)</th>
                                    <th class="text-end">Volume de Negócios (€)</th>
                                    <th class="text-end">N.º Clientes</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        marketSimulator.getAllBrands().forEach(marca => {
            const dadosMarca = this.obterDadosFiltrados(marca.id);
            const vendas = this.somarCampo(dadosMarca, 'unitsSold');
            const volume = this.somarCampo(dadosMarca, 'netRevenue');
            const clientes = dadosMarca[dadosMarca.length - 1]?.totalB2CCustomers || 0;

            html += `
                <tr>
                    <td>
                        <span class="brand-badge" style="background-color: ${marca.color}">
                            ${marca.name}
                        </span>
                    </td>
                    <td class="text-end">${(marca.marketShare * 100).toFixed(1)}%</td>
                    <td class="text-end">${this.formatarNumero(vendas)}</td>
                    <td class="text-end">${this.formatarMoeda(volume)}</td>
                    <td class="text-end">${this.formatarNumero(clientes)}</td>
                </tr>
            `;
        });

        html += `
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-graph-up-arrow"></i> Dados para Cálculo de Taxa de Crescimento</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <table class="vertical-table">
                                    <tbody>
                                        <tr>
                                            <th>Tamanho do Mercado Total (€/ano)</th>
                                            <td class="text-end">€185.000.000</td>
                                        </tr>
                                        <tr>
                                            <th>Volume do Mercado (litros/ano)</th>
                                            <td class="text-end">52.000.000 L</td>
                                        </tr>
                                        <tr>
                                            <th>Total de Unidades (ano)</th>
                                            <td class="text-end">156.000.000 un</td>
                                        </tr>
                                        <tr>
                                            <th>Taxa de Crescimento do Mercado</th>
                                            <td class="text-end">12% ao ano</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <table class="vertical-table">
                                    <tbody>
                                        <tr>
                                            <th>População Total Portugal</th>
                                            <td class="text-end">10.300.000</td>
                                        </tr>
                                        <tr>
                                            <th>População Alvo (18-50 anos)</th>
                                            <td class="text-end">4.500.000</td>
                                        </tr>
                                        <tr>
                                            <th>Consumidores Ativos</th>
                                            <td class="text-end">1.800.000</td>
                                        </tr>
                                        <tr>
                                            <th>Taxa de Penetração no Mercado</th>
                                            <td class="text-end">40%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarDadosVendas() {
        const dados = this.obterDadosFiltrados();

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas de Vendas e Distribuição</h5>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-people"></i> Força de Vendas</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">N.º de Vendedores</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'numberOfSalespeople').toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <th>N.º de Supervisores</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'numberOfSupervisors').toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <th>N.º de Gestores Regionais</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'numberOfRegionalManagers').toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <th>Visitas Planeadas (período)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'plannedVisits'))}</td>
                                </tr>
                                <tr>
                                    <th>Visitas Realizadas (período)</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'completedVisits'))}</td>
                                </tr>
                                <tr>
                                    <th>Duração Média da Visita</th>
                                    <td class="text-end">${Math.round(this.calcularMedia(dados, 'averageVisitDuration'))} min</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-currency-euro"></i> Custos da Força de Vendas</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Salários</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'salesForceSalaries'))}</td>
                                </tr>
                                <tr>
                                    <th>Comissões</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'salesCommissions'))}</td>
                                </tr>
                                <tr>
                                    <th>Custos de Visitas</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'visitCosts'))}</td>
                                </tr>
                                <tr>
                                    <th>Merchandising</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'merchandisingCosts'))}</td>
                                </tr>
                                <tr>
                                    <th>Incentivos aos Retalhistas</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'retailerIncentives'))}</td>
                                </tr>
                                <tr class="table-warning">
                                    <th>Custo Comercial Total</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'totalCommercialCost'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-funnel"></i> Pipeline de Vendas</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Leads Gerados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'leadsGenerated'))}</td>
                                </tr>
                                <tr>
                                    <th>Leads Qualificados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'qualifiedLeads'))}</td>
                                </tr>
                                <tr>
                                    <th>Propostas Enviadas</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'proposalsSent'))}</td>
                                </tr>
                                <tr>
                                    <th>Negociações em Curso</th>
                                    <td class="text-end">${this.formatarNumero(this.calcularMedia(dados, 'negotiationsActive').toFixed(0))}</td>
                                </tr>
                                <tr>
                                    <th>Negócios Fechados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'dealsClosedCount'))}</td>
                                </tr>
                                <tr>
                                    <th>Valor dos Negócios Fechados</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'dealsClosedValue'))}</td>
                                </tr>
                                <tr>
                                    <th>Tamanho Médio do Negócio</th>
                                    <td class="text-end">${this.formatarMoeda(this.calcularMedia(dados, 'averageDealSize'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-shop"></i> Distribuição</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Distribuição Numérica (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'numericDistribution').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Distribuição Ponderada (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'weightedDistribution').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Dias de Rutura de Stock</th>
                                    <td class="text-end">${this.somarCampo(dados, 'stockoutDays')}</td>
                                </tr>
                                <tr>
                                    <th>Stock Médio no Retalho</th>
                                    <td class="text-end">${this.formatarNumero(this.calcularMedia(dados, 'averageRetailStock'))} un</td>
                                </tr>
                                <tr>
                                    <th>Stock Médio no Armazém</th>
                                    <td class="text-end">${this.formatarNumero(this.calcularMedia(dados, 'averageWarehouseStock'))} un</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarDadosMarketing() {
        const dados = this.obterDadosFiltrados();

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas de Publicidade e Promoção</h5>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-tv"></i> Investimento em Publicidade</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Publicidade TV</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'tvAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Publicidade Rádio</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'radioAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Publicidade Online</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'onlineAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Publicidade Outdoor</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'outdoorAdvertising'))}</td>
                                </tr>
                                <tr>
                                    <th>Patrocínios</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'sponsorships'))}</td>
                                </tr>
                                <tr>
                                    <th>Promoções</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'promotions'))}</td>
                                </tr>
                                <tr>
                                    <th>Ações de Sampling</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'sampling'))}</td>
                                </tr>
                                <tr>
                                    <th>Marketing Digital</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'digitalMarketing'))}</td>
                                </tr>
                                <tr>
                                    <th>Marketing de Influenciadores</th>
                                    <td class="text-end">${this.formatarMoeda(this.somarCampo(dados, 'influencerMarketing'))}</td>
                                </tr>
                                <tr class="table-info">
                                    <th>Investimento Total</th>
                                    <td class="text-end fw-bold">${this.formatarMoeda(this.somarCampo(dados, 'totalMarketingSpend'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-broadcast"></i> Métricas de Comunicação</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">GRPs TV</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'tvGRPs'))}</td>
                                </tr>
                                <tr>
                                    <th>GRPs Rádio</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'radioGRPs'))}</td>
                                </tr>
                                <tr>
                                    <th>Inserções na Imprensa</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'pressInsertions'))}</td>
                                </tr>
                                <tr>
                                    <th>Outdoors Ativos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'outdoorsActive'))}</td>
                                </tr>
                                <tr>
                                    <th>Cobertura (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'adCoverage').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Frequência Média</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'adFrequency').toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <th>Share of Voice (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'shareOfVoice').toFixed(1)}%</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-graph-up"></i> Para Cálculo de Índices</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Share of Market (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'marketShare').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Share of Voice (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'shareOfVoice').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Share of Investment (%)</th>
                                    <td class="text-end">${this.calcularShareOfInvestment()}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarDadosDigitais() {
        const dados = this.obterDadosFiltrados();

        let html = `
            <div class="data-section">
                <h5 class="section-title">Componentes para Cálculo de Métricas de Marketing Digital</h5>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-globe"></i> Website</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Visitantes Únicos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'uniqueWebsiteVisitors'))}</td>
                                </tr>
                                <tr>
                                    <th>Sessões Totais</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'totalSessions'))}</td>
                                </tr>
                                <tr>
                                    <th>Páginas Vistas</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'pageViews'))}</td>
                                </tr>
                                <tr>
                                    <th>Taxa de Rejeição (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'bounceRate').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Duração Média da Sessão</th>
                                    <td class="text-end">${Math.round(this.calcularMedia(dados, 'avgSessionDuration'))} seg</td>
                                </tr>
                                <tr>
                                    <th>Páginas por Sessão</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'pagesPerSession').toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <th>% Novos vs Recorrentes</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'newVsReturning').toFixed(1)}%</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-megaphone"></i> Campanhas Digitais</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Impressões</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'campaignImpressions'))}</td>
                                </tr>
                                <tr>
                                    <th>Cliques</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'campaignClicks'))}</td>
                                </tr>
                                <tr>
                                    <th>CTR (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'campaignCTR').toFixed(2)}%</td>
                                </tr>
                                <tr>
                                    <th>CPC (€)</th>
                                    <td class="text-end">${this.formatarMoeda(this.calcularMedia(dados, 'campaignCPC'))}</td>
                                </tr>
                                <tr>
                                    <th>Conversões</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'campaignConversions'))}</td>
                                </tr>
                                <tr>
                                    <th>Taxa de Conversão (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'campaignConversionRate').toFixed(2)}%</td>
                                </tr>
                                <tr>
                                    <th>Custo por Conversão (€)</th>
                                    <td class="text-end">${this.formatarMoeda(this.calcularMedia(dados, 'costPerConversion'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6 class="text-muted mb-3"><i class="bi bi-instagram"></i> Redes Sociais</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Seguidores Facebook</th>
                                    <td class="text-end">${this.formatarNumero(this.obterUltimoValor(dados, 'facebookFollowers'))}</td>
                                </tr>
                                <tr>
                                    <th>Seguidores Instagram</th>
                                    <td class="text-end">${this.formatarNumero(this.obterUltimoValor(dados, 'instagramFollowers'))}</td>
                                </tr>
                                <tr>
                                    <th>Seguidores TikTok</th>
                                    <td class="text-end">${this.formatarNumero(this.obterUltimoValor(dados, 'tiktokFollowers'))}</td>
                                </tr>
                                <tr>
                                    <th>Seguidores Twitter/X</th>
                                    <td class="text-end">${this.formatarNumero(this.obterUltimoValor(dados, 'twitterFollowers'))}</td>
                                </tr>
                                <tr>
                                    <th>Posts Publicados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'totalSocialPosts'))}</td>
                                </tr>
                                <tr>
                                    <th>Alcance Orgânico</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'organicReach'))}</td>
                                </tr>
                                <tr>
                                    <th>Alcance Pago</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'paidReach'))}</td>
                                </tr>
                                <tr>
                                    <th>Taxa de Engagement (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'engagementRate').toFixed(2)}%</td>
                                </tr>
                                <tr>
                                    <th>Comentários</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'socialComments'))}</td>
                                </tr>
                                <tr>
                                    <th>Partilhas</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'socialShares'))}</td>
                                </tr>
                                <tr>
                                    <th>Menções</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'socialMentions'))}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6 class="text-muted mb-3 mt-4"><i class="bi bi-envelope"></i> Email Marketing</h6>
                        <table class="vertical-table">
                            <tbody>
                                <tr>
                                    <th width="60%">Base de Dados Email</th>
                                    <td class="text-end">${this.formatarNumero(this.obterUltimoValor(dados, 'emailDatabase'))}</td>
                                </tr>
                                <tr>
                                    <th>Emails Enviados</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'emailsSent'))}</td>
                                </tr>
                                <tr>
                                    <th>Emails Entregues</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'emailsDelivered'))}</td>
                                </tr>
                                <tr>
                                    <th>Emails Abertos</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'emailsOpened'))}</td>
                                </tr>
                                <tr>
                                    <th>Taxa de Abertura (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'emailOpenRate').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Cliques em Links</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'emailClicks'))}</td>
                                </tr>
                                <tr>
                                    <th>CTR Email (%)</th>
                                    <td class="text-end">${this.calcularMedia(dados, 'emailCTR').toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <th>Cancelamento de Subscrição</th>
                                    <td class="text-end">${this.formatarNumero(this.somarCampo(dados, 'emailUnsubscribes'))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    gerarTabelaResumo() {
        const dados = this.obterDadosFiltrados();
        const numRegistos = dados.length;

        let html = `
            <table class="table table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Tipo de Dados</th>
                        <th class="text-end">Registos Disponíveis</th>
                        <th class="text-end">Período</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i class="bi bi-calendar-day"></i> Dados ${this.periodoSelecionado === 'daily' ? 'Diários' :
                            this.periodoSelecionado === 'weekly' ? 'Semanais' :
                            this.periodoSelecionado === 'monthly' ? 'Mensais' :
                            this.periodoSelecionado === 'quarterly' ? 'Trimestrais' : 'Anuais'}</td>
                        <td class="text-end">${numRegistos}</td>
                        <td class="text-end">${document.getElementById('startDate').value} a ${document.getElementById('endDate').value}</td>
                        <td><span class="badge bg-success">Completo</span></td>
                    </tr>
                    <tr>
                        <td><i class="bi bi-currency-euro"></i> Componentes Financeiros</td>
                        <td class="text-end">16 métricas base</td>
                        <td class="text-end">Todos os períodos</td>
                        <td><span class="badge bg-success">Disponível</span></td>
                    </tr>
                    <tr>
                        <td><i class="bi bi-people"></i> Movimentações de Clientes</td>
                        <td class="text-end">24 indicadores</td>
                        <td class="text-end">Todos os períodos</td>
                        <td><span class="badge bg-success">Disponível</span></td>
                    </tr>
                    <tr>
                        <td><i class="bi bi-cart"></i> Pipeline de Vendas</td>
                        <td class="text-end">7 fases rastreadas</td>
                        <td class="text-end">Todos os períodos</td>
                        <td><span class="badge bg-success">Disponível</span></td>
                    </tr>
                    <tr>
                        <td><i class="bi bi-megaphone"></i> Investimentos Marketing</td>
                        <td class="text-end">9 categorias</td>
                        <td class="text-end">Todos os períodos</td>
                        <td><span class="badge bg-success">Disponível</span></td>
                    </tr>
                    <tr>
                        <td><i class="bi bi-laptop"></i> Métricas Digitais</td>
                        <td class="text-end">30+ indicadores</td>
                        <td class="text-end">Todos os períodos</td>
                        <td><span class="badge bg-success">Disponível</span></td>
                    </tr>
                </tbody>
            </table>
        `;
        return html;
    }

    // Funções auxiliares
    obterDadosFiltrados(marcaId = null) {
        const marca = marcaId || this.marcaSelecionada;

        if (marca === 'all') {
            // Agregar dados de todas as marcas
            let todosDados = [];
            marketSimulator.getAllBrands().forEach(brand => {
                const dados = marketSimulator.getHistoricalData(
                    brand.id,
                    this.periodoSelecionado,
                    this.dataInicio?.toISOString(),
                    this.dataFim?.toISOString()
                );
                todosDados = todosDados.concat(dados);
            });
            return todosDados;
        } else {
            return marketSimulator.getHistoricalData(
                marca,
                this.periodoSelecionado,
                this.dataInicio?.toISOString(),
                this.dataFim?.toISOString()
            );
        }
    }

    somarCampo(dados, campo) {
        return dados.reduce((soma, item) => soma + (parseFloat(item[campo]) || 0), 0);
    }

    calcularMedia(dados, campo) {
        if (dados.length === 0) return 0;
        return this.somarCampo(dados, campo) / dados.length;
    }

    obterUltimoValor(dados, campo) {
        if (dados.length === 0) return 0;
        return dados[dados.length - 1][campo] || 0;
    }

    calcularQuotaMercado() {
        if (this.marcaSelecionada === 'all') return '100.0';

        const marca = marketSimulator.getBrandInfo(this.marcaSelecionada);
        return marca ? (marca.marketShare * 100).toFixed(1) : '0.0';
    }

    calcularVendasPeriodo() {
        const dados = this.obterDadosFiltrados();
        return this.somarCampo(dados, 'unitsSold');
    }

    calcularVolumeNegocios() {
        const dados = this.obterDadosFiltrados();
        return this.somarCampo(dados, 'netRevenue');
    }

    calcularTotalClientes() {
        const dados = this.obterDadosFiltrados();
        if (dados.length === 0) return 0;

        const ultimoDado = dados[dados.length - 1];
        return (ultimoDado.totalB2CCustomers || 0) + (ultimoDado.totalB2BCustomers || 0);
    }

    calcularShareOfInvestment() {
        // Simplificado - seria calculado com dados de todas as marcas
        return (Math.random() * 30 + 10).toFixed(1);
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor || 0);
    }

    formatarNumero(valor) {
        return new Intl.NumberFormat('pt-PT').format(Math.round(valor || 0));
    }

    atualizarDataHora() {
        const agora = new Date();
        document.getElementById('currentDateTime').textContent = agora.toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    exportarParaExcel() {
        // Criar novo workbook
        const wb = XLSX.utils.book_new();

        // Dados por marca selecionada
        const marcas = this.marcaSelecionada === 'all'
            ? marketSimulator.getAllBrands()
            : [marketSimulator.getAllBrands().find(b => b.id === this.marcaSelecionada)];

        marcas.forEach(marca => {
            // Folha de Dados Completos
            const dadosCompletos = marketSimulator.getHistoricalData(marca.id, this.dataInicio, this.dataFim);
            const wsDados = XLSX.utils.json_to_sheet(dadosCompletos.map(d => ({
                'Data': new Date(d.date).toLocaleDateString('pt-PT'),
                'Marca': marca.name,
                'Vendas (un)': d.unitsSold,
                'Vendas Brutas (€)': d.grossRevenue,
                'Descontos (€)': d.discountsGiven,
                'Devoluções (€)': d.returnsValue,
                'Vendas Líquidas (€)': d.netRevenue,
                'Clientes B2C': d.totalB2CCustomers,
                'Clientes B2B': d.totalB2BCustomers,
                'Novos Clientes': d.newB2CCustomers,
                'Investimento Marketing (€)': d.marketingInvestment,
                'Impressões': d.impressions,
                'Cliques': d.clicks,
                'Conversões': d.conversions,
                'Seguidores Sociais': d.socialFollowers,
                'Engagement Rate (%)': d.engagementRate,
                'Quota Mercado (%)': ((d.unitsSold / marketSimulator.getTotalMarketSales(d.date)) * 100).toFixed(2)
            })));
            XLSX.utils.book_append_sheet(wb, wsDados, marca.id === 'all' ? 'Todos Dados' : marca.name);
        });

        // Folha de Componentes Financeiros
        const componentesFinanceiros = this.gerarDadosExcelFinanceiros();
        const wsFinanceiro = XLSX.utils.json_to_sheet(componentesFinanceiros);
        XLSX.utils.book_append_sheet(wb, wsFinanceiro, 'Financeiro');

        // Folha de Componentes Clientes
        const componentesClientes = this.gerarDadosExcelClientes();
        const wsClientes = XLSX.utils.json_to_sheet(componentesClientes);
        XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

        // Folha de Análise de Mercado
        const analise = this.gerarAnaliseExcel();
        const wsAnalise = XLSX.utils.json_to_sheet(analise);
        XLSX.utils.book_append_sheet(wb, wsAnalise, 'Análise');

        // Exportar ficheiro
        const nomeFicheiro = `metricas_marketing_${this.marcaSelecionada}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, nomeFicheiro);
    }

    gerarDadosExcelFinanceiros() {
        const dados = this.obterDadosFiltrados();
        return [{
            'Componente': 'Vendas Brutas',
            'Valor (€)': this.somarCampo(dados, 'grossRevenue'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Descontos Concedidos',
            'Valor (€)': this.somarCampo(dados, 'discountsGiven'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Devoluções',
            'Valor (€)': this.somarCampo(dados, 'returnsValue'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Vendas Líquidas',
            'Valor (€)': this.somarCampo(dados, 'netRevenue'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Custos Diretos',
            'Valor (€)': this.somarCampo(dados, 'directCosts'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Custos Indiretos',
            'Valor (€)': this.somarCampo(dados, 'indirectCosts'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Margem Bruta',
            'Valor (€)': this.somarCampo(dados, 'grossMargin'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }, {
            'Componente': 'Lucro Líquido',
            'Valor (€)': this.somarCampo(dados, 'netProfit'),
            'Período': `${this.dataInicio.toLocaleDateString('pt-PT')} - ${this.dataFim.toLocaleDateString('pt-PT')}`
        }];
    }

    gerarDadosExcelClientes() {
        const dados = this.obterDadosFiltrados();
        const ultimoDado = dados[dados.length - 1] || {};
        return [{
            'Métrica': 'Total Clientes B2C',
            'Valor': ultimoDado.totalB2CCustomers || 0,
            'Tipo': 'Stock'
        }, {
            'Métrica': 'Total Clientes B2B',
            'Valor': ultimoDado.totalB2BCustomers || 0,
            'Tipo': 'Stock'
        }, {
            'Métrica': 'Novos Clientes (período)',
            'Valor': this.somarCampo(dados, 'newB2CCustomers'),
            'Tipo': 'Fluxo'
        }, {
            'Métrica': 'Clientes Perdidos (período)',
            'Valor': this.somarCampo(dados, 'lostB2CCustomers'),
            'Tipo': 'Fluxo'
        }, {
            'Métrica': 'Clientes Retidos',
            'Valor': ultimoDado.retainedB2CCustomers || 0,
            'Tipo': 'Stock'
        }, {
            'Métrica': 'Clientes Reativados',
            'Valor': this.somarCampo(dados, 'reactivatedB2CCustomers'),
            'Tipo': 'Fluxo'
        }];
    }

    gerarAnaliseExcel() {
        const dados = this.obterDadosFiltrados();
        return [{
            'Análise': 'Quota de Mercado',
            'Valor': `${this.calcularQuotaMercado()}%`,
            'Interpretação': 'Percentagem do mercado total'
        }, {
            'Análise': 'Taxa de Crescimento',
            'Valor': `${this.calcularTaxaCrescimento()}%`,
            'Interpretação': 'Crescimento no período analisado'
        }, {
            'Análise': 'ROI Marketing',
            'Valor': this.calcularROI(),
            'Interpretação': 'Retorno sobre investimento em marketing'
        }, {
            'Análise': 'Taxa de Retenção',
            'Valor': `${this.calcularTaxaRetencao()}%`,
            'Interpretação': 'Percentagem de clientes retidos'
        }];
    }

    calcularTaxaCrescimento() {
        const dados = this.obterDadosFiltrados();
        if (dados.length < 2) return 0;
        const primeiro = dados[0].netRevenue;
        const ultimo = dados[dados.length - 1].netRevenue;
        return ((ultimo - primeiro) / primeiro * 100).toFixed(1);
    }

    calcularROI() {
        const dados = this.obterDadosFiltrados();
        const receita = this.somarCampo(dados, 'netRevenue');
        const investimento = this.somarCampo(dados, 'marketingInvestment');
        return investimento > 0 ? ((receita - investimento) / investimento).toFixed(2) : '0';
    }

    calcularTaxaRetencao() {
        const dados = this.obterDadosFiltrados();
        const ultimoDado = dados[dados.length - 1] || {};
        const totalClientes = ultimoDado.totalB2CCustomers || 1;
        const clientesRetidos = ultimoDado.retainedB2CCustomers || 0;
        return (clientesRetidos / totalClientes * 100).toFixed(1);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.simuladorMetricas = new SimuladorMetricasMarketing();
    console.log('✅ Simulador de Métricas de Marketing - Carregado');
    console.log('📊 8 marcas | 730 dias de dados | Terminologia PT-PT');
});