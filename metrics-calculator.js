// Metrics Calculator - All formulas from the course material

class MetricsCalculator {
    constructor() {
        this.metrics = {
            financial: [
                'marginUnitaria', 'marginPercentual', 'markup',
                'ros', 'roa', 'roe', 'breakEvenQtd', 'breakEvenValor',
                'marginSeguranca', 'retornoAbsoluto', 'pesoEsforco',
                'retornoRelativo', 'roiMarketing'
            ],
            customers: [
                'taxaFidelizacao', 'taxaPenetracao', 'taxaAbandono',
                'taxaPassaPalavra', 'taxaRetencao', 'cac', 'custoManutencao',
                'shareOfWallet', 'clv', 'nps'
            ],
            market: [
                'taxaCrescimento', 'quotaMercadoTotal', 'quotaMercadoRelevante',
                'taxaPenetracaoMercado', 'notoriedadeEspontanea', 'notoriedadeAssistida',
                'penetracaoMarca', 'quotaPenetracao'
            ],
            sales: [
                'dimensaoForcaVendas', 'custoVisita', 'margemVisita',
                'roiVisita', 'indiceEficaciaFase', 'valorEsperado'
            ],
            product: [
                'taxaExperimentacao', 'taxaCanibalizacao', 'elasticidadePreco'
            ],
            advertising: [
                'grp', 'indiceEficaciaComunicacao', 'indiceEficaciaInvestimento'
            ],
            digital: [
                'ctr', 'cpc', 'taxaConversao', 'roas', 'bounceRate',
                'paginasPorSessao', 'duracaoMediaSessao'
            ]
        };
    }

    // FINANCIAL METRICS
    calculateMarginUnitaria(precoVenda, custoUnitario) {
        return precoVenda - custoUnitario;
    }

    calculateMarginPercentual(marginUnitaria, precoVenda) {
        if (precoVenda === 0) return 0;
        return (marginUnitaria / precoVenda) * 100;
    }

    calculateMarkup(preco, custo) {
        if (custo === 0) return 0;
        return ((preco - custo) / custo) * 100;
    }

    calculateROS(lucro, vendas) {
        if (vendas === 0) return 0;
        return (lucro / vendas) * 100;
    }

    calculateROA(lucro, ativoTotal) {
        if (ativoTotal === 0) return 0;
        return (lucro / ativoTotal) * 100;
    }

    calculateROE(lucro, capitaisProprios) {
        if (capitaisProprios === 0) return 0;
        return (lucro / capitaisProprios) * 100;
    }

    calculateBreakEvenQtd(custosFixos, margemContribuicaoUnitaria) {
        if (margemContribuicaoUnitaria === 0) return 0;
        return custosFixos / margemContribuicaoUnitaria;
    }

    calculateBreakEvenValor(custosFixos, margemContribuicaoPercentual) {
        if (margemContribuicaoPercentual === 0) return 0;
        return custosFixos / (margemContribuicaoPercentual / 100);
    }

    calculateMarginSeguranca(vendasAtuais, vendasBreakEven) {
        if (vendasAtuais === 0) return 0;
        return ((vendasAtuais - vendasBreakEven) / vendasAtuais) * 100;
    }

    calculateRetornoAbsoluto(vendas, esforcoTotal) {
        return vendas - esforcoTotal;
    }

    calculatePesoEsforco(esforcoTotal, vendas) {
        if (vendas === 0) return 0;
        return (esforcoTotal / vendas) * 100;
    }

    calculateRetornoRelativo(retornoAbsoluto, vendas) {
        if (vendas === 0) return 0;
        return (retornoAbsoluto / vendas) * 100;
    }

    calculateROIMarketing(retornoAbsoluto, esforcoTotal) {
        if (esforcoTotal === 0) return 0;
        return (retornoAbsoluto / esforcoTotal) * 100;
    }

    // CUSTOMER METRICS
    calculateTaxaFidelizacao(clientesAntigos, totalClientes) {
        if (totalClientes === 0) return 0;
        return (clientesAntigos / totalClientes) * 100;
    }

    calculateTaxaPenetracao(novosClientes, totalClientes) {
        if (totalClientes === 0) return 0;
        return (novosClientes / totalClientes) * 100;
    }

    calculateTaxaAbandono(clientesInativos, totalClientesAnterior) {
        if (totalClientesAnterior === 0) return 0;
        return (clientesInativos / totalClientesAnterior) * 100;
    }

