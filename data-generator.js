// Data Generator - Simulates realistic company data with 2 years of history

class DataGenerator {
    constructor() {
        this.companies = {
            'techpro': {
                name: 'TechPro Solutions',
                sector: 'Software B2B',
                founded: 2018,
                employees: 450,
                baseMetrics: {
                    revenue: 12000000,
                    marketShare: 0.22,
                    customers: 850,
                    avgTicket: 14000,
                    churnRate: 0.08,
                    cac: 2500,
                    ltv: 45000,
                    marginPercent: 0.35,
                    growthRate: 0.15
                }
            },
            'innovatech': {
                name: 'InnovaTech Digital',
                sector: 'Marketing Digital',
                founded: 2019,
                employees: 320,
                baseMetrics: {
                    revenue: 8500000,
                    marketShare: 0.18,
                    customers: 1200,
                    avgTicket: 7000,
                    churnRate: 0.12,
                    cac: 1800,
                    ltv: 28000,
                    marginPercent: 0.42,
                    growthRate: 0.25
                }
            },
            'smartmarketing': {
                name: 'SmartMarketing Co',
                sector: 'Consultoria',
                founded: 2017,
                employees: 280,
                baseMetrics: {
                    revenue: 9200000,
                    marketShare: 0.20,
                    customers: 650,
                    avgTicket: 14000,
                    churnRate: 0.06,
                    cac: 3200,
                    ltv: 52000,
                    marginPercent: 0.48,
                    growthRate: 0.12
                }
            },
            'digitalwave': {
                name: 'Digital Wave Agency',
                sector: 'Publicidade Digital',
                founded: 2020,
                employees: 180,
                baseMetrics: {
                    revenue: 5500000,
                    marketShare: 0.15,
                    customers: 2200,
                    avgTicket: 2500,
                    churnRate: 0.18,
                    cac: 800,
                    ltv: 12000,
                    marginPercent: 0.28,
                    growthRate: 0.35
                }
            },
            'nexusbrands': {
                name: 'Nexus Brands Group',
                sector: 'E-commerce',
                founded: 2016,
                employees: 520,
                baseMetrics: {
                    revenue: 15000000,
                    marketShare: 0.25,
                    customers: 8500,
                    avgTicket: 1750,
                    churnRate: 0.22,
                    cac: 450,
                    ltv: 6500,
                    marginPercent: 0.22,
                    growthRate: 0.18
                }
            }
        };

        this.historicalData = {};
        this.realtimeData = {};
        this.lastUpdate = new Date();

        this.initializeHistoricalData();
        this.startRealtimeSimulation();
    }

    // Initialize 2 years of historical data
    initializeHistoricalData() {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 2);

        Object.keys(this.companies).forEach(companyId => {
            this.historicalData[companyId] = {
                daily: [],
                monthly: [],
                quarterly: [],
                yearly: []
            };

            const company = this.companies[companyId];
            let currentDate = new Date(startDate);
            let baseValues = { ...company.baseMetrics };

            // Generate daily data for 2 years
            for (let day = 0; day < 730; day++) {
                const dailyData = this.generateDailyMetrics(companyId, baseValues, currentDate);
                this.historicalData[companyId].daily.push(dailyData);

                // Update base values with some progression
                baseValues = this.evolveMetrics(baseValues, company.baseMetrics.growthRate / 365);

                currentDate = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Aggregate to monthly, quarterly, and yearly
            this.aggregateHistoricalData(companyId);
        });
    }

