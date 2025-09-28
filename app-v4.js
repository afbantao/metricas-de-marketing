// App V4 - Sistema Completo com TODOS os Dados Históricos

class SimuladorCompleto {
    constructor() {
        this.marcaSelecionada = 'all';
        this.periodoSelecionado = 'all';
        this.vistaSelecionada = 'daily';
        this.dadosCompletos = [];
        this.charts = {};

        this.init();
    }

    init() {
        console.log('🚀 Inicializando Simulador V4 Completo...');

        // Carregar todos os dados
        this.carregarDadosCompletos();

        // Inicializar interface
        this.atualizarDados();

        // Configurar eventos
        this.configurarEventos();

        console.log('✅ Sistema V4 Pronto - 730 dias de dados carregados!');
    }

    carregarDadosCompletos() {
        // Carregar TODOS os dados de TODAS as marcas
        this.dadosCompletos = [];
        const marcas = marketSimulator.getAllBrands();

        marcas.forEach(marca => {
            const dados = marketSimulator.getHistoricalData(marca.id);
            dados.forEach(d => {
                this.dadosCompletos.push({
                    ...d,
                    brandId: marca.id,
                    brandName: marca.name
                });
            });
        });

        console.log(`📊 ${this.dadosCompletos.length} registos carregados`);
    }