    calculateTaxaPassaPalavra(novosClientesPP, novosClientesTotal) {
        if (novosClientesTotal === 0) return 0;
        return (novosClientesPP / novosClientesTotal) * 100;
    }

    calculateTaxaRetencao(clientesAntigos, totalClientesAnterior) {
        if (totalClientesAnterior === 0) return 0;
        return (clientesAntigos / totalClientesAnterior) * 100;
    }

    calculateCAC(esforcoMarketing, esforcoComercial, novosClientes) {
        if (novosClientes === 0) return 0;
        return (esforcoMarketing + esforcoComercial) / novosClientes;
    }

    calculateCustoManutencao(custosDiretos, clientesAtuais) {
        if (clientesAtuais === 0) return 0;
        return custosDiretos / clientesAtuais;
    }

    calculateShareOfWallet(comprasClienteEmpresa, comprasTotaisCliente) {
        if (comprasTotaisCliente === 0) return 0;
        return (comprasClienteEmpresa / comprasTotaisCliente) * 100;
    }

    calculateCLV(valorMedioCompra, frequenciaCompra, tempoRetencao, margemLucro) {
        return valorMedioCompra * frequenciaCompra * tempoRetencao * margemLucro;
    }

    calculateNPS(promotores, detratores, totalRespondentes) {
        if (totalRespondentes === 0) return 0;
        return ((promotores - detratores) / totalRespondentes) * 100;
    }

    // MARKET METRICS
    calculateTaxaCrescimento(valorAtual, valorAnterior) {
        if (valorAnterior === 0) return 0;
        return ((valorAtual - valorAnterior) / valorAnterior) * 100;
    }

    calculateQuotaMercadoTotal(vendasEmpresa, vendasMercadoTotal) {
        if (vendasMercadoTotal === 0) return 0;
        return (vendasEmpresa / vendasMercadoTotal) * 100;
    }

    calculateQuotaMercadoRelevante(vendasEmpresa, vendasMercadoRelevante) {
        if (vendasMercadoRelevante === 0) return 0;
        return (vendasEmpresa / vendasMercadoRelevante) * 100;
    }

    calculateTaxaPenetracaoMercado(procuraAtual, procuraPotencial) {
        if (procuraPotencial === 0) return 0;
        return (procuraAtual / procuraPotencial) * 100;
    }

    calculateNotoriedadeEspontanea(pessoasCitamEspontaneamente, totalInquiridos) {
        if (totalInquiridos === 0) return 0;
        return (pessoasCitamEspontaneamente / totalInquiridos) * 100;
    }

    calculateNotoriedadeAssistida(pessoasReconhecem, totalInquiridos) {
        if (totalInquiridos === 0) return 0;
        return (pessoasReconhecem / totalInquiridos) * 100;
    }

    calculatePenetracaoMarca(clientesCompraram, populacaoTotal) {
        if (populacaoTotal === 0) return 0;
        return (clientesCompraram / populacaoTotal) * 100;
    }

    calculateQuotaPenetracao(penetracaoMarca, penetracaoMercado) {
        if (penetracaoMercado === 0) return 0;
        return (penetracaoMarca / penetracaoMercado) * 100;
    }

    // SALES METRICS
    calculateDimensaoForcaVendas(visitasNecessarias, visitasPorVendedorAno) {
        if (visitasPorVendedorAno === 0) return 0;
        return Math.ceil(visitasNecessarias / visitasPorVendedorAno);
    }

    calculateCustoVisita(custosFixosForcaVendas, numeroVisitas) {
        if (numeroVisitas === 0) return 0;
        return custosFixosForcaVendas / numeroVisitas;
    }

    calculateMargemVisita(margemLiquidaGerada, numeroTotalVisitas) {
        if (numeroTotalVisitas === 0) return 0;
        return margemLiquidaGerada / numeroTotalVisitas;
    }

    calculateROIVisita(margemVisita, custoVisita) {
        if (custoVisita === 0) return 0;
        return ((margemVisita - custoVisita) / custoVisita) * 100;
    }

    calculateIndiceEficaciaFase(clientesFase2, clientesFase1) {
        if (clientesFase1 === 0) return 0;
        return (clientesFase2 / clientesFase1) * 100;
    }

    calculateValorEsperado(oportunidades) {
        return oportunidades.reduce((total, op) => total + (op.valor * op.probabilidade), 0);
    }

    // PRODUCT METRICS
    calculateTaxaExperimentacao(experimentadores, populacaoTotal) {
        if (populacaoTotal === 0) return 0;
        return (experimentadores / populacaoTotal) * 100;
    }