    generateDailyMetrics(companyId, baseValues, date) {
        const company = this.companies[companyId];

        // Add random variations (seasonality, market conditions, etc.)
        const dayOfWeek = date.getDay();
        const month = date.getMonth();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHolidaySeason = month === 11 || month === 0; // December/January
        const isSummerSlowdown = month === 6 || month === 7; // July/August

        // Weekend factor (less business activity)
        const weekendFactor = isWeekend ? 0.7 : 1.1;

        // Seasonal factors
        const seasonalFactor = isHolidaySeason ? 1.3 : (isSummerSlowdown ? 0.85 : 1.0);

        // Random daily variation (-10% to +10%)
        const randomFactor = 0.9 + Math.random() * 0.2;

        // Calculate daily metrics with variations
        const dailyRevenue = (baseValues.revenue / 365) * weekendFactor * seasonalFactor * randomFactor;
        const dailyCustomers = Math.floor((baseValues.customers / 365) * weekendFactor * randomFactor);
        const newCustomers = Math.floor(dailyCustomers * (0.1 + Math.random() * 0.2));
        const lostCustomers = Math.floor(dailyCustomers * baseValues.churnRate / 30);

        // Marketing metrics
        const marketingSpend = dailyRevenue * (0.08 + Math.random() * 0.07); // 8-15% of revenue
        const leads = Math.floor(marketingSpend / 50 * (0.8 + Math.random() * 0.4));
        const conversions = Math.floor(leads * (0.02 + Math.random() * 0.03));

        // Digital metrics
        const websiteVisits = Math.floor(1000 + Math.random() * 5000) * weekendFactor;
        const pageViews = websiteVisits * (2 + Math.random() * 3);
        const bounceRate = 0.3 + Math.random() * 0.4;
        const avgSessionDuration = 60 + Math.random() * 240; // seconds

        // Sales metrics
        const salesCalls = Math.floor(20 + Math.random() * 30) * (isWeekend ? 0 : 1);
        const meetings = Math.floor(salesCalls * (0.2 + Math.random() * 0.3));
        const proposals = Math.floor(meetings * (0.5 + Math.random() * 0.3));
        const closedDeals = Math.floor(proposals * (0.3 + Math.random() * 0.4));

        // Financial metrics
        const costs = dailyRevenue * (1 - baseValues.marginPercent);
        const profit = dailyRevenue - costs;
        const roi = ((profit - marketingSpend) / marketingSpend) * 100;

        return {
            date: date.toISOString().split('T')[0],
            timestamp: date.getTime(),

            // Financial Metrics
            revenue: Math.round(dailyRevenue),
            costs: Math.round(costs),
            profit: Math.round(profit),
            margin: baseValues.marginPercent * 100,
            marketingSpend: Math.round(marketingSpend),
            roi: Math.round(roi),

            // Customer Metrics
            totalCustomers: baseValues.customers,
            newCustomers: newCustomers,
            lostCustomers: lostCustomers,
            netCustomers: newCustomers - lostCustomers,
            churnRate: (baseValues.churnRate * 100).toFixed(2),
            retentionRate: ((1 - baseValues.churnRate) * 100).toFixed(2),
            cac: Math.round(baseValues.cac * (0.9 + Math.random() * 0.2)),
            ltv: Math.round(baseValues.ltv * (0.95 + Math.random() * 0.1)),
            ltvCacRatio: (baseValues.ltv / baseValues.cac).toFixed(2),

            // Market Metrics
            marketShare: (baseValues.marketShare * 100).toFixed(2),
            marketGrowth: (company.baseMetrics.growthRate * 100 / 12).toFixed(2),
            competitorShare: ((1 - baseValues.marketShare) * 100 / 4).toFixed(2),

            // Sales Metrics
            leads: leads,
            conversions: conversions,
            conversionRate: ((conversions / Math.max(leads, 1)) * 100).toFixed(2),
            avgDealSize: Math.round(baseValues.avgTicket * (0.8 + Math.random() * 0.4)),
            salesCycle: Math.floor(30 + Math.random() * 60), // days
            salesCalls: salesCalls,
            meetings: meetings,
            proposals: proposals,
            closedDeals: closedDeals,
            winRate: ((closedDeals / Math.max(proposals, 1)) * 100).toFixed(2),

            // Digital Metrics
            websiteVisits: websiteVisits,
            uniqueVisitors: Math.floor(websiteVisits * 0.7),
            pageViews: pageViews,
            pagesPerSession: (pageViews / Math.max(websiteVisits, 1)).toFixed(2),
            avgSessionDuration: Math.round(avgSessionDuration),
            bounceRate: (bounceRate * 100).toFixed(2),

            // Social Media Metrics (simulated)
            socialFollowers: Math.floor(baseValues.customers * 5 + Math.random() * 1000),
            socialEngagement: (2 + Math.random() * 3).toFixed(2),
            socialReach: Math.floor(websiteVisits * 3),

            // Email Marketing (simulated)
            emailSubscribers: Math.floor(baseValues.customers * 1.5),
            emailOpenRate: (20 + Math.random() * 15).toFixed(2),
            emailCTR: (2 + Math.random() * 3).toFixed(2),

            // Product Metrics
            nps: Math.floor(30 + Math.random() * 40), // -100 to 100
            customerSatisfaction: (3.5 + Math.random() * 1.5).toFixed(1), // 1-5
            productAdoption: (60 + Math.random() * 30).toFixed(2), // percentage
            featureUsage: (40 + Math.random() * 40).toFixed(2), // percentage
        };
    }