    configurarEventos() {
        // Tabs
        const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
        tabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const target = e.target.getAttribute('href');
                this.atualizarTabConteudo(target);
            });
        });
    }

    atualizarDados() {
        // Obter valores dos filtros
        this.marcaSelecionada = document.getElementById('brandSelect').value;
        this.periodoSelecionado = document.getElementById('periodSelect').value;

        // Filtrar dados
        const dadosFiltrados = this.filtrarDados();

        // Atualizar cards de estatísticas
        this.atualizarEstatisticas(dadosFiltrados);

        // Atualizar tabela histórica
        this.atualizarTabelaHistorico(dadosFiltrados);

        // Atualizar gráficos
        this.atualizarGraficos(dadosFiltrados);
    }

    filtrarDados() {
        let dados = [...this.dadosCompletos];

        // Filtrar por marca
        if (this.marcaSelecionada !== 'all') {
            dados = dados.filter(d => d.brandId === this.marcaSelecionada);
        }

        // Filtrar por período
        const hoje = new Date();
        const dataLimite = new Date();

        switch(this.periodoSelecionado) {
            case 'last30':
                dataLimite.setDate(hoje.getDate() - 30);
                dados = dados.filter(d => new Date(d.date) >= dataLimite);
                break;
            case 'last90':
                dataLimite.setDate(hoje.getDate() - 90);
                dados = dados.filter(d => new Date(d.date) >= dataLimite);
                break;
            case 'last180':
                dataLimite.setDate(hoje.getDate() - 180);
                dados = dados.filter(d => new Date(d.date) >= dataLimite);
                break;
            case 'last365':
                dataLimite.setDate(hoje.getDate() - 365);
                dados = dados.filter(d => new Date(d.date) >= dataLimite);
                break;
            case 'year1':
                dados = dados.slice(0, 365);
                break;
            case 'year2':
                dados = dados.slice(365, 730);
                break;
        }

        return dados;
    }

    atualizarEstatisticas(dados) {
        // Calcular estatísticas
        const vendasTotais = dados.reduce((sum, d) => sum + d.unitsSold, 0);
        const receitaTotal = dados.reduce((sum, d) => sum + d.netRevenue, 0);

        // Clientes únicos (último valor)
        let clientesTotal = 0;
        if (this.marcaSelecionada === 'all') {
            // Somar clientes de todas as marcas
            const marcas = [...new Set(dados.map(d => d.brandId))];
            marcas.forEach(marca => {
                const dadosMarca = dados.filter(d => d.brandId === marca);
                const ultimo = dadosMarca[dadosMarca.length - 1];
                if (ultimo) {
                    clientesTotal += (ultimo.totalB2CCustomers || 0) + (ultimo.totalB2BCustomers || 0);
                }
            });
        } else {
            const ultimo = dados[dados.length - 1];
            if (ultimo) {
                clientesTotal = (ultimo.totalB2CCustomers || 0) + (ultimo.totalB2BCustomers || 0);
            }
        }

        // Quota de mercado
        let quotaMercado = 0;
        let posicao = '--';

        if (this.marcaSelecionada !== 'all') {
            const vendasMarca = dados.reduce((sum, d) => sum + d.unitsSold, 0);
            const todasVendas = this.dadosCompletos
                .filter(d => {
                    const dataD = new Date(d.date);
                    return dados.some(df => new Date(df.date).getTime() === dataD.getTime());
                })
                .reduce((sum, d) => sum + d.unitsSold, 0);

            quotaMercado = todasVendas > 0 ? (vendasMarca / todasVendas * 100) : 0;

            // Calcular posição
            const marcas = marketSimulator.getAllBrands();
            const quotas = [];
            marcas.forEach(marca => {
                const vendas = this.dadosCompletos
                    .filter(d => d.brandId === marca.id)
                    .reduce((sum, d) => sum + d.unitsSold, 0);
                quotas.push({ marca: marca.id, vendas });
            });
            quotas.sort((a, b) => b.vendas - a.vendas);
            posicao = quotas.findIndex(q => q.marca === this.marcaSelecionada) + 1;
        } else {
            quotaMercado = 100;
            posicao = 'Todas';
        }

        // Atualizar UI
        document.getElementById('marketShareValue').textContent = quotaMercado.toFixed(1) + '%';
        document.getElementById('marketPosition').textContent = posicao + 'º';
        document.getElementById('totalSalesValue').textContent = this.formatarNumero(vendasTotais);
        document.getElementById('revenueValue').textContent = this.formatarMoeda(receitaTotal);
        document.getElementById('customersValue').textContent = this.formatarNumero(clientesTotal);
    }

    atualizarTabelaHistorico(dados) {
        const tbody = document.getElementById('historicoTableBody');
        tbody.innerHTML = '';

        // Ordenar por data (mais recente primeiro)
        dados.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limitar a 1000 linhas para performance
        const dadosLimitados = dados.slice(0, 1000);

        dadosLimitados.forEach(d => {
            const tr = document.createElement('tr');

            // Calcular quota de mercado para esta data
            const vendasDia = this.dadosCompletos
                .filter(dc => dc.date === d.date)
                .reduce((sum, dc) => sum + dc.unitsSold, 0);
            const quota = vendasDia > 0 ? (d.unitsSold / vendasDia * 100) : 0;

            tr.innerHTML = `
                <td>${new Date(d.date).toLocaleDateString('pt-PT')}</td>
                <td><span class="badge brand-${d.brandId}">${d.brandName}</span></td>
                <td>${this.formatarNumero(d.unitsSold)}</td>
                <td>${this.formatarMoeda(d.grossRevenue)}</td>
                <td>${this.formatarMoeda(d.discountsGiven)}</td>
                <td><strong>${this.formatarMoeda(d.netRevenue)}</strong></td>
                <td>${this.formatarNumero(d.totalB2CCustomers)}</td>
                <td>${this.formatarNumero(d.totalB2BCustomers)}</td>
                <td>${this.formatarNumero(d.newB2CCustomers)}</td>
                <td>${this.formatarMoeda(d.marketingInvestment)}</td>
                <td><strong>${quota.toFixed(2)}%</strong></td>
            `;

            tbody.appendChild(tr);
        });
    }

    atualizarTabConteudo(target) {
        switch(target) {
            case '#financeiro':
                this.carregarDadosFinanceiros();
                break;
            case '#clientes':
                this.carregarDadosClientes();
                break;
            case '#marketing':
                this.carregarDadosMarketing();
                break;
            case '#digital':
                this.carregarDadosDigitais();
                break;
            case '#competicao':
                this.carregarAnaliseCompetitiva();
                break;
        }
    }

    carregarDadosFinanceiros() {
        const dados = this.filtrarDados();
        const container = document.getElementById('financeiroContent');

        // Agrupar dados por marca se "all" selecionado
        const marcas = this.marcaSelecionada === 'all'
            ? marketSimulator.getAllBrands()
            : [marketSimulator.getAllBrands().find(m => m.id === this.marcaSelecionada)];

        let html = '<div class="row">';

        marcas.forEach(marca => {
            const dadosMarca = dados.filter(d => d.brandId === marca.id);

            const vendasBrutas = dadosMarca.reduce((sum, d) => sum + d.grossRevenue, 0);
            const descontos = dadosMarca.reduce((sum, d) => sum + d.discountsGiven, 0);
            const devolucoes = dadosMarca.reduce((sum, d) => sum + d.returnsValue, 0);
            const vendasLiquidas = dadosMarca.reduce((sum, d) => sum + d.netRevenue, 0);
            const custosDirectos = dadosMarca.reduce((sum, d) => sum + d.directCosts, 0);
            const custosIndirectos = dadosMarca.reduce((sum, d) => sum + d.indirectCosts, 0);
            const margemBruta = dadosMarca.reduce((sum, d) => sum + d.grossMargin, 0);
            const lucro = dadosMarca.reduce((sum, d) => sum + d.netProfit, 0);

            html += `
                <div class="col-md-6 mb-4">
                    <h6 class="text-primary">${marca.name}</h6>
                    <table class="table table-sm">
                        <tr><td>Vendas Brutas</td><td class="text-end">${this.formatarMoeda(vendasBrutas)}</td></tr>
                        <tr><td>Descontos</td><td class="text-end text-danger">-${this.formatarMoeda(descontos)}</td></tr>
                        <tr><td>Devoluções</td><td class="text-end text-danger">-${this.formatarMoeda(devolucoes)}</td></tr>
                        <tr class="table-primary"><td><strong>Vendas Líquidas</strong></td><td class="text-end"><strong>${this.formatarMoeda(vendasLiquidas)}</strong></td></tr>
                        <tr><td>Custos Directos</td><td class="text-end text-danger">-${this.formatarMoeda(custosDirectos)}</td></tr>
                        <tr><td>Custos Indirectos</td><td class="text-end text-danger">-${this.formatarMoeda(custosIndirectos)}</td></tr>
                        <tr class="table-warning"><td><strong>Margem Bruta</strong></td><td class="text-end"><strong>${this.formatarMoeda(margemBruta)}</strong></td></tr>
                        <tr class="table-success"><td><strong>Lucro Líquido</strong></td><td class="text-end"><strong>${this.formatarMoeda(lucro)}</strong></td></tr>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    carregarDadosClientes() {
        const dados = this.filtrarDados();
        const container = document.getElementById('clientesContent');

        const marcas = this.marcaSelecionada === 'all'
            ? marketSimulator.getAllBrands()
            : [marketSimulator.getAllBrands().find(m => m.id === this.marcaSelecionada)];

        let html = '<div class="row">';

        marcas.forEach(marca => {
            const dadosMarca = dados.filter(d => d.brandId === marca.id);
            const ultimo = dadosMarca[dadosMarca.length - 1] || {};

            const totalB2C = ultimo.totalB2CCustomers || 0;
            const totalB2B = ultimo.totalB2BCustomers || 0;
            const novosClientes = dadosMarca.reduce((sum, d) => sum + d.newB2CCustomers, 0);
            const clientesPerdidos = dadosMarca.reduce((sum, d) => sum + d.lostB2CCustomers, 0);
            const clientesRetidos = ultimo.retainedB2CCustomers || 0;
            const clientesReativados = dadosMarca.reduce((sum, d) => sum + d.reactivatedB2CCustomers, 0);

            // Calcular métricas derivadas
            const taxaRetencao = totalB2C > 0 ? (clientesRetidos / totalB2C * 100) : 0;
            const taxaChurn = totalB2C > 0 ? (clientesPerdidos / totalB2C * 100) : 0;
            const clv = dadosMarca.reduce((sum, d) => sum + d.customerLifetimeValue, 0) / dadosMarca.length;

            html += `
                <div class="col-md-6 mb-4">
                    <h6 class="text-primary">${marca.name}</h6>
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr><th colspan="2">Base de Clientes</th></tr>
                        </thead>
                        <tr><td>Total B2C</td><td class="text-end">${this.formatarNumero(totalB2C)}</td></tr>
                        <tr><td>Total B2B</td><td class="text-end">${this.formatarNumero(totalB2B)}</td></tr>
                        <tr class="table-info"><td><strong>Total Geral</strong></td><td class="text-end"><strong>${this.formatarNumero(totalB2C + totalB2B)}</strong></td></tr>

                        <thead class="table-light">
                            <tr><th colspan="2">Movimentação (período)</th></tr>
                        </thead>
                        <tr><td>Novos Clientes</td><td class="text-end text-success">+${this.formatarNumero(novosClientes)}</td></tr>
                        <tr><td>Clientes Perdidos</td><td class="text-end text-danger">-${this.formatarNumero(clientesPerdidos)}</td></tr>
                        <tr><td>Clientes Retidos</td><td class="text-end">${this.formatarNumero(clientesRetidos)}</td></tr>
                        <tr><td>Clientes Reativados</td><td class="text-end text-success">+${this.formatarNumero(clientesReativados)}</td></tr>

                        <thead class="table-light">
                            <tr><th colspan="2">Métricas</th></tr>
                        </thead>
                        <tr><td>Taxa de Retenção</td><td class="text-end">${taxaRetencao.toFixed(1)}%</td></tr>
                        <tr><td>Taxa de Churn</td><td class="text-end">${taxaChurn.toFixed(1)}%</td></tr>
                        <tr><td>CLV Médio</td><td class="text-end">${this.formatarMoeda(clv)}</td></tr>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    carregarDadosMarketing() {
        const dados = this.filtrarDados();
        const container = document.getElementById('marketingContent');

        const marcas = this.marcaSelecionada === 'all'
            ? marketSimulator.getAllBrands()
            : [marketSimulator.getAllBrands().find(m => m.id === this.marcaSelecionada)];

        let html = '<div class="row">';

        marcas.forEach(marca => {
            const dadosMarca = dados.filter(d => d.brandId === marca.id);

            const investTotal = dadosMarca.reduce((sum, d) => sum + d.marketingInvestment, 0);
            const investATL = dadosMarca.reduce((sum, d) => sum + d.atlInvestment, 0);
            const investBTL = dadosMarca.reduce((sum, d) => sum + d.btlInvestment, 0);
            const investDigital = dadosMarca.reduce((sum, d) => sum + d.digitalInvestment, 0);
            const impressoes = dadosMarca.reduce((sum, d) => sum + d.impressions, 0);
            const alcance = dadosMarca.reduce((sum, d) => sum + d.reach, 0) / dadosMarca.length;
            const frequencia = impressoes / alcance;

            // ROI de Marketing
            const receita = dadosMarca.reduce((sum, d) => sum + d.netRevenue, 0);
            const roi = investTotal > 0 ? ((receita - investTotal) / investTotal * 100) : 0;

            html += `
                <div class="col-md-6 mb-4">
                    <h6 class="text-primary">${marca.name}</h6>
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr><th colspan="2">Investimentos</th></tr>
                        </thead>
                        <tr><td>Investimento Total</td><td class="text-end">${this.formatarMoeda(investTotal)}</td></tr>
                        <tr><td>ATL (TV, Rádio, Outdoor)</td><td class="text-end">${this.formatarMoeda(investATL)}</td></tr>
                        <tr><td>BTL (Promoções, Eventos)</td><td class="text-end">${this.formatarMoeda(investBTL)}</td></tr>
                        <tr><td>Digital</td><td class="text-end">${this.formatarMoeda(investDigital)}</td></tr>

                        <thead class="table-light">
                            <tr><th colspan="2">Alcance e Frequência</th></tr>
                        </thead>
                        <tr><td>Impressões Totais</td><td class="text-end">${this.formatarNumero(impressoes)}</td></tr>
                        <tr><td>Alcance Médio</td><td class="text-end">${this.formatarNumero(Math.round(alcance))}</td></tr>
                        <tr><td>Frequência Média</td><td class="text-end">${frequencia.toFixed(1)}</td></tr>

                        <thead class="table-light">
                            <tr><th colspan="2">Performance</th></tr>
                        </thead>
                        <tr><td>ROI de Marketing</td><td class="text-end ${roi > 0 ? 'text-success' : 'text-danger'}">${roi.toFixed(1)}%</td></tr>
                        <tr><td>Custo por Cliente</td><td class="text-end">${this.formatarMoeda(investTotal / dadosMarca.reduce((sum, d) => sum + d.newB2CCustomers, 0))}</td></tr>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    carregarDadosDigitais() {
        const dados = this.filtrarDados();
        const container = document.getElementById('digitalContent');

        const marcas = this.marcaSelecionada === 'all'
            ? marketSimulator.getAllBrands()
            : [marketSimulator.getAllBrands().find(m => m.id === this.marcaSelecionada)];

        let html = '<div class="row">';

        marcas.forEach(marca => {
            const dadosMarca = dados.filter(d => d.brandId === marca.id);

            const visitantes = dadosMarca.reduce((sum, d) => sum + d.websiteVisitors, 0);
            const sessoes = dadosMarca.reduce((sum, d) => sum + d.totalSessions, 0);
            const pageViews = dadosMarca.reduce((sum, d) => sum + d.pageViews, 0);
            const bounceRate = dadosMarca.reduce((sum, d) => sum + d.bounceRate, 0) / dadosMarca.length;
            const conversoes = dadosMarca.reduce((sum, d) => sum + d.onlineConversions, 0);
            const taxaConversao = visitantes > 0 ? (conversoes / visitantes * 100) : 0;

            // Social Media
            const ultimo = dadosMarca[dadosMarca.length - 1] || {};
            const seguidoresFB = ultimo.facebookFollowers || 0;
            const seguidoresIG = ultimo.instagramFollowers || 0;
            const seguidoresLI = ultimo.linkedinFollowers || 0;
            const engagementRate = dadosMarca.reduce((sum, d) => sum + d.engagementRate, 0) / dadosMarca.length;

            html += `
                <div class="col-md-6 mb-4">
                    <h6 class="text-primary">${marca.name}</h6>
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr><th colspan="2">Website</th></tr>
                        </thead>
                        <tr><td>Visitantes Únicos</td><td class="text-end">${this.formatarNumero(visitantes)}</td></tr>
                        <tr><td>Sessões</td><td class="text-end">${this.formatarNumero(sessoes)}</td></tr>
                        <tr><td>Páginas Vistas</td><td class="text-end">${this.formatarNumero(pageViews)}</td></tr>
                        <tr><td>Taxa de Rejeição</td><td class="text-end">${bounceRate.toFixed(1)}%</td></tr>
                        <tr><td>Conversões</td><td class="text-end">${this.formatarNumero(conversoes)}</td></tr>
                        <tr><td>Taxa de Conversão</td><td class="text-end">${taxaConversao.toFixed(2)}%</td></tr>

                        <thead class="table-light">
                            <tr><th colspan="2">Redes Sociais</th></tr>
                        </thead>
                        <tr><td>Facebook</td><td class="text-end">${this.formatarNumero(seguidoresFB)}</td></tr>
                        <tr><td>Instagram</td><td class="text-end">${this.formatarNumero(seguidoresIG)}</td></tr>
                        <tr><td>LinkedIn</td><td class="text-end">${this.formatarNumero(seguidoresLI)}</td></tr>
                        <tr><td>Total Seguidores</td><td class="text-end"><strong>${this.formatarNumero(seguidoresFB + seguidoresIG + seguidoresLI)}</strong></td></tr>
                        <tr><td>Taxa Engagement</td><td class="text-end">${engagementRate.toFixed(2)}%</td></tr>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    carregarAnaliseCompetitiva() {
        const container = document.getElementById('competicaoContent');
        const marcas = marketSimulator.getAllBrands();

        let html = `
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Marca</th>
                        <th>Quota Mercado</th>
                        <th>Vendas (un)</th>
                        <th>Faturação</th>
                        <th>Clientes</th>
                        <th>Invest. Marketing</th>
                        <th>ROI</th>
                        <th>Crescimento</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const analises = [];

        marcas.forEach(marca => {
            const dados = this.dadosCompletos.filter(d => d.brandId === marca.id);
            const vendas = dados.reduce((sum, d) => sum + d.unitsSold, 0);
            const faturacao = dados.reduce((sum, d) => sum + d.netRevenue, 0);
            const investimento = dados.reduce((sum, d) => sum + d.marketingInvestment, 0);
            const ultimo = dados[dados.length - 1] || {};
            const clientes = (ultimo.totalB2CCustomers || 0) + (ultimo.totalB2BCustomers || 0);

            // Calcular crescimento
            const primeiroMes = dados.slice(0, 30).reduce((sum, d) => sum + d.netRevenue, 0);
            const ultimoMes = dados.slice(-30).reduce((sum, d) => sum + d.netRevenue, 0);
            const crescimento = primeiroMes > 0 ? ((ultimoMes - primeiroMes) / primeiroMes * 100) : 0;

            // ROI
            const roi = investimento > 0 ? ((faturacao - investimento) / investimento * 100) : 0;

            analises.push({
                marca,
                vendas,
                faturacao,
                clientes,
                investimento,
                roi,
                crescimento
            });
        });

        // Calcular quotas
        const totalVendas = analises.reduce((sum, a) => sum + a.vendas, 0);
        analises.forEach(a => {
            a.quota = totalVendas > 0 ? (a.vendas / totalVendas * 100) : 0;
        });

        // Ordenar por quota
        analises.sort((a, b) => b.quota - a.quota);

        analises.forEach((a, index) => {
            html += `
                <tr class="${a.marca.id === this.marcaSelecionada ? 'table-primary' : ''}">
                    <td>
                        <strong>${index + 1}º</strong>
                        <span class="badge brand-${a.marca.id}">${a.marca.name}</span>
                    </td>
                    <td><strong>${a.quota.toFixed(1)}%</strong></td>
                    <td>${this.formatarNumero(a.vendas)}</td>
                    <td>${this.formatarMoeda(a.faturacao)}</td>
                    <td>${this.formatarNumero(a.clientes)}</td>
                    <td>${this.formatarMoeda(a.investimento)}</td>
                    <td class="${a.roi > 0 ? 'text-success' : 'text-danger'}">${a.roi.toFixed(0)}%</td>
                    <td class="${a.crescimento > 0 ? 'text-success' : 'text-danger'}">
                        ${a.crescimento > 0 ? '↑' : '↓'} ${Math.abs(a.crescimento).toFixed(1)}%
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    atualizarGraficos(dados) {
        // Gráfico de vendas
        this.criarGraficoVendas(dados);

        // Gráfico de quota de mercado
        this.criarGraficoQuotaMercado();

        // Gráfico comparativo
        this.criarGraficoComparativo();
    }

    criarGraficoVendas(dados) {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        // Destruir gráfico anterior
        if (this.charts.sales) {
            this.charts.sales.destroy();
        }

        // Preparar dados agregados por mês
        const meses = {};
        dados.forEach(d => {
            const mes = new Date(d.date).toISOString().slice(0, 7);
            if (!meses[mes]) {
                meses[mes] = {
                    vendas: 0,
                    receita: 0
                };
            }
            meses[mes].vendas += d.unitsSold;
            meses[mes].receita += d.netRevenue;
        });

        const labels = Object.keys(meses);
        const vendasData = labels.map(m => meses[m].vendas);
        const receitaData = labels.map(m => meses[m].receita);

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas (unidades)',
                    data: vendasData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y',
                    tension: 0.3
                }, {
                    label: 'Receita (€)',
                    data: receitaData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });
    }

    criarGraficoQuotaMercado() {
        const ctx = document.getElementById('marketShareChart');
        if (!ctx) return;

        if (this.charts.marketShare) {
            this.charts.marketShare.destroy();
        }

        const marcas = marketSimulator.getAllBrands();
        const labels = marcas.map(m => m.name);
        const data = [];

        marcas.forEach(marca => {
            const vendas = this.dadosCompletos
                .filter(d => d.brandId === marca.id)
                .reduce((sum, d) => sum + d.unitsSold, 0);
            data.push(vendas);
        });

        this.charts.marketShare = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#ffd54f', '#90caf9', '#ffab91', '#a5d6a7',
                        '#ce93d8', '#80deea', '#bcaaa4', '#ef9a9a'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição do Mercado (730 dias)'
                    }
                }
            }
        });
    }

    criarGraficoComparativo() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        const marcas = marketSimulator.getAllBrands();
        const labels = marcas.map(m => m.name);
        const vendas = [];
        const clientes = [];

        marcas.forEach(marca => {
            const dados = this.dadosCompletos.filter(d => d.brandId === marca.id);
            vendas.push(dados.reduce((sum, d) => sum + d.unitsSold, 0));

            const ultimo = dados[dados.length - 1] || {};
            clientes.push((ultimo.totalB2CCustomers || 0) + (ultimo.totalB2BCustomers || 0));
        });

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas Totais',
                    data: vendas,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    yAxisID: 'y',
                }, {
                    label: 'Base de Clientes',
                    data: clientes,
                    backgroundColor: 'rgba(255, 206, 86, 0.8)',
                    yAxisID: 'y1',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Vendas (unidades)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Clientes'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });
    }

    formatarNumero(valor) {
        return new Intl.NumberFormat('pt-PT').format(Math.round(valor || 0));
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor || 0);
    }
}