    calculateTaxaCanibalizacao(vendasPerdidasExistentes, vendasProdutoNovo) {
        if (vendasProdutoNovo === 0) return 0;
        return (vendasPerdidasExistentes / vendasProdutoNovo) * 100;
    }

    calculateElasticidadePreco(variacaoQuantidade, variacaoPreco, preco, quantidade) {
        if (variacaoPreco === 0 || quantidade === 0) return 0;
        return -(variacaoQuantidade / variacaoPreco) * (preco / quantidade);
    }

    // ADVERTISING METRICS
    calculateGRP(cobertura, frequencia) {
        return cobertura * frequencia;
    }

    calculateIndiceEficaciaComunicacao(shareOfMarket, shareOfVoice) {
        if (shareOfVoice === 0) return 0;
        return shareOfMarket / shareOfVoice;
    }

    calculateIndiceEficaciaInvestimento(shareOfMarket, shareOfInvestment) {
        if (shareOfInvestment === 0) return 0;
        return shareOfMarket / shareOfInvestment;
    }

    // DIGITAL METRICS
    calculateCTR(cliques, impressoes) {
        if (impressoes === 0) return 0;
        return (cliques / impressoes) * 100;
    }

    calculateCPC(custoTotal, cliques) {
        if (cliques === 0) return 0;
        return custoTotal / cliques;
    }

    calculateTaxaConversao(conversoes, visitantes) {
        if (visitantes === 0) return 0;
        return (conversoes / visitantes) * 100;
    }

    calculateROAS(receita, gastoPublicitario) {
        if (gastoPublicitario === 0) return 0;
        return (receita / gastoPublicitario);
    }

    calculateBounceRate(visitantesUmaPagina, totalVisitantes) {
        if (totalVisitantes === 0) return 0;
        return (visitantesUmaPagina / totalVisitantes) * 100;
    }

    calculatePaginasPorSessao(totalPaginas, totalSessoes) {
        if (totalSessoes === 0) return 0;
        return totalPaginas / totalSessoes;
    }

    calculateDuracaoMediaSessao(tempoTotal, totalSessoes) {
        if (totalSessoes === 0) return 0;
        return tempoTotal / totalSessoes;
    }

    // Calculate all metrics for a company
    calculateAllMetrics(data) {
        const metrics = {};

        // Financial Metrics
        const marginUnitaria = this.calculateMarginUnitaria(data.avgDealSize || 0, data.costs / data.conversions || 0);
        metrics.marginUnitaria = marginUnitaria.toFixed(2);
        metrics.marginPercentual = this.calculateMarginPercentual(marginUnitaria, data.avgDealSize || 0).toFixed(2);
        metrics.markup = this.calculateMarkup(data.avgDealSize || 0, data.costs / data.conversions || 0).toFixed(2);
        metrics.ros = this.calculateROS(data.profit, data.revenue).toFixed(2);
        metrics.roiMarketing = this.calculateROIMarketing(data.profit - data.marketingSpend, data.marketingSpend).toFixed(2);

        // Customer Metrics
        const totalCustomers = data.totalCustomers || 0;
        const newCustomers = data.newCustomers || 0;
        const lostCustomers = data.lostCustomers || 0;

        metrics.taxaRetencao = ((1 - (data.churnRate / 100)) * 100).toFixed(2);
        metrics.taxaPenetracao = this.calculateTaxaPenetracao(newCustomers, totalCustomers).toFixed(2);
        metrics.taxaAbandono = (data.churnRate || 0);
        metrics.cac = data.cac || 0;
        metrics.ltv = data.ltv || 0;
        metrics.ltvCacRatio = data.ltvCacRatio || 0;
        metrics.nps = data.nps || 0;

        // Market Metrics
        metrics.quotaMercado = data.marketShare || 0;
        metrics.crescimentoMercado = data.marketGrowth || 0;

        // Sales Metrics
        metrics.taxaConversaoVendas = data.conversionRate || 0;
        metrics.tamanhoDealMedio = data.avgDealSize || 0;
        metrics.cicloVendas = data.salesCycle || 0;
        metrics.taxaVitoria = data.winRate || 0;

        // Digital Metrics
        metrics.visitasWebsite = data.websiteVisits || 0;
        metrics.visitantesUnicos = data.uniqueVisitors || 0;
        metrics.paginasPorSessao = data.pagesPerSession || 0;
        metrics.duracaoMediaSessao = data.avgSessionDuration || 0;
        metrics.taxaRejeicao = data.bounceRate || 0;

        // Social & Email Metrics
        metrics.seguidoresSociais = data.socialFollowers || 0;
        metrics.engajamentoSocial = data.socialEngagement || 0;
        metrics.alcanceSocial = data.socialReach || 0;
        metrics.subscritoresEmail = data.emailSubscribers || 0;
        metrics.taxaAberturaEmail = data.emailOpenRate || 0;
        metrics.ctrEmail = data.emailCTR || 0;

        // Product Metrics
        metrics.satisfacaoCliente = data.customerSatisfaction || 0;
        metrics.adocaoProduto = data.productAdoption || 0;
        metrics.usoFeatures = data.featureUsage || 0;

        return metrics;
    }

    // Format metric for display
    formatMetric(value, type) {
        if (value === null || value === undefined) return 'N/A';

        switch(type) {
            case 'currency':
                return new Intl.NumberFormat('pt-PT', {
                    style: 'currency',
                    currency: 'EUR'
                }).format(value);
            case 'percentage':
                return `${value}%`;
            case 'number':
                return new Intl.NumberFormat('pt-PT').format(value);
            case 'decimal':
                return parseFloat(value).toFixed(2);
            default:
                return value;
        }
    }

    // Get metric category and type
    getMetricInfo(metricName) {
        const metricInfoMap = {
            // Financial
            marginUnitaria: { category: 'financial', type: 'currency', label: 'Margem Unitária' },
            marginPercentual: { category: 'financial', type: 'percentage', label: 'Margem %' },
            markup: { category: 'financial', type: 'percentage', label: 'Markup' },
            ros: { category: 'financial', type: 'percentage', label: 'ROS' },
            roiMarketing: { category: 'financial', type: 'percentage', label: 'ROI Marketing' },

            // Customers
            taxaRetencao: { category: 'customers', type: 'percentage', label: 'Taxa Retenção' },
            taxaPenetracao: { category: 'customers', type: 'percentage', label: 'Taxa Penetração' },
            taxaAbandono: { category: 'customers', type: 'percentage', label: 'Taxa Abandono' },
            cac: { category: 'customers', type: 'currency', label: 'CAC' },
            ltv: { category: 'customers', type: 'currency', label: 'LTV' },
            ltvCacRatio: { category: 'customers', type: 'decimal', label: 'LTV/CAC' },
            nps: { category: 'customers', type: 'number', label: 'NPS' },

            // Market
            quotaMercado: { category: 'market', type: 'percentage', label: 'Quota Mercado' },
            crescimentoMercado: { category: 'market', type: 'percentage', label: 'Crescimento' },

            // Sales
            taxaConversaoVendas: { category: 'sales', type: 'percentage', label: 'Taxa Conversão' },
            tamanhoDealMedio: { category: 'sales', type: 'currency', label: 'Deal Médio' },
            cicloVendas: { category: 'sales', type: 'number', label: 'Ciclo Vendas (dias)' },
            taxaVitoria: { category: 'sales', type: 'percentage', label: 'Taxa Vitória' },

            // Digital
            visitasWebsite: { category: 'digital', type: 'number', label: 'Visitas Website' },
            visitantesUnicos: { category: 'digital', type: 'number', label: 'Visitantes Únicos' },
            paginasPorSessao: { category: 'digital', type: 'decimal', label: 'Páginas/Sessão' },
            duracaoMediaSessao: { category: 'digital', type: 'number', label: 'Duração Sessão (s)' },
            taxaRejeicao: { category: 'digital', type: 'percentage', label: 'Taxa Rejeição' },

            // Social & Email
            seguidoresSociais: { category: 'digital', type: 'number', label: 'Seguidores' },
            engajamentoSocial: { category: 'digital', type: 'percentage', label: 'Engajamento' },
            alcanceSocial: { category: 'digital', type: 'number', label: 'Alcance' },
            subscritoresEmail: { category: 'digital', type: 'number', label: 'Subscritores Email' },
            taxaAberturaEmail: { category: 'digital', type: 'percentage', label: 'Taxa Abertura' },
            ctrEmail: { category: 'digital', type: 'percentage', label: 'CTR Email' },

            // Product
            satisfacaoCliente: { category: 'product', type: 'decimal', label: 'Satisfação (1-5)' },
            adocaoProduto: { category: 'product', type: 'percentage', label: 'Adoção Produto' },
            usoFeatures: { category: 'product', type: 'percentage', label: 'Uso Features' }
        };

        return metricInfoMap[metricName] || { category: 'other', type: 'text', label: metricName };
    }
}

// Initialize calculator
const metricsCalculator = new MetricsCalculator();