    evolveMetrics(metrics, growthFactor) {
        return {
            ...metrics,
            revenue: metrics.revenue * (1 + growthFactor),
            customers: Math.floor(metrics.customers * (1 + growthFactor * 0.5)),
            marketShare: Math.min(0.5, metrics.marketShare * (1 + growthFactor * 0.3)),
            avgTicket: metrics.avgTicket * (1 + growthFactor * 0.2),
            churnRate: Math.max(0.05, metrics.churnRate * (1 - growthFactor * 0.1)),
            cac: metrics.cac * (1 + growthFactor * 0.1),
            ltv: metrics.ltv * (1 + growthFactor * 0.15)
        };
    }

    aggregateHistoricalData(companyId) {
        const dailyData = this.historicalData[companyId].daily;

        // Monthly aggregation
        let currentMonth = null;
        let monthData = [];

        dailyData.forEach(day => {
            const month = day.date.substring(0, 7); // YYYY-MM

            if (currentMonth !== month) {
                if (monthData.length > 0) {
                    this.historicalData[companyId].monthly.push(
                        this.aggregatePeriodData(monthData, currentMonth)
                    );
                }
                currentMonth = month;
                monthData = [day];
            } else {
                monthData.push(day);
            }
        });

        // Add last month
        if (monthData.length > 0) {
            this.historicalData[companyId].monthly.push(
                this.aggregatePeriodData(monthData, currentMonth)
            );
        }

        // Quarterly and yearly aggregations
        this.aggregateQuarterlyData(companyId);
        this.aggregateYearlyData(companyId);
    }

    aggregatePeriodData(periodData, periodLabel) {
        const sum = (arr, key) => arr.reduce((acc, item) => acc + parseFloat(item[key] || 0), 0);
        const avg = (arr, key) => sum(arr, key) / arr.length;

        return {
            period: periodLabel,
            startDate: periodData[0].date,
            endDate: periodData[periodData.length - 1].date,

            // Summed metrics
            revenue: Math.round(sum(periodData, 'revenue')),
            costs: Math.round(sum(periodData, 'costs')),
            profit: Math.round(sum(periodData, 'profit')),
            marketingSpend: Math.round(sum(periodData, 'marketingSpend')),
            newCustomers: Math.round(sum(periodData, 'newCustomers')),
            lostCustomers: Math.round(sum(periodData, 'lostCustomers')),
            leads: Math.round(sum(periodData, 'leads')),
            conversions: Math.round(sum(periodData, 'conversions')),

            // Averaged metrics
            margin: avg(periodData, 'margin').toFixed(2),
            roi: avg(periodData, 'roi').toFixed(2),
            churnRate: avg(periodData, 'churnRate').toFixed(2),
            retentionRate: avg(periodData, 'retentionRate').toFixed(2),
            marketShare: avg(periodData, 'marketShare').toFixed(2),
            conversionRate: avg(periodData, 'conversionRate').toFixed(2),
            avgDealSize: Math.round(avg(periodData, 'avgDealSize')),
            cac: Math.round(avg(periodData, 'cac')),
            ltv: Math.round(avg(periodData, 'ltv')),
            nps: Math.round(avg(periodData, 'nps')),
            customerSatisfaction: avg(periodData, 'customerSatisfaction').toFixed(1),

            // Last value metrics
            totalCustomers: periodData[periodData.length - 1].totalCustomers,
            socialFollowers: periodData[periodData.length - 1].socialFollowers,
            emailSubscribers: periodData[periodData.length - 1].emailSubscribers,
        };
    }

    aggregateQuarterlyData(companyId) {
        const monthlyData = this.historicalData[companyId].monthly;
        const quarters = [];

        for (let i = 0; i < monthlyData.length; i += 3) {
            const quarterMonths = monthlyData.slice(i, Math.min(i + 3, monthlyData.length));
            if (quarterMonths.length > 0) {
                const year = quarterMonths[0].period.substring(0, 4);
                const quarter = Math.floor(i / 3) % 4 + 1;
                quarters.push(this.aggregatePeriodData(quarterMonths, `${year}-Q${quarter}`));
            }
        }

        this.historicalData[companyId].quarterly = quarters;
    }

    aggregateYearlyData(companyId) {
        const monthlyData = this.historicalData[companyId].monthly;
        const years = [];
        let currentYear = null;
        let yearMonths = [];

        monthlyData.forEach(month => {
            const year = month.period.substring(0, 4);

            if (currentYear !== year) {
                if (yearMonths.length > 0) {
                    years.push(this.aggregatePeriodData(yearMonths, currentYear));
                }
                currentYear = year;
                yearMonths = [month];
            } else {
                yearMonths.push(month);
            }
        });

        // Add last year
        if (yearMonths.length > 0) {
            years.push(this.aggregatePeriodData(yearMonths, currentYear));
        }

        this.historicalData[companyId].yearly = years;
    }

    // Real-time simulation
    startRealtimeSimulation() {
        // Update every 5 seconds
        setInterval(() => {
            this.updateRealtimeData();
        }, 5000);

        // Initial update
        this.updateRealtimeData();
    }

    updateRealtimeData() {
        const now = new Date();

        Object.keys(this.companies).forEach(companyId => {
            const company = this.companies[companyId];
            const lastDayData = this.historicalData[companyId].daily[this.historicalData[companyId].daily.length - 1];

            // Generate current metrics based on last historical data with real-time variations
            const realtimeMetrics = this.generateDailyMetrics(
                companyId,
                company.baseMetrics,
                now
            );

            // Add real-time specific metrics
            realtimeMetrics.timestamp = now.getTime();
            realtimeMetrics.isRealtime = true;

            // Add trending indicators
            realtimeMetrics.trending = {
                revenue: Math.random() > 0.5 ? 'up' : 'down',
                customers: Math.random() > 0.5 ? 'up' : 'down',
                marketShare: Math.random() > 0.5 ? 'up' : 'down',
                digital: Math.random() > 0.5 ? 'up' : 'down'
            };

            // Store real-time data
            this.realtimeData[companyId] = realtimeMetrics;
        });

        this.lastUpdate = now;

        // Trigger update event
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('dataUpdate', {
                detail: {
                    timestamp: now.getTime(),
                    data: this.realtimeData
                }
            }));
        }
    }

    // Data access methods
    getHistoricalData(companyId, period, startDate, endDate) {
        if (!this.historicalData[companyId]) return [];

        let data = [];

        switch(period) {
            case 'daily':
                data = this.historicalData[companyId].daily;
                break;
            case 'monthly':
                data = this.historicalData[companyId].monthly;
                break;
            case 'quarterly':
                data = this.historicalData[companyId].quarterly;
                break;
            case 'yearly':
                data = this.historicalData[companyId].yearly;
                break;
            default:
                data = this.historicalData[companyId].daily;
        }

        // Filter by date range if provided
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            data = data.filter(item => {
                const itemDate = new Date(item.date || item.startDate).getTime();
                return itemDate >= start && itemDate <= end;
            });
        }

        return data;
    }

    getRealtimeData(companyId) {
        if (companyId === 'all') {
            return this.realtimeData;
        }
        return this.realtimeData[companyId] || null;
    }

    getCompanyInfo(companyId) {
        return this.companies[companyId] || null;
    }

    getAllCompanies() {
        return Object.keys(this.companies).map(id => ({
            id,
            ...this.companies[id]
        }));
    }

    // Market totals and comparisons
    getMarketTotals() {
        const totals = {
            totalRevenue: 0,
            totalCustomers: 0,
            totalEmployees: 0,
            avgMargin: 0,
            avgGrowth: 0
        };

        Object.values(this.companies).forEach(company => {
            totals.totalRevenue += company.baseMetrics.revenue;
            totals.totalCustomers += company.baseMetrics.customers;
            totals.totalEmployees += company.employees;
            totals.avgMargin += company.baseMetrics.marginPercent;
            totals.avgGrowth += company.baseMetrics.growthRate;
        });

        const numCompanies = Object.keys(this.companies).length;
        totals.avgMargin = (totals.avgMargin / numCompanies * 100).toFixed(2);
        totals.avgGrowth = (totals.avgGrowth / numCompanies * 100).toFixed(2);

        return totals;
    }

    getCompetitiveAnalysis(companyId) {
        const analysis = [];
        const targetCompany = this.realtimeData[companyId];

        if (!targetCompany) return analysis;

        Object.keys(this.companies).forEach(id => {
            if (id !== companyId) {
                const competitor = this.realtimeData[id];
                if (competitor) {
                    analysis.push({
                        name: this.companies[id].name,
                        marketShare: competitor.marketShare,
                        revenue: competitor.revenue,
                        customers: competitor.totalCustomers,
                        comparison: {
                            marketShare: ((competitor.marketShare - targetCompany.marketShare) / targetCompany.marketShare * 100).toFixed(2),
                            revenue: ((competitor.revenue - targetCompany.revenue) / targetCompany.revenue * 100).toFixed(2),
                            customers: ((competitor.totalCustomers - targetCompany.totalCustomers) / targetCompany.totalCustomers * 100).toFixed(2)
                        }
                    });
                }
            }
        });

        return analysis.sort((a, b) => parseFloat(b.marketShare) - parseFloat(a.marketShare));
    }
}

// Initialize data generator when script loads
const dataGenerator = new DataGenerator();