// Função global para exportar TUDO para Excel
function exportarTudoExcel() {
    console.log('📊 Exportando TODOS os dados para Excel...');

    const wb = XLSX.utils.book_new();
    const marcas = marketSimulator.getAllBrands();

    // 1. Folha com TODOS os dados históricos
    const todosOsDados = [];
    marcas.forEach(marca => {
        const dados = marketSimulator.getHistoricalData(marca.id);
        dados.forEach(d => {
            todosOsDados.push({
                'Data': new Date(d.date).toLocaleDateString('pt-PT'),
                'Ano': new Date(d.date).getFullYear(),
                'Mês': new Date(d.date).getMonth() + 1,
                'Dia': new Date(d.date).getDate(),
                'Dia Semana': ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][new Date(d.date).getDay()],
                'Marca': marca.name,
                'Vendas (un)': d.unitsSold,
                'Preço Médio': d.averagePrice,
                'Vendas Brutas €': d.grossRevenue,
                'Descontos €': d.discountsGiven,
                'Devoluções €': d.returnsValue,
                'Vendas Líquidas €': d.netRevenue,
                'Custos Directos €': d.directCosts,
                'Custos Indirectos €': d.indirectCosts,
                'Margem Bruta €': d.grossMargin,
                'Lucro Líquido €': d.netProfit,
                'Clientes B2C': d.totalB2CCustomers,
                'Clientes B2B': d.totalB2BCustomers,
                'Novos Clientes B2C': d.newB2CCustomers,
                'Clientes Perdidos': d.lostB2CCustomers,
                'Clientes Retidos': d.retainedB2CCustomers,
                'Clientes Reativados': d.reactivatedB2CCustomers,
                'Investimento Marketing €': d.marketingInvestment,
                'Investimento ATL €': d.atlInvestment,
                'Investimento BTL €': d.btlInvestment,
                'Investimento Digital €': d.digitalInvestment,
                'Impressões': d.impressions,
                'Alcance': d.reach,
                'Cliques': d.clicks,
                'Conversões': d.conversions,
                'Website Visitantes': d.websiteVisitors,
                'Website Sessões': d.totalSessions,
                'Website Page Views': d.pageViews,
                'Bounce Rate %': d.bounceRate,
                'Facebook Seguidores': d.facebookFollowers,
                'Instagram Seguidores': d.instagramFollowers,
                'LinkedIn Seguidores': d.linkedinFollowers,
                'Engagement Rate %': d.engagementRate,
                'Pontos de Venda': d.pointsOfSale,
                'Distribuição %': d.distributionCoverage,
                'Stock Médio': d.averageStock,
                'Rotação Stock': d.stockTurnover,
                'NPS Score': d.npsScore,
                'Satisfação Score': d.satisfactionScore,
                'CLV €': d.customerLifetimeValue
            });
        });
    });

    const wsHistorico = XLSX.utils.json_to_sheet(todosOsDados);
    XLSX.utils.book_append_sheet(wb, wsHistorico, 'Histórico Completo');

    // 2. Folha de Resumo por Marca
    const resumoMarcas = [];
    marcas.forEach(marca => {
        const dados = marketSimulator.getHistoricalData(marca.id);
        const vendas = dados.reduce((sum, d) => sum + d.unitsSold, 0);
        const receita = dados.reduce((sum, d) => sum + d.netRevenue, 0);
        const lucro = dados.reduce((sum, d) => sum + d.netProfit, 0);
        const investimento = dados.reduce((sum, d) => sum + d.marketingInvestment, 0);
        const ultimo = dados[dados.length - 1];

        resumoMarcas.push({
            'Marca': marca.name,
            'Quota Mercado %': marca.currentMarketShare * 100,
            'Vendas Totais (un)': vendas,
            'Receita Total €': receita,
            'Lucro Total €': lucro,
            'Investimento Marketing €': investimento,
            'ROI %': investimento > 0 ? ((receita - investimento) / investimento * 100) : 0,
            'Clientes B2C': ultimo.totalB2CCustomers,
            'Clientes B2B': ultimo.totalB2BCustomers,
            'Total Clientes': ultimo.totalB2CCustomers + ultimo.totalB2BCustomers,
            'Preço Médio €': receita / vendas,
            'Ticket Médio €': ultimo.averageTicket,
            'CLV Médio €': dados.reduce((sum, d) => sum + d.customerLifetimeValue, 0) / dados.length,
            'NPS Médio': dados.reduce((sum, d) => sum + d.npsScore, 0) / dados.length,
            'Satisfação Média': dados.reduce((sum, d) => sum + d.satisfactionScore, 0) / dados.length
        });
    });

    const wsResumo = XLSX.utils.json_to_sheet(resumoMarcas);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Marcas');

    // 3. Folha de Análise Mensal
    const analiseMensal = [];
    const mesesMap = {};

    todosOsDados.forEach(d => {
        const chave = `${d.Ano}-${String(d.Mês).padStart(2, '0')}`;
        if (!mesesMap[chave]) {
            mesesMap[chave] = {
                'Ano-Mês': chave,
                'Vendas Total': 0,
                'Receita Total': 0,
                'Lucro Total': 0,
                'Clientes Novos': 0,
                'Investimento Marketing': 0
            };
        }
        mesesMap[chave]['Vendas Total'] += d['Vendas (un)'];
        mesesMap[chave]['Receita Total'] += d['Vendas Líquidas €'];
        mesesMap[chave]['Lucro Total'] += d['Lucro Líquido €'];
        mesesMap[chave]['Clientes Novos'] += d['Novos Clientes B2C'];
        mesesMap[chave]['Investimento Marketing'] += d['Investimento Marketing €'];
    });

    Object.values(mesesMap).forEach(mes => analiseMensal.push(mes));
    analiseMensal.sort((a, b) => a['Ano-Mês'].localeCompare(b['Ano-Mês']));

    const wsMensal = XLSX.utils.json_to_sheet(analiseMensal);
    XLSX.utils.book_append_sheet(wb, wsMensal, 'Análise Mensal');

    // 4. Folha de Decisões e Eventos
    const decisoes = [];
    marcas.forEach(marca => {
        const brandDecisions = marketSimulator.brandDecisions[marca.id] || [];
        brandDecisions.forEach(d => {
            decisoes.push({
                'Data': new Date(d.date).toLocaleDateString('pt-PT'),
                'Marca': marca.name,
                'Tipo': d.type,
                'Decisão': d.decision,
                'Descrição': d.description,
                'Impacto Vendas %': d.impact.sales * 100,
                'Impacto Quota %': d.impact.marketShare * 100,
                'Impacto Clientes %': d.impact.customers * 100,
                'Duração (dias)': d.duration
            });
        });
    });

    const wsDecisoes = XLSX.utils.json_to_sheet(decisoes);
    XLSX.utils.book_append_sheet(wb, wsDecisoes, 'Decisões');

    // 5. Folha de Eventos de Mercado
    const eventos = marketSimulator.marketEvents.map(e => ({
        'Data': new Date(e.date).toLocaleDateString('pt-PT'),
        'Evento': e.event,
        'Descrição': e.description,
        'Tipo': e.type,
        'Impacto': e.impact,
        'Marcas Afetadas': e.affectedBrands.join(', ')
    }));

    const wsEventos = XLSX.utils.json_to_sheet(eventos);
    XLSX.utils.book_append_sheet(wb, wsEventos, 'Eventos Mercado');

    // Exportar o ficheiro
    const nomeArquivo = `simulador_metricas_completo_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);

    console.log('✅ Excel exportado com sucesso:', nomeArquivo);
    alert(`Excel exportado com sucesso!\n\nFicheiro: ${nomeArquivo}\n\nFolhas incluídas:\n- Histórico Completo (${todosOsDados.length} registos)\n- Resumo por Marca\n- Análise Mensal\n- Decisões Estratégicas\n- Eventos de Mercado`);
}

// Funções auxiliares globais
function atualizarDados() {
    window.simulador.atualizarDados();
}

function atualizarVista() {
    const vista = document.getElementById('viewSelect').value;
    // Implementar mudança de vista (diária, semanal, mensal, etc.)
    console.log('Vista alterada para:', vista);
    window.simulador.atualizarDados();
}

function mostrarAnaliseCompetitiva() {
    // Mudar para tab de competição
    const tab = document.querySelector('a[href="#competicao"]');
    const tabInstance = new bootstrap.Tab(tab);
    tabInstance.show();
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.simulador = new SimuladorCompleto();
    console.log('✅ Simulador V4 Completo Inicializado!');
    console.log('📊 Use exportarTudoExcel() para exportar TODOS os dados');
});