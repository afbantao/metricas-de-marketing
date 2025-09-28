// Data Generator V2 - Energy Drinks Market Simulator
// Complete raw data for metric calculations

class EnergyDrinksMarketSimulator {
    constructor() {
        // Market configuration
        this.marketSize = {
            totalValue: 185000000, // €185M annual market
            totalVolume: 52000000, // 52M liters annual
            totalUnits: 156000000, // 156M units annual
            population: 10300000, // Portugal population
            targetPopulation: 4500000, // 18-50 years
            activeConsumers: 1800000, // Active energy drink consumers
            growthRate: 0.12 // 12% annual growth
        };

        // 8 Competing Brands
        this.brands = {
            'volt': {
                id: 'volt',
                name: 'VOLT Energy',
                color: '#0066CC',
                founded: 2018,
                positioning: 'Premium Performance',
                target: 'Athletes 25-40',
                marketShare: 0.185,
                employees: 125,
                factories: 1,
                distributionCenters: 3,
                basePrice250ml: 2.49,
                baseCostUnit: 0.78,
                headquarters: 'Lisboa'
            },
            'thunder': {
                id: 'thunder',
                name: 'Thunder Strike',
                color: '#FFD700',
                founded: 2016,
                positioning: 'Extreme Sports',
                target: 'Young radicals 18-25',
                marketShare: 0.223,
                employees: 165,
                factories: 2,
                distributionCenters: 4,
                basePrice250ml: 1.99,
                baseCostUnit: 0.62,
                headquarters: 'Porto'
            },
            'nitro': {
                id: 'nitro',
                name: 'NitroFuel',
                color: '#00AA00',
                founded: 2020,
                positioning: 'Natural & Organic',
                target: 'Health conscious 25-45',
                marketShare: 0.087,
                employees: 78,
                factories: 1,
                distributionCenters: 2,
                basePrice250ml: 3.29,
                baseCostUnit: 1.45,
                headquarters: 'Braga'
            },
            'power': {
                id: 'power',
                name: 'PowerRush',
                color: '#FF0000',
                founded: 2015,
                positioning: 'Mass Market Leader',
                target: 'Students/Workers 18-35',
                marketShare: 0.241,
                employees: 210,
                factories: 3,
                distributionCenters: 6,
                basePrice250ml: 1.49,
                baseCostUnit: 0.48,
                headquarters: 'Lisboa'
            },
            'elite': {
                id: 'elite',
                name: 'EliteBoost',
                color: '#FFB300',
                founded: 2019,
                positioning: 'Business Professional',
                target: 'Executives 30-50',
                marketShare: 0.122,
                employees: 95,
                factories: 1,
                distributionCenters: 2,
                basePrice250ml: 2.99,
                baseCostUnit: 1.12,
                headquarters: 'Cascais'
            },
            'wildcat': {
                id: 'wildcat',
                name: 'WildCat Energy',
                color: '#FF6600',
                founded: 2021,
                positioning: 'Gaming & eSports',
                target: 'Gamers 16-30',
                marketShare: 0.073,
                employees: 52,
                factories: 1,
                distributionCenters: 2,
                basePrice250ml: 1.79,
                baseCostUnit: 0.58,
                headquarters: 'Aveiro'
            },
            'zen': {
                id: 'zen',
                name: 'ZenFlow',
                color: '#9C27B0',
                founded: 2020,
                positioning: 'Wellness & Balance',
                target: 'Fitness enthusiasts 25-40',
                marketShare: 0.046,
                employees: 38,
                factories: 1,
                distributionCenters: 1,
                basePrice250ml: 2.89,
                baseCostUnit: 1.25,
                headquarters: 'Coimbra'
            },
            'max': {
                id: 'max',
                name: 'MaxForce',
                color: '#424242',
                founded: 2022,
                positioning: 'Night Life & Party',
                target: 'Party goers 20-35',
                marketShare: 0.023,
                employees: 28,
                factories: 1,
                distributionCenters: 1,
                basePrice250ml: 2.19,
                baseCostUnit: 0.82,
                headquarters: 'Albufeira'
            }
        };

        // Product SKUs per brand
        this.skus = {
            '250ml': { size: 250, unitsPerCase: 24, marginMultiplier: 1.0 },
            '355ml': { size: 355, unitsPerCase: 24, marginMultiplier: 0.95 },
            '500ml': { size: 500, unitsPerCase: 12, marginMultiplier: 0.90 },
            'pack4': { size: 1000, unitsPerCase: 6, marginMultiplier: 0.85 }
        };

        // Distribution channels
        this.channels = {
            'hypermarket': {
                name: 'Hipermercados',
                margin: 0.25,
                volume: 0.30,
                paymentDays: 60,
                listingFee: 25000,
                stores: 145
            },
            'supermarket': {
                name: 'Supermercados',
                margin: 0.28,
                volume: 0.25,
                paymentDays: 45,
                listingFee: 15000,
                stores: 890
            },
            'convenience': {
                name: 'Lojas Conveniência',
                margin: 0.35,
                volume: 0.15,
                paymentDays: 30,
                listingFee: 0,
                stores: 3200
            },
            'horeca': {
                name: 'Cafés e Bares',
                margin: 0.40,
                volume: 0.12,
                paymentDays: 30,
                listingFee: 0,
                stores: 8500
            },
            'gas_station': {
                name: 'Postos Combustível',
                margin: 0.32,
                volume: 0.08,
                paymentDays: 15,
                listingFee: 5000,
                stores: 650
            },
            'gym': {
                name: 'Ginásios',
                margin: 0.45,
                volume: 0.05,
                paymentDays: 30,
                listingFee: 0,
                stores: 420
            },
            'vending': {
                name: 'Máquinas Vending',
                margin: 0.50,
                volume: 0.03,
                paymentDays: 0,
                listingFee: 0,
                stores: 1200
            },
            'online': {
                name: 'E-commerce',
                margin: 0.20,
                volume: 0.02,
                paymentDays: 0,
                listingFee: 0,
                stores: 1
            }
        };

        // Initialize data structures
        this.historicalData = {};
        this.transactionLog = [];
        this.marketingCampaigns = [];
        this.strategicDecisions = [];
        this.competitiveActions = [];
        this.customerDatabase = {};
        this.b2bCustomers = {};

        // Market events that affected everyone
        this.marketEvents = [
            {
                date: '2023-01-15',
                type: 'regulation',
                description: 'Nova legislação limita cafeína a 32mg/100ml',
                impact: {
                    allBrands: {
                        costIncrease: 0.08,
                        volumeDecrease: 0.03
                    }
                }
            },
            {
                date: '2023-04-01',
                type: 'competitor_entry',
                description: 'Monster Energy tenta entrar no mercado',
                impact: {
                    allBrands: {
                        marketingIncrease: 0.15,
                        priceDecrease: 0.05
                    }
                }
            },
            {
                date: '2023-07-20',
                type: 'health_scandal',
                description: 'Escândalo com bebidas genéricas causa alerta',
                impact: {
                    premiumBrands: {
                        volumeIncrease: 0.08
                    },
                    budgetBrands: {
                        volumeDecrease: 0.12
                    }
                }
            },
            {
                date: '2023-11-24',
                type: 'seasonal',
                description: 'Black Friday - Pico de vendas',
                impact: {
                    allBrands: {
                        volumeIncrease: 0.45,
                        marginDecrease: 0.15
                    }
                }
            },
            {
                date: '2024-02-01',
                type: 'economic',
                description: 'Inflação aumenta custos matérias-primas',
                impact: {
                    allBrands: {
                        costIncrease: 0.15
                    }
                }
            },
            {
                date: '2024-06-15',
                type: 'seasonal',
                description: 'Verão excepcionalmente quente',
                impact: {
                    allBrands: {
                        volumeIncrease: 0.25
                    }
                }
            },
            {
                date: '2024-09-15',
                type: 'seasonal',
                description: 'Início do ano universitário',
                impact: {
                    youngTargetBrands: {
                        volumeIncrease: 0.18
                    }
                }
            },
            {
                date: '2024-11-01',
                type: 'supply_chain',
                description: 'Crise fornecimento alumínio',
                impact: {
                    allBrands: {
                        costIncrease: 0.12,
                        stockDecrease: 0.20
                    }
                }
            }
        ];

        // Strategic decisions by brand
        this.brandDecisions = {
            'volt': [
                {
                    date: '2023-03-01',
                    decision: 'Lançamento sabor Tropical Burst',
                    investment: 250000,
                    impact: { volumeIncrease: 0.05, newSKU: 'tropical' }
                },
                {
                    date: '2023-06-01',
                    decision: 'Patrocínio Liga Portuguesa Futebol',
                    investment: 1500000,
                    impact: { awarenessIncrease: 0.12, marketShareIncrease: 0.008 }
                },
                {
                    date: '2023-09-01',
                    decision: 'Aumento de preço premium positioning',
                    investment: 0,
                    impact: { priceIncrease: 0.10, volumeDecrease: 0.03, marginIncrease: 0.06 }
                },
                {
                    date: '2024-01-15',
                    decision: 'Programa fidelização B2B',
                    investment: 180000,
                    impact: { b2bRetention: 0.15, b2bVolumeIncrease: 0.08 }
                },
                {
                    date: '2024-05-01',
                    decision: 'Expansão linha Zero Sugar',
                    investment: 320000,
                    impact: { newCustomers: 25000, cannibalization: 0.12 }
                }
            ],
            'thunder': [
                {
                    date: '2023-02-15',
                    decision: 'Campanha viral TikTok #ThunderChallenge',
                    investment: 120000,
                    impact: { youngCustomersIncrease: 0.20, viralReach: 2500000 }
                },
                {
                    date: '2023-07-01',
                    decision: 'Promoção Verão 2x1',
                    investment: 450000,
                    impact: { volumeIncrease: 0.30, marginDecrease: 0.10 }
                },
                {
                    date: '2023-10-01',
                    decision: 'Parceria festivais música',
                    investment: 800000,
                    impact: { brandImageIncrease: 0.15, marketShareIncrease: 0.012 }
                },
                {
                    date: '2024-03-01',
                    decision: 'Lançamento lata 355ml',
                    investment: 150000,
                    impact: { skuExpansion: true, channelPenetration: 0.08 }
                },
                {
                    date: '2024-08-01',
                    decision: 'Patrocínio equipa eSports',
                    investment: 200000,
                    impact: { gamingAudience: 0.25, onlineEngagement: 0.35 }
                }
            ],
            'power': [
                {
                    date: '2023-01-20',
                    decision: 'Redução preço estratégica',
                    investment: 0,
                    impact: { priceDecrease: 0.15, volumeIncrease: 0.22, marginDecrease: 0.08 }
                },
                {
                    date: '2023-05-01',
                    decision: 'Expansão Açores e Madeira',
                    investment: 380000,
                    impact: { newCustomers: 50000, distributionIncrease: 0.15 }
                },
                {
                    date: '2023-08-15',
                    decision: 'Redesign completo embalagens',
                    investment: 280000,
                    impact: { brandPreference: 0.03, shelfImpact: 0.05 }
                },
                {
                    date: '2024-02-01',
                    decision: 'Acordo exclusivo Continente',
                    investment: 500000,
                    impact: { channelDominance: 0.30, volumeGuarantee: 0.12 }
                },
                {
                    date: '2024-07-01',
                    decision: 'Campanha TV massiva',
                    investment: 950000,
                    impact: { topOfMind: 0.18, marketShareIncrease: 0.015 }
                }
            ],
            'nitro': [
                {
                    date: '2023-04-01',
                    decision: 'Certificação orgânica EU',
                    investment: 85000,
                    impact: { premiumPositioning: 0.15, priceJustification: 0.08 }
                },
                {
                    date: '2023-09-01',
                    decision: 'Parceria ginásios premium',
                    investment: 120000,
                    impact: { gymChannel: 0.35, healthAudience: 0.20 }
                },
                {
                    date: '2024-01-01',
                    decision: 'Linha adaptogénicos',
                    investment: 220000,
                    impact: { innovation: 0.25, newSegment: 0.10 }
                },
                {
                    date: '2024-06-01',
                    decision: 'Influencer marketing wellness',
                    investment: 95000,
                    impact: { socialReach: 850000, conversionRate: 0.03 }
                }
            ],
            'elite': [
                {
                    date: '2023-03-15',
                    decision: 'Parceria empresas Fortune 500',
                    investment: 180000,
                    impact: { b2bPremium: 0.20, corporateClients: 45 }
                },
                {
                    date: '2023-08-01',
                    decision: 'Vending machines escritórios',
                    investment: 320000,
                    impact: { vendingChannel: 0.40, convenience: 0.15 }
                },
                {
                    date: '2024-02-15',
                    decision: 'Programa corporate wellness',
                    investment: 150000,
                    impact: { brandEquity: 0.12, b2bLoyalty: 0.18 }
                },
                {
                    date: '2024-09-01',
                    decision: 'Edição limitada executiva',
                    investment: 95000,
                    impact: { premiumSales: 0.08, exclusivity: 0.20 }
                }
            ],
            'wildcat': [
                {
                    date: '2023-05-01',
                    decision: 'Parceria Twitch streamers',
                    investment: 75000,
                    impact: { gamingAudience: 0.45, onlineVisibility: 0.30 }
                },
                {
                    date: '2023-11-01',
                    decision: 'Sabor Gaming Fuel exclusivo',
                    investment: 110000,
                    impact: { productDifferentiation: 0.20, gamingLoyalty: 0.25 }
                },
                {
                    date: '2024-04-01',
                    decision: 'Torneio gaming patrocinado',
                    investment: 140000,
                    impact: { brandAwareness: 0.15, communityBuilding: 0.30 }
                },
                {
                    date: '2024-10-01',
                    decision: 'Loja online gaming',
                    investment: 65000,
                    impact: { directSales: 0.12, marginImprovement: 0.08 }
                }
            ],
            'zen': [
                {
                    date: '2023-06-01',
                    decision: 'Ingredientes ayurvédicos',
                    investment: 125000,
                    impact: { uniqueness: 0.30, premiumJustification: 0.15 }
                },
                {
                    date: '2023-12-01',
                    decision: 'Parceria studios yoga',
                    investment: 68000,
                    impact: { yogaChannel: 0.40, brandFit: 0.25 }
                },
                {
                    date: '2024-05-01',
                    decision: 'App meditação branded',
                    investment: 95000,
                    impact: { engagement: 0.20, brandLoyalty: 0.15 }
                }
            ],
            'max': [
                {
                    date: '2023-07-01',
                    decision: 'Parceria discotecas Algarve',
                    investment: 85000,
                    impact: { nightChannel: 0.55, summerSales: 0.30 }
                },
                {
                    date: '2024-03-01',
                    decision: 'Sabor mixer cocktails',
                    investment: 70000,
                    impact: { newUsage: 0.15, barChannel: 0.20 }
                },
                {
                    date: '2024-08-15',
                    decision: 'Festival próprio MaxForce',
                    investment: 180000,
                    impact: { brandExperience: 0.25, viralPotential: 0.18 }
                }
            ]
        };

        // Initialize all data
        this.initializeAllData();
    }

    initializeAllData() {
        console.log('Initializing Energy Drinks Market Simulator...');

        // Generate 2 years of historical data
        this.generateHistoricalData();

        // Generate customer databases
        this.generateCustomerDatabases();

        // Generate B2B relationships
        this.generateB2BRelationships();

        // Generate transaction history
        this.generateTransactionHistory();

        // Generate marketing campaigns
        this.generateMarketingCampaigns();

        // Start real-time simulation
        this.startRealtimeSimulation();

        console.log('Market Simulator Ready!');
    }

    generateHistoricalData() {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 2);

        Object.keys(this.brands).forEach(brandId => {
            this.historicalData[brandId] = {
                daily: [],
                weekly: [],
                monthly: [],
                quarterly: [],
                yearly: [],
                transactions: [],
                campaigns: [],
                decisions: []
            };

            let currentDate = new Date(startDate);
            const brand = this.brands[brandId];

            // Generate daily data
            for (let day = 0; day < 730; day++) {
                const dailyData = this.generateCompleteDailyData(
                    brandId,
                    brand,
                    new Date(currentDate)
                );

                this.historicalData[brandId].daily.push(dailyData);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Aggregate to other periods
            this.aggregateHistoricalData(brandId);
        });

        // Ensure market shares always sum to 100%
        this.normalizeMarketShares();
    }

    generateCompleteDailyData(brandId, brand, date) {
        // Get market context
        const marketContext = this.getMarketContext(date);
        const decisions = this.getActiveDecisions(brandId, date);
        const seasonality = this.getSeasonality(date);

        // Calculate base values with all factors
        const marketShareAdjusted = this.calculateAdjustedMarketShare(
            brand.marketShare,
            decisions,
            marketContext,
            date
        );

        // Daily sales volume
        const dailyMarketUnits = this.marketSize.totalUnits / 365;
        const brandDailyUnits = Math.floor(
            dailyMarketUnits * marketShareAdjusted * seasonality.factor
        );

        // Sales by channel
        const channelSales = this.distributeByChannel(brandDailyUnits);

        // Financial calculations
        const revenues = this.calculateRevenues(brand, channelSales, decisions);
        const costs = this.calculateCosts(brand, channelSales, decisions, marketContext);
        const marketing = this.calculateMarketingSpend(brand, date, decisions);

        // Customer movements
        const customerMovements = this.calculateCustomerMovements(
            brand,
            brandDailyUnits,
            decisions,
            date
        );

        // Stock and distribution
        const distribution = this.calculateDistribution(brand, channelSales, date);

        // Digital metrics
        const digitalMetrics = this.generateDigitalMetrics(brand, date, decisions, marketing);

        // Sales force metrics
        const salesMetrics = this.generateSalesMetrics(brand, date, channelSales);

        return {
            // Identification
            date: date.toISOString().split('T')[0],
            timestamp: date.getTime(),
            brandId: brandId,

            // Market data
            marketShare: (marketShareAdjusted * 100).toFixed(2),
            marketSize: dailyMarketUnits,
            competitorActions: marketContext.competitorActions,

            // Sales volume data
            unitsSold: brandDailyUnits,
            volumeLiters: brandDailyUnits * 0.3, // average 300ml per unit
            ...channelSales,

            // Revenue data (all values needed for calculations)
            grossRevenue: revenues.gross,
            discountsGiven: revenues.discounts,
            returnsValue: revenues.returns,
            netRevenue: revenues.net,
            averageSellingPrice: revenues.avgPrice,

            // Cost data (detailed breakdown)
            directMaterialCost: costs.materials,
            directLaborCost: costs.labor,
            packagingCost: costs.packaging,
            totalDirectCost: costs.totalDirect,

            fixedProductionCost: costs.fixedProduction,
            administrativeCost: costs.administrative,
            storageCost: costs.storage,
            distributionCost: costs.distribution,
            totalIndirectCost: costs.totalIndirect,

            totalCost: costs.total,

            // Marketing spend (detailed)
            tvAdvertising: marketing.tv,
            radioAdvertising: marketing.radio,
            onlineAdvertising: marketing.online,
            outdoorAdvertising: marketing.outdoor,
            sponsorships: marketing.sponsorships,
            promotions: marketing.promotions,
            sampling: marketing.sampling,
            digitalMarketing: marketing.digital,
            influencerMarketing: marketing.influencer,
            totalMarketingSpend: marketing.total,

            // Commercial costs
            salesForceSalaries: salesMetrics.salaries,
            salesCommissions: salesMetrics.commissions,
            visitCosts: salesMetrics.visitCosts,
            merchandisingCosts: salesMetrics.merchandising,
            retailerIncentives: salesMetrics.incentives,
            totalCommercialCost: salesMetrics.totalCost,

            // Profitability
            grossProfit: revenues.net - costs.totalDirect,
            operatingProfit: revenues.net - costs.total - marketing.total - salesMetrics.totalCost,

            // Customer data B2C
            totalB2CCustomers: customerMovements.totalB2C,
            newB2CCustomers: customerMovements.newB2C,
            lostB2CCustomers: customerMovements.lostB2C,
            retainedB2CCustomers: customerMovements.retainedB2C,
            reactivatedB2CCustomers: customerMovements.reactivatedB2C,
            inactiveB2CCustomers: customerMovements.inactiveB2C,

            // Customer data B2B
            totalB2BCustomers: customerMovements.totalB2B,
            newB2BCustomers: customerMovements.newB2B,
            lostB2BCustomers: customerMovements.lostB2B,
            activePointsOfSale: customerMovements.activePoS,

            // Customer acquisition sources
            customersViaAdvertising: customerMovements.viaAdvertising,
            customersViaPromotion: customerMovements.viaPromotion,
            customersViaReferral: customerMovements.viaReferral,
            customersViaDigital: customerMovements.viaDigital,
            customersViaSpontaneous: customerMovements.viaSpontaneous,

            // Purchase behavior
            averagePurchaseFrequency: customerMovements.avgFrequency,
            averagePurchaseValue: customerMovements.avgValue,
            averagePurchaseQuantity: customerMovements.avgQuantity,
            averageTimeBetweenPurchases: customerMovements.avgDaysBetween,
            repurchaseRate: customerMovements.repurchaseRate,

            // Satisfaction & Loyalty data
            satisfactionSurveysSent: customerMovements.surveysSent,
            satisfactionSurveysAnswered: customerMovements.surveysAnswered,
            npsPromoters: customerMovements.promoters,
            npsNeutral: customerMovements.neutral,
            npsDetractors: customerMovements.detractors,
            complaintsReceived: customerMovements.complaints,
            complaintsSolved: customerMovements.complaintsSolved,

            // Sales force data
            numberOfSalespeople: salesMetrics.salespeople,
            numberOfSupervisors: salesMetrics.supervisors,
            numberOfRegionalManagers: salesMetrics.managers,
            plannedVisits: salesMetrics.plannedVisits,
            completedVisits: salesMetrics.completedVisits,
            averageVisitDuration: salesMetrics.avgVisitDuration,

            // Sales pipeline
            leadsGenerated: salesMetrics.leads,
            qualifiedLeads: salesMetrics.qualified,
            proposalsSent: salesMetrics.proposals,
            negotiationsActive: salesMetrics.negotiations,
            dealsClosedCount: salesMetrics.closedDeals,
            dealsClosedValue: salesMetrics.closedValue,
            averageDealSize: salesMetrics.avgDealSize,

            // Distribution metrics
            numericDistribution: distribution.numeric,
            weightedDistribution: distribution.weighted,
            stockoutDays: distribution.stockoutDays,
            averageRetailStock: distribution.retailStock,
            averageWarehouseStock: distribution.warehouseStock,

            // Product portfolio
            activeSKUs: distribution.activeSKUs,
            newProductLaunches: distribution.newLaunches,
            discontinuedProducts: distribution.discontinued,

            // Pricing data
            listPrice: brand.basePrice250ml,
            averagePriceCharged: revenues.avgPrice,
            minimumPrice: revenues.minPrice,
            maximumPrice: revenues.maxPrice,
            averageDiscountGiven: revenues.avgDiscount,

            // Quality metrics
            defectRate: distribution.defectRate,
            returnedProducts: distribution.returned,
            averageShelfLife: distribution.shelfLife,

            // Traditional advertising
            tvGRPs: marketing.tvGRPs,
            radioGRPs: marketing.radioGRPs,
            pressInsertions: marketing.pressInsertions,
            outdoorsActive: marketing.outdoorsActive,
            adCoverage: marketing.coverage,
            adFrequency: marketing.frequency,

            // Digital metrics - Website
            uniqueWebsiteVisitors: digitalMetrics.uniqueVisitors,
            totalSessions: digitalMetrics.sessions,
            pageViews: digitalMetrics.pageViews,
            bounceRate: digitalMetrics.bounceRate,
            avgSessionDuration: digitalMetrics.avgDuration,
            pagesPerSession: digitalMetrics.pagesPerSession,
            newVsReturning: digitalMetrics.newVsReturning,

            // Digital metrics - Campaigns
            campaignImpressions: digitalMetrics.impressions,
            campaignClicks: digitalMetrics.clicks,
            campaignCTR: digitalMetrics.ctr,
            campaignCPC: digitalMetrics.cpc,
            campaignConversions: digitalMetrics.conversions,
            campaignConversionRate: digitalMetrics.conversionRate,
            costPerConversion: digitalMetrics.costPerConversion,

            // Social media metrics
            facebookFollowers: digitalMetrics.facebook,
            instagramFollowers: digitalMetrics.instagram,
            tiktokFollowers: digitalMetrics.tiktok,
            twitterFollowers: digitalMetrics.twitter,
            totalSocialPosts: digitalMetrics.posts,
            organicReach: digitalMetrics.organicReach,
            paidReach: digitalMetrics.paidReach,
            engagementRate: digitalMetrics.engagementRate,
            socialComments: digitalMetrics.comments,
            socialShares: digitalMetrics.shares,
            socialMentions: digitalMetrics.mentions,

            // Email marketing
            emailDatabase: digitalMetrics.emailList,
            emailsSent: digitalMetrics.emailsSent,
            emailsDelivered: digitalMetrics.emailsDelivered,
            emailsOpened: digitalMetrics.emailsOpened,
            emailOpenRate: digitalMetrics.emailOpenRate,
            emailClicks: digitalMetrics.emailClicks,
            emailCTR: digitalMetrics.emailCTR,
            emailUnsubscribes: digitalMetrics.unsubscribes,

            // Influencer metrics
            activeInfluencers: digitalMetrics.influencers,
            influencerReach: digitalMetrics.influencerReach,
            sponsoredPosts: digitalMetrics.sponsoredPosts,
            influencerEngagement: digitalMetrics.influencerEngagement,
            costPerInfluencerPost: digitalMetrics.costPerPost,

            // Competition data
            competitorPrices: this.getCompetitorPrices(brandId, date),
            competitorPromotions: this.getCompetitorPromotions(brandId, date),
            competitorLaunches: this.getCompetitorLaunches(brandId, date),
            shareOfVoice: this.calculateShareOfVoice(brandId, marketing.total, date),

            // Strategic decisions active
            activeDecisions: decisions.map(d => d.decision),
            decisionImpacts: decisions.map(d => d.impact)
        };
    }

    // ... [Many more helper methods to generate realistic data]

    distributeByChannel(totalUnits) {
        const distribution = {};
        let remaining = totalUnits;

        Object.entries(this.channels).forEach(([channelId, channel]) => {
            const units = Math.floor(totalUnits * channel.volume);
            distribution[`${channelId}Units`] = units;
            distribution[`${channelId}Revenue`] = units * 2.0 * (1 - channel.margin);
            remaining -= units;
        });

        // Add remaining to largest channel
        distribution.hypermarketUnits += remaining;

        return distribution;
    }

    calculateRevenues(brand, channelSales, decisions) {
        let totalGross = 0;
        let totalDiscounts = 0;
        let prices = [];

        Object.entries(this.channels).forEach(([channelId, channel]) => {
            const units = channelSales[`${channelId}Units`] || 0;
            const basePrice = brand.basePrice250ml;
            const channelPrice = basePrice * (1 - channel.margin);

            // Apply any price decisions
            let finalPrice = channelPrice;
            decisions.forEach(d => {
                if (d.impact.priceIncrease) {
                    finalPrice *= (1 + d.impact.priceIncrease);
                }
                if (d.impact.priceDecrease) {
                    finalPrice *= (1 - d.impact.priceDecrease);
                }
            });

            const revenue = units * finalPrice;
            const discount = units * basePrice * 0.05; // average 5% discount

            totalGross += revenue;
            totalDiscounts += discount;
            prices.push(finalPrice);
        });

        return {
            gross: totalGross,
            discounts: totalDiscounts,
            returns: totalGross * 0.01, // 1% returns
            net: totalGross - totalDiscounts - (totalGross * 0.01),
            avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            avgDiscount: (totalDiscounts / totalGross * 100).toFixed(2)
        };
    }

    calculateCosts(brand, channelSales, decisions, marketContext) {
        const totalUnits = Object.values(channelSales)
            .filter(v => typeof v === 'number' && v.toString().includes('Units'))
            .reduce((sum, units) => sum + units, 0);

        // Base costs
        let unitCost = brand.baseCostUnit;

        // Apply market context impacts
        if (marketContext.costIncrease) {
            unitCost *= (1 + marketContext.costIncrease);
        }

        // Direct costs
        const materials = unitCost * 0.5 * totalUnits;
        const labor = unitCost * 0.2 * totalUnits;
        const packaging = unitCost * 0.3 * totalUnits;

        // Indirect costs (monthly estimates / 30)
        const fixedProduction = brand.factories * 50000 / 30;
        const administrative = brand.employees * 100 / 30;
        const storage = totalUnits * 0.02;
        const distribution = totalUnits * 0.05;

        return {
            materials,
            labor,
            packaging,
            totalDirect: materials + labor + packaging,
            fixedProduction,
            administrative,
            storage,
            distribution,
            totalIndirect: fixedProduction + administrative + storage + distribution,
            total: materials + labor + packaging + fixedProduction + administrative + storage + distribution
        };
    }

    calculateMarketingSpend(brand, date, decisions) {
        const baseSpend = brand.marketShare * this.marketSize.totalValue * 0.08 / 365;

        // Apply decision impacts
        let multiplier = 1;
        decisions.forEach(d => {
            if (d.investment && d.decision.includes('marketing')) {
                multiplier += 0.2;
            }
        });

        // Seasonal adjustments
        const month = date.getMonth();
        const seasonalMultiplier = [6, 7, 11].includes(month) ? 1.3 : 1.0;

        const totalSpend = baseSpend * multiplier * seasonalMultiplier;

        return {
            tv: totalSpend * 0.25,
            radio: totalSpend * 0.10,
            online: totalSpend * 0.20,
            outdoor: totalSpend * 0.10,
            sponsorships: totalSpend * 0.15,
            promotions: totalSpend * 0.10,
            sampling: totalSpend * 0.03,
            digital: totalSpend * 0.05,
            influencer: totalSpend * 0.02,
            total: totalSpend,
            tvGRPs: Math.floor(totalSpend * 0.25 / 500),
            radioGRPs: Math.floor(totalSpend * 0.10 / 200),
            pressInsertions: Math.floor(totalSpend * 0.05 / 1000),
            outdoorsActive: Math.floor(totalSpend * 0.10 / 2000),
            coverage: 15 + Math.random() * 25,
            frequency: 2 + Math.random() * 3
        };
    }

    calculateCustomerMovements(brand, unitsSold, decisions, date) {
        // Base customer calculations
        const avgUnitsPerCustomer = 2.5;
        const estimatedDailyCustomers = Math.floor(unitsSold / avgUnitsPerCustomer);

        // B2C movements
        const churnRate = 0.02 + Math.random() * 0.01;
        const acquisitionRate = 0.025 + Math.random() * 0.015;

        const totalB2C = Math.floor(brand.marketShare * this.marketSize.activeConsumers);
        const newB2C = Math.floor(estimatedDailyCustomers * acquisitionRate);
        const lostB2C = Math.floor(totalB2C / 365 * churnRate);

        // B2B calculations
        const totalB2B = Math.floor(
            Object.values(this.channels).reduce((sum, ch) => sum + ch.stores, 0) *
            brand.marketShare
        );

        // Customer sources
        const sources = {
            advertising: newB2C * 0.30,
            promotion: newB2C * 0.25,
            referral: newB2C * 0.20,
            digital: newB2C * 0.15,
            spontaneous: newB2C * 0.10
        };

        // Satisfaction metrics
        const surveyRate = 0.001; // 0.1% of customers surveyed daily
        const surveyed = Math.floor(totalB2C * surveyRate);
        const responseRate = 0.15 + Math.random() * 0.10;

        return {
            totalB2C,
            newB2C,
            lostB2C,
            retainedB2C: totalB2C - lostB2C,
            reactivatedB2C: Math.floor(lostB2C * 0.05),
            inactiveB2C: Math.floor(totalB2C * 0.15),

            totalB2B,
            newB2B: Math.floor(totalB2B * 0.001),
            lostB2B: Math.floor(totalB2B * 0.0005),
            activePoS: Math.floor(totalB2B * 0.75),

            viaAdvertising: Math.floor(sources.advertising),
            viaPromotion: Math.floor(sources.promotion),
            viaReferral: Math.floor(sources.referral),
            viaDigital: Math.floor(sources.digital),
            viaSpontaneous: Math.floor(sources.spontaneous),

            avgFrequency: 2.5 + Math.random(),
            avgValue: 4.50 + Math.random() * 2,
            avgQuantity: 2 + Math.random(),
            avgDaysBetween: 12 + Math.floor(Math.random() * 8),
            repurchaseRate: (0.60 + Math.random() * 0.15) * 100,

            surveysSent: surveyed,
            surveysAnswered: Math.floor(surveyed * responseRate),
            promoters: Math.floor(surveyed * responseRate * 0.35),
            neutral: Math.floor(surveyed * responseRate * 0.45),
            detractors: Math.floor(surveyed * responseRate * 0.20),
            complaints: Math.floor(Math.random() * 5),
            complaintsSolved: Math.floor(Math.random() * 4)
        };
    }

    generateDigitalMetrics(brand, date, decisions, marketing) {
        const baseTraffic = brand.marketShare * 50000;
        const campaignBoost = marketing.online > 0 ? 1.5 : 1.0;

        // Website metrics
        const uniqueVisitors = Math.floor(baseTraffic * campaignBoost * (0.8 + Math.random() * 0.4));
        const sessions = Math.floor(uniqueVisitors * 1.3);
        const pageViews = Math.floor(sessions * (2 + Math.random() * 3));

        // Campaign metrics
        const impressions = Math.floor(marketing.online * 100);
        const clicks = Math.floor(impressions * 0.02 * (0.8 + Math.random() * 0.4));
        const conversions = Math.floor(clicks * 0.03 * (0.7 + Math.random() * 0.6));

        // Social media (cumulative growth)
        const daysSinceStart = Math.floor((date - new Date('2023-01-01')) / (1000 * 60 * 60 * 24));
        const growthFactor = 1 + (daysSinceStart / 365) * 0.5;

        // Email metrics
        const emailList = Math.floor(brand.marketShare * this.marketSize.activeConsumers * 0.15 * growthFactor);
        const emailsSent = Math.floor(emailList * 0.01); // 1% daily

        return {
            uniqueVisitors,
            sessions,
            pageViews,
            bounceRate: (30 + Math.random() * 25).toFixed(2),
            avgDuration: Math.floor(45 + Math.random() * 120),
            pagesPerSession: (pageViews / sessions).toFixed(2),
            newVsReturning: (40 + Math.random() * 20).toFixed(2),

            impressions,
            clicks,
            ctr: ((clicks / impressions) * 100).toFixed(2),
            cpc: (marketing.online / clicks).toFixed(2),
            conversions,
            conversionRate: ((conversions / clicks) * 100).toFixed(2),
            costPerConversion: (marketing.online / conversions).toFixed(2),

            facebook: Math.floor(15000 * brand.marketShare * growthFactor),
            instagram: Math.floor(25000 * brand.marketShare * growthFactor),
            tiktok: Math.floor(10000 * brand.marketShare * growthFactor),
            twitter: Math.floor(5000 * brand.marketShare * growthFactor),
            posts: Math.floor(1 + Math.random() * 3),
            organicReach: Math.floor(5000 + Math.random() * 10000),
            paidReach: Math.floor(impressions * 0.1),
            engagementRate: (2 + Math.random() * 4).toFixed(2),
            comments: Math.floor(10 + Math.random() * 50),
            shares: Math.floor(5 + Math.random() * 20),
            mentions: Math.floor(2 + Math.random() * 10),

            emailList,
            emailsSent,
            emailsDelivered: Math.floor(emailsSent * 0.98),
            emailsOpened: Math.floor(emailsSent * 0.22),
            emailOpenRate: 22 + Math.random() * 8,
            emailClicks: Math.floor(emailsSent * 0.03),
            emailCTR: 3 + Math.random() * 2,
            unsubscribes: Math.floor(emailsSent * 0.001),

            influencers: Math.floor(2 + Math.random() * 5),
            influencerReach: Math.floor(10000 + Math.random() * 50000),
            sponsoredPosts: Math.floor(Math.random() * 2),
            influencerEngagement: (3 + Math.random() * 5).toFixed(2),
            costPerPost: 500 + Math.random() * 1500
        };
    }

    generateSalesMetrics(brand, date, channelSales) {
        const salesTeamSize = Math.floor(brand.employees * 0.15);

        return {
            salespeople: salesTeamSize,
            supervisors: Math.floor(salesTeamSize / 8),
            managers: Math.floor(salesTeamSize / 20),
            plannedVisits: salesTeamSize * 5,
            completedVisits: Math.floor(salesTeamSize * 5 * 0.85),
            avgVisitDuration: 30 + Math.random() * 30,

            leads: Math.floor(20 + Math.random() * 30),
            qualified: Math.floor(15 + Math.random() * 20),
            proposals: Math.floor(8 + Math.random() * 12),
            negotiations: Math.floor(5 + Math.random() * 8),
            closedDeals: Math.floor(2 + Math.random() * 5),
            closedValue: (2000 + Math.random() * 8000),
            avgDealSize: 2000 + Math.random() * 3000,

            salaries: salesTeamSize * 100,
            commissions: (2000 + Math.random() * 8000) * 0.05,
            visitCosts: (salesTeamSize * 5 * 0.85) * 15,
            merchandising: 500 + Math.random() * 1500,
            incentives: 1000 + Math.random() * 3000,
            totalCost: 0 // calculated sum
        };
    }

    calculateDistribution(brand, channelSales, date) {
        const totalStores = Object.values(this.channels).reduce((sum, ch) => sum + ch.stores, 0);
        const brandStores = Math.floor(totalStores * brand.marketShare * 0.7);

        return {
            numeric: (brandStores / totalStores * 100).toFixed(2),
            weighted: (brand.marketShare * 100 * 1.2).toFixed(2),
            stockoutDays: Math.floor(Math.random() * 3),
            retailStock: Math.floor(1000 + Math.random() * 5000),
            warehouseStock: Math.floor(10000 + Math.random() * 50000),
            activeSKUs: 4 + Math.floor(Math.random() * 3),
            newLaunches: Math.random() > 0.95 ? 1 : 0,
            discontinued: Math.random() > 0.98 ? 1 : 0,
            defectRate: (0.001 + Math.random() * 0.002).toFixed(4),
            returned: Math.floor(Math.random() * 10),
            shelfLife: 365 - Math.floor(Math.random() * 30)
        };
    }

    getMarketContext(date) {
        const context = {
            competitorActions: [],
            costIncrease: 0,
            volumeChange: 0
        };

        // Check for market events
        this.marketEvents.forEach(event => {
            const eventDate = new Date(event.date);
            if (this.isSameDay(eventDate, date)) {
                if (event.impact.allBrands) {
                    context.costIncrease += event.impact.allBrands.costIncrease || 0;
                    context.volumeChange += event.impact.allBrands.volumeIncrease || 0;
                    context.volumeChange -= event.impact.allBrands.volumeDecrease || 0;
                }
                context.competitorActions.push(event.description);
            }
        });

        return context;
    }

    getActiveDecisions(brandId, date) {
        const decisions = [];

        if (this.brandDecisions[brandId]) {
            this.brandDecisions[brandId].forEach(decision => {
                const decisionDate = new Date(decision.date);
                const daysSince = Math.floor((date - decisionDate) / (1000 * 60 * 60 * 24));

                // Decisions have impact for 90 days
                if (daysSince >= 0 && daysSince <= 90) {
                    decisions.push(decision);
                }
            });
        }

        return decisions;
    }

    getSeasonality(date) {
        const month = date.getMonth();
        const dayOfWeek = date.getDay();

        // Monthly seasonality
        const monthlyFactors = [
            0.85, // Jan
            0.88, // Feb
            0.92, // Mar
            0.98, // Apr
            1.05, // May
            1.25, // Jun (summer start)
            1.35, // Jul (peak summer)
            1.30, // Aug
            1.10, // Sep (back to school)
            0.95, // Oct
            0.90, // Nov
            1.15  // Dec (holidays)
        ];

        // Weekly pattern
        const weeklyFactors = [
            0.75, // Sun
            0.90, // Mon
            0.95, // Tue
            1.00, // Wed
            1.10, // Thu
            1.35, // Fri
            1.20  // Sat
        ];

        return {
            factor: monthlyFactors[month] * weeklyFactors[dayOfWeek],
            month: month,
            dayOfWeek: dayOfWeek
        };
    }

    calculateAdjustedMarketShare(baseShare, decisions, marketContext, date) {
        let adjustedShare = baseShare;

        // Apply decision impacts
        decisions.forEach(d => {
            if (d.impact.marketShareIncrease) {
                adjustedShare += d.impact.marketShareIncrease;
            }
        });

        // Apply market context
        if (marketContext.volumeChange) {
            adjustedShare *= (1 + marketContext.volumeChange * 0.1);
        }

        // Add some random daily variation
        adjustedShare *= (0.95 + Math.random() * 0.10);

        return Math.min(Math.max(adjustedShare, 0.01), 0.35); // Keep between 1% and 35%
    }

    normalizeMarketShares() {
        // This ensures all market shares sum to 100% each day
        Object.keys(this.historicalData).forEach(brandId => {
            // Process daily data is sufficient, aggregations will follow
        });
    }

    getCompetitorPrices(brandId, date) {
        const prices = {};
        Object.entries(this.brands).forEach(([id, brand]) => {
            if (id !== brandId) {
                prices[brand.name] = brand.basePrice250ml * (0.95 + Math.random() * 0.10);
            }
        });
        return prices;
    }

    getCompetitorPromotions(brandId, date) {
        const promotions = [];
        Object.entries(this.brands).forEach(([id, brand]) => {
            if (id !== brandId && Math.random() > 0.8) {
                promotions.push({
                    brand: brand.name,
                    type: ['2x1', '30% off', 'Free sample', 'Bundle'][Math.floor(Math.random() * 4)]
                });
            }
        });
        return promotions;
    }

    getCompetitorLaunches(brandId, date) {
        const launches = [];
        Object.entries(this.brands).forEach(([id, brand]) => {
            if (id !== brandId && Math.random() > 0.95) {
                launches.push({
                    brand: brand.name,
                    product: ['New flavor', 'Limited edition', 'Zero sugar', 'Extra caffeine'][Math.floor(Math.random() * 4)]
                });
            }
        });
        return launches;
    }

    calculateShareOfVoice(brandId, brandSpend, date) {
        let totalMarketSpend = 0;

        Object.keys(this.brands).forEach(id => {
            // Estimate competitor spend based on market share
            const estimatedSpend = this.brands[id].marketShare * this.marketSize.totalValue * 0.08 / 365;
            totalMarketSpend += estimatedSpend;
        });

        return ((brandSpend / totalMarketSpend) * 100).toFixed(2);
    }

    generateCustomerDatabases() {
        // Generate detailed customer records for each brand
        Object.keys(this.brands).forEach(brandId => {
            this.customerDatabase[brandId] = {
                b2c: [],
                b2b: []
            };

            const brand = this.brands[brandId];
            const numB2CCustomers = Math.floor(brand.marketShare * this.marketSize.activeConsumers);
            const numB2BCustomers = Math.floor(
                Object.values(this.channels).reduce((sum, ch) => sum + ch.stores, 0) *
                brand.marketShare * 0.7
            );

            // Generate B2C customers
            for (let i = 0; i < numB2CCustomers; i++) {
                this.customerDatabase[brandId].b2c.push(this.generateB2CCustomer(brandId, i));
            }

            // Generate B2B customers
            for (let i = 0; i < numB2BCustomers; i++) {
                this.customerDatabase[brandId].b2b.push(this.generateB2BCustomer(brandId, i));
            }
        });
    }

    generateB2CCustomer(brandId, index) {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - Math.random() * 2);

        return {
            id: `B2C-${brandId}-${String(index).padStart(6, '0')}`,
            acquisitionDate: startDate.toISOString().split('T')[0],
            acquisitionChannel: ['advertising', 'promotion', 'referral', 'digital', 'spontaneous'][Math.floor(Math.random() * 5)],
            age: 18 + Math.floor(Math.random() * 32),
            gender: Math.random() > 0.5 ? 'M' : 'F',
            region: ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve'][Math.floor(Math.random() * 5)],
            purchaseFrequency: 1 + Math.random() * 4,
            averagePurchase: 2 + Math.random() * 3,
            lifetime: Math.floor(Math.random() * 730),
            totalSpent: 10 + Math.random() * 500,
            lastPurchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: Math.random() > 0.15 ? 'active' : 'inactive',
            npsScore: Math.floor(Math.random() * 11),
            preferredSKU: Object.keys(this.skus)[Math.floor(Math.random() * 4)]
        };
    }

    generateB2BCustomer(brandId, index) {
        const channelTypes = Object.keys(this.channels);
        const channel = channelTypes[Math.floor(Math.random() * channelTypes.length)];

        return {
            id: `B2B-${brandId}-${String(index).padStart(4, '0')}`,
            name: `${this.channels[channel].name} ${index}`,
            channel: channel,
            contractStart: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyVolume: 100 + Math.random() * 1000,
            creditTerms: this.channels[channel].paymentDays,
            discount: 0.05 + Math.random() * 0.15,
            exclusivity: Math.random() > 0.9,
            merchandisingSupport: Math.random() > 0.5,
            status: Math.random() > 0.1 ? 'active' : 'inactive'
        };
    }

    generateB2BRelationships() {
        // Track which stores carry which brands
        this.b2bCustomers = {};

        Object.keys(this.channels).forEach(channelId => {
            const channel = this.channels[channelId];
            this.b2bCustomers[channelId] = [];

            for (let i = 0; i < channel.stores; i++) {
                const store = {
                    id: `${channelId}-${String(i).padStart(4, '0')}`,
                    name: `${channel.name} Store ${i}`,
                    location: ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve'][Math.floor(Math.random() * 5)],
                    size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
                    brandsCarried: []
                };

                // Determine which brands this store carries
                Object.keys(this.brands).forEach(brandId => {
                    const probability = this.brands[brandId].marketShare * 3; // Higher share = more likely to be carried
                    if (Math.random() < probability) {
                        store.brandsCarried.push(brandId);
                    }
                });

                // Ensure at least one brand is carried
                if (store.brandsCarried.length === 0) {
                    const randomBrand = Object.keys(this.brands)[Math.floor(Math.random() * 8)];
                    store.brandsCarried.push(randomBrand);
                }

                this.b2bCustomers[channelId].push(store);
            }
        });
    }

    generateTransactionHistory() {
        // Generate individual transactions for the last 30 days for detail
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        Object.keys(this.brands).forEach(brandId => {
            const brand = this.brands[brandId];
            let currentDate = new Date(thirtyDaysAgo);

            while (currentDate <= new Date()) {
                // Generate 50-200 transactions per day per brand
                const numTransactions = 50 + Math.floor(Math.random() * 150);

                for (let i = 0; i < numTransactions; i++) {
                    this.transactionLog.push(this.generateTransaction(brandId, brand, currentDate));
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
    }

    generateTransaction(brandId, brand, date) {
        const isB2B = Math.random() > 0.3; // 70% B2B, 30% B2C

        if (isB2B) {
            const channel = Object.keys(this.channels)[Math.floor(Math.random() * Object.keys(this.channels).length)];
            const quantity = 24 + Math.floor(Math.random() * 200); // Cases
            const unitPrice = brand.basePrice250ml * (1 - this.channels[channel].margin);

            return {
                id: `TRX-${date.toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9)}`,
                date: date.toISOString(),
                brandId: brandId,
                type: 'B2B',
                channel: channel,
                customerId: `B2B-${brandId}-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
                sku: Object.keys(this.skus)[Math.floor(Math.random() * 4)],
                quantity: quantity,
                unitPrice: unitPrice,
                discount: unitPrice * 0.05,
                finalPrice: unitPrice * 0.95,
                totalValue: quantity * unitPrice * 0.95,
                paymentTerms: this.channels[channel].paymentDays
            };
        } else {
            const quantity = 1 + Math.floor(Math.random() * 6);
            const unitPrice = brand.basePrice250ml;

            return {
                id: `TRX-${date.toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9)}`,
                date: date.toISOString(),
                brandId: brandId,
                type: 'B2C',
                channel: 'retail',
                customerId: `B2C-${brandId}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
                sku: Object.keys(this.skus)[Math.floor(Math.random() * 4)],
                quantity: quantity,
                unitPrice: unitPrice,
                discount: 0,
                finalPrice: unitPrice,
                totalValue: quantity * unitPrice,
                paymentTerms: 0
            };
        }
    }

    generateMarketingCampaigns() {
        // Generate historical campaigns
        Object.keys(this.brands).forEach(brandId => {
            const brand = this.brands[brandId];
            const campaigns = [];

            // Generate 2-4 campaigns per quarter for 2 years
            for (let quarter = 0; quarter < 8; quarter++) {
                const numCampaigns = 2 + Math.floor(Math.random() * 3);

                for (let c = 0; c < numCampaigns; c++) {
                    const startDate = new Date();
                    startDate.setFullYear(startDate.getFullYear() - 2);
                    startDate.setMonth(startDate.getMonth() + (quarter * 3) + Math.floor(Math.random() * 3));

                    campaigns.push(this.generateCampaign(brandId, brand, startDate));
                }
            }

            this.marketingCampaigns.push(...campaigns);
        });
    }

    generateCampaign(brandId, brand, startDate) {
        const campaignTypes = ['digital', 'tv', 'outdoor', 'promotion', 'sponsorship', 'influencer'];
        const type = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
        const duration = 7 + Math.floor(Math.random() * 60); // 7-67 days

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        const budget = 10000 + Math.random() * 200000;

        return {
            id: `CAMP-${brandId}-${startDate.toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 5)}`,
            brandId: brandId,
            name: `${brand.name} ${type} Campaign`,
            type: type,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            budget: budget,
            actualSpend: budget * (0.85 + Math.random() * 0.15),
            impressions: Math.floor(budget * (50 + Math.random() * 150)),
            reach: Math.floor(budget * (20 + Math.random() * 80)),
            clicks: Math.floor(budget * (1 + Math.random() * 5)),
            conversions: Math.floor(budget * (0.01 + Math.random() * 0.05)),
            newCustomers: Math.floor(budget * (0.005 + Math.random() * 0.02)),
            roi: -50 + Math.random() * 300,
            status: endDate < new Date() ? 'completed' : 'active'
        };
    }

    aggregateHistoricalData(brandId) {
        const daily = this.historicalData[brandId].daily;

        // Weekly aggregation
        const weekly = [];
        for (let i = 0; i < daily.length; i += 7) {
            const week = daily.slice(i, Math.min(i + 7, daily.length));
            if (week.length > 0) {
                weekly.push(this.aggregatePeriod(week, 'week'));
            }
        }
        this.historicalData[brandId].weekly = weekly;

        // Monthly aggregation
        const monthly = [];
        let currentMonth = null;
        let monthData = [];

        daily.forEach(day => {
            const month = day.date.substring(0, 7);
            if (currentMonth !== month) {
                if (monthData.length > 0) {
                    monthly.push(this.aggregatePeriod(monthData, 'month'));
                }
                currentMonth = month;
                monthData = [day];
            } else {
                monthData.push(day);
            }
        });

        if (monthData.length > 0) {
            monthly.push(this.aggregatePeriod(monthData, 'month'));
        }
        this.historicalData[brandId].monthly = monthly;

        // Quarterly aggregation
        const quarterly = [];
        for (let i = 0; i < monthly.length; i += 3) {
            const quarter = monthly.slice(i, Math.min(i + 3, monthly.length));
            if (quarter.length > 0) {
                quarterly.push(this.aggregatePeriod(quarter, 'quarter'));
            }
        }
        this.historicalData[brandId].quarterly = quarterly;

        // Yearly aggregation
        const yearly = [];
        for (let i = 0; i < monthly.length; i += 12) {
            const year = monthly.slice(i, Math.min(i + 12, monthly.length));
            if (year.length > 0) {
                yearly.push(this.aggregatePeriod(year, 'year'));
            }
        }
        this.historicalData[brandId].yearly = yearly;
    }

    aggregatePeriod(periodData, periodType) {
        // Sum or average appropriately
        const aggregated = {};

        // Get first record structure
        const firstRecord = periodData[0];

        // Aggregate each field appropriately
        Object.keys(firstRecord).forEach(key => {
            if (key === 'date' || key === 'timestamp' || key === 'brandId') {
                aggregated[key] = firstRecord[key];
            } else if (typeof firstRecord[key] === 'number') {
                // Determine if should sum or average
                const sumFields = ['unitsSold', 'volumeLiters', 'grossRevenue', 'netRevenue',
                                 'totalCost', 'totalMarketingSpend', 'newB2CCustomers', 'lostB2CCustomers'];

                if (sumFields.some(field => key.includes(field))) {
                    // Sum these fields
                    aggregated[key] = periodData.reduce((sum, day) => sum + (day[key] || 0), 0);
                } else {
                    // Average these fields
                    aggregated[key] = periodData.reduce((sum, day) => sum + (day[key] || 0), 0) / periodData.length;
                }
            } else {
                // Keep last value for non-numeric fields
                aggregated[key] = periodData[periodData.length - 1][key];
            }
        });

        aggregated.periodType = periodType;
        aggregated.startDate = periodData[0].date;
        aggregated.endDate = periodData[periodData.length - 1].date;
        aggregated.dataPoints = periodData.length;

        return aggregated;
    }

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

        Object.keys(this.brands).forEach(brandId => {
            const brand = this.brands[brandId];
            const realtimeData = this.generateCompleteDailyData(brandId, brand, now);

            // Add to historical data
            if (!this.historicalData[brandId].realtime) {
                this.historicalData[brandId].realtime = [];
            }

            this.historicalData[brandId].realtime.push(realtimeData);

            // Keep only last 100 realtime records
            if (this.historicalData[brandId].realtime.length > 100) {
                this.historicalData[brandId].realtime.shift();
            }
        });

        // Trigger update event
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('marketDataUpdate', {
                detail: {
                    timestamp: now.getTime(),
                    brands: Object.keys(this.brands)
                }
            }));
        }
    }

    // Utility functions
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Data access methods
    getHistoricalData(brandId, periodType = 'daily', startDate = null, endDate = null) {
        if (!this.historicalData[brandId]) return [];

        let data = this.historicalData[brandId][periodType] || [];

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

    getRealtimeData(brandId = null) {
        if (!brandId) {
            // Return all brands' latest data
            const allData = {};
            Object.keys(this.brands).forEach(id => {
                const realtime = this.historicalData[id].realtime;
                if (realtime && realtime.length > 0) {
                    allData[id] = realtime[realtime.length - 1];
                }
            });
            return allData;
        }

        const realtime = this.historicalData[brandId].realtime;
        return realtime && realtime.length > 0 ? realtime[realtime.length - 1] : null;
    }

    getTransactions(brandId = null, startDate = null, endDate = null, limit = 1000) {
        let transactions = this.transactionLog;

        if (brandId) {
            transactions = transactions.filter(t => t.brandId === brandId);
        }

        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            transactions = transactions.filter(t => {
                const tDate = new Date(t.date).getTime();
                return tDate >= start && tDate <= end;
            });
        }

        return transactions.slice(0, limit);
    }

    getCampaigns(brandId = null, status = null) {
        let campaigns = this.marketingCampaigns;

        if (brandId) {
            campaigns = campaigns.filter(c => c.brandId === brandId);
        }

        if (status) {
            campaigns = campaigns.filter(c => c.status === status);
        }

        return campaigns;
    }

    getCustomers(brandId, type = 'b2c', limit = 1000) {
        if (!this.customerDatabase[brandId]) return [];

        return this.customerDatabase[brandId][type].slice(0, limit);
    }

    getBrandInfo(brandId) {
        return this.brands[brandId] || null;
    }

    getAllBrands() {
        return Object.values(this.brands);
    }

    getMarketTotals() {
        return {
            totalValue: this.marketSize.totalValue,
            totalVolume: this.marketSize.totalVolume,
            totalUnits: this.marketSize.totalUnits,
            totalConsumers: this.marketSize.activeConsumers,
            marketGrowth: (this.marketSize.growthRate * 100).toFixed(2),
            numberOfBrands: Object.keys(this.brands).length,
            totalEmployees: Object.values(this.brands).reduce((sum, b) => sum + b.employees, 0)
        };
    }

    exportData(format = 'json') {
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                market: 'Energy Drinks Portugal',
                period: '2 years historical + realtime',
                brands: Object.keys(this.brands).length,
                dataPoints: this.historicalData[Object.keys(this.brands)[0]].daily.length
            },
            marketInfo: this.getMarketTotals(),
            brands: this.brands,
            historicalData: this.historicalData,
            transactions: this.transactionLog.slice(-1000), // Last 1000 transactions
            campaigns: this.marketingCampaigns,
            marketEvents: this.marketEvents,
            brandDecisions: this.brandDecisions
        };

        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        } else if (format === 'csv') {
            // Convert to CSV format
            // This would need proper CSV conversion logic
            return this.convertToCSV(exportData);
        }

        return exportData;
    }

    convertToCSV(data) {
        // Simplified CSV conversion for daily data
        const headers = Object.keys(this.historicalData[Object.keys(this.brands)[0]].daily[0]);
        let csv = headers.join(';') + '\n';

        Object.keys(this.brands).forEach(brandId => {
            this.historicalData[brandId].daily.forEach(day => {
                csv += headers.map(h => day[h] || '').join(';') + '\n';
            });
        });

        return csv;
    }
}

// Initialize the market simulator
const marketSimulator = new EnergyDrinksMarketSimulator();

// Make it globally available
if (typeof window !== 'undefined') {
    window.marketSimulator = marketSimulator;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnergyDrinksMarketSimulator;
}