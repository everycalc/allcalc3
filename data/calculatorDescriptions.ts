export const calculatorDescriptions: { [key: string]: { description: string; faqs: { q: string; a: string }[], examples?: { title: string; description: string, inputs: any, result: string }[] } } = {
    'E-commerce Profit Calculator': {
        description: 'Gain a crystal-clear understanding of your e-commerce profitability on a per-order basis. This expert-level tool goes beyond simple revenue-minus-cost calculations. It meticulously accounts for the complex variables that determine true profit in an online business, including the cost of goods (COGS), packaging, forward shipping to the customer, and variable fees from payment gateways and marketplaces. Crucially, it also factors in the financial impact of Return-to-Origin (RTO) orders—a major profit leak for many businesses. By calculating losses from RTO shipping and determining if the product cost is also lost, this tool provides a "blended profit" per order. This blended figure is an average that represents your profitability across both successful deliveries and costly returns, giving you an accurate and realistic picture of your business\'s financial health. Use these insights to optimize pricing, reduce RTOs, and make data-driven decisions to boost your bottom line.',
        faqs: [
            { q: 'What is blended profit?', a: 'Blended profit is your average profit across all orders, factoring in both successfully delivered orders and costly returned (RTO) orders. It gives you a more realistic view of your business\'s health than looking at delivered orders alone.' },
            { q: 'Why is my Return-to-Origin (RTO) rate so important?', a: 'A high RTO rate can severely damage profitability. For every RTO, you lose money on forward shipping, reverse shipping, packaging, and potentially the cost of the product itself if it\'s damaged. Reducing your RTO rate is one of the fastest ways to increase profits.' },
            { q: 'What should be included in COGS?', a: 'Cost of Goods Sold (COGS) should include all direct costs related to the product itself. This means the purchase price from your supplier, any raw material costs, and manufacturing labor. It should not include indirect costs like marketing or rent.' },
            { q: 'What is the difference between a Payment Gateway Fee and a Marketplace Fee?', a: 'A Payment Gateway Fee (e.g., Stripe, Razorpay) is what you pay to process the customer\'s credit/debit card transaction. A Marketplace Fee (e.g., Amazon, Etsy) is the commission the platform takes for listing and selling your product on their site.'},
            { q: 'How can I reduce my RTO shipping costs?', a: 'Negotiate with your courier partners for better reverse shipping rates. Some couriers offer lower RTO rates than forward shipping. Also, implementing better address verification at checkout can reduce delivery failures, which are a primary cause of RTOs.'}
        ],
        examples: [
            {
                title: 'Scenario 1: Basic T-Shirt Sale',
                description: 'Calculating the profit from a single t-shirt order with a moderate RTO rate.',
                inputs: { sellingPrice: 500, cogs: 150, shippingCost: 80, pgFeePercent: 2.5, rtoRate: 10 },
                result: 'The blended profit per order is approx. ₹218.75.'
            },
            {
                title: 'Scenario 2: High-Value Electronics',
                description: 'Analyzing a more expensive item where COGS is lost on return, showing a much higher risk from RTOs.',
                inputs: { sellingPrice: 2000, cogs: 1200, shippingCost: 100, pgFeePercent: 2, rtoRate: 15, isCogsLostOnRto: true },
                result: 'The blended profit per order is approx. ₹401.00.'
            }
        ]
    },
    'Product Cost Calculator': {
        description: 'Unlock the true cost of creating your product with this comprehensive calculator. Accurately determining your cost per unit is the cornerstone of a sustainable business strategy. This tool enables you to break down your expenses into four critical categories: Materials (the raw components of your product), Labor (the work involved in assembly), Packaging (the final presentation and protection), and Overheads (indirect costs like rent or utilities spread across a production batch). By inputting these variables, you get a precise cost-per-unit figure. But it doesn\'t stop there. You can then input your desired profit margin to calculate the recommended selling price, ensuring that your pricing strategy is not just covering costs, but actively building a profitable business. This empowers you to price with confidence, understand your profitability drivers, and make strategic decisions about sourcing and production.',
        faqs: [
            { q: 'What is the difference between direct and indirect (overhead) costs?', a: 'Direct costs, like materials and labor, are directly tied to producing a single unit. Indirect or overhead costs, like rent or software subscriptions, are general business expenses that must be distributed across all units produced to get a true cost.' },
            { q: 'Why is accurate product costing important?', a: 'Accurate costing is the foundation of a profitable business. It allows you to set the right price, understand your profit margins, identify areas to reduce costs, and make informed decisions about which products to promote or discontinue.' },
            { q: 'How should I calculate labor cost if I pay myself?', a: 'Even if you\'re a solo founder, it\'s crucial to pay yourself. Determine a realistic hourly wage for your time and track the minutes it takes to produce one unit. Use the "Per Hour" labor cost type to accurately factor this into your product cost.'},
            { q: 'What does "Units Produced in Batch" mean for overheads?', a: 'Overhead costs are typically fixed for a period (e.g., monthly rent). To allocate this to a single product, you divide the total overhead cost by the number of units you produce in that period. This ensures each product carries its fair share of the indirect costs.'},
            { q: 'What is a typical profit margin?', a: 'This varies massively by industry. Retail might see 20-40%, while software can be 80%+. A good starting point is 50%, which means your cost is half your selling price. Research your specific industry to set a competitive yet profitable margin.'}
        ],
        examples: [
            {
                title: 'Example 1: Handmade Candle',
                description: 'Calculating the total cost per candle for a small batch, including materials, labor, and overheads.',
                inputs: { unitsProduced: 100, profitMargin: 60, totalMaterialCost: 80, totalLaborCost: 40, totalPackagingCost: 20, overheadCostPerUnit: 50 },
                result: 'Total Cost/Unit is ₹190.00, Recommended Price is ₹475.00.'
            },
            {
                title: 'Example 2: Custom Printed Mug',
                description: 'A higher volume example showing how overhead costs are distributed more thinly across a larger batch.',
                inputs: { unitsProduced: 1000, profitMargin: 50, totalMaterialCost: 60, totalLaborCost: 15, totalPackagingCost: 15, overheadCostPerUnit: 10 },
                result: 'Total Cost/Unit is ₹100.00, Recommended Price is ₹200.00.'
            }
        ]
    },
    'Recipe Cost Calculator': {
        description: 'An essential tool for any culinary business, from restaurants and cafes to bakeries and home-based food creators. This calculator allows you to determine the precise cost of any dish on your menu by breaking down the cost of each individual ingredient. Simply list your ingredients, enter the price you pay for the bulk package (e.g., the cost of a 5kg bag of flour) and its size, and then specify the exact amount used in a single serving of your recipe. The tool automatically calculates the cost for each component and sums them up to give you the total food cost for the dish. This granular approach is critical for effective menu engineering, ensuring your prices are not only competitive but also profitable. Use this data to manage your food costs, optimize your menu, and build a financially successful food business.',
        faqs: [
            { q: 'How do I account for ingredient waste?', a: 'A common industry practice is to add a small percentage (e.g., 5-10%) to your final recipe cost to account for potential waste like spoilage, trimming, or cooking errors. You can do this by slightly increasing the "used amount" for key ingredients.' },
            { q: 'How does this help with menu pricing?', a: 'Knowing your exact recipe cost is crucial for menu pricing. A general rule is that your food cost should be around 25-35% of your menu price, leaving the rest to cover labor, overheads, and profit.' },
            { q: 'Should I include water or salt in the costing?', a: 'While the cost is minimal, it\'s good practice to include everything. For items like salt, spices, or oil that are hard to measure per dish, you can add a small, fixed "sundry" cost (e.g., $0.10) to each recipe to account for them.'},
            { q: 'What unit should I use for package size and used amount?', a: 'The most important thing is to be consistent. If your package size is in grams, your used amount should also be in grams. If it\'s in milliliters, the used amount should be in milliliters. Consistency is key to an accurate calculation.'},
            { q: 'How often should I update my recipe costs?', a: 'Ingredient prices fluctuate. It\'s a good idea to review and update your recipe costs every 3-6 months, or whenever you notice a significant price change from one of your main suppliers, to ensure your menu remains profitable.'}
        ],
        examples: [
            {
                title: 'Example 1: Chocolate Cake Slice',
                description: 'Costing a single slice of chocolate cake based on the bulk ingredients used to make a whole cake.',
                inputs: { 'Flour (500g for ₹50)': '100g used', 'Sugar (1kg for ₹40)': '200g used', 'Chocolate (1kg for ₹400)': '150g used' },
                result: 'The total cost for the ingredients is approx. ₹78.00.'
            },
            {
                title: 'Example 2: Cup of Coffee',
                description: 'Calculating the cost of a single cup of coffee, including beans, milk, and the cup itself.',
                inputs: { 'Coffee Beans (1kg for ₹1000)': '18g used', 'Milk (1L for ₹60)': '150ml used', 'Paper Cup': '1 unit at ₹3/unit' },
                result: 'The total cost per cup is approx. ₹30.00.'
            }
        ]
    },
    'CLV & CAC Calculator': {
        description: 'Measure the long-term health and sustainability of your business with two of the most critical metrics in marketing: Customer Lifetime Value (CLV) and Customer Acquisition Cost (CAC). CLV predicts the total net profit your business will make from a single customer over the entire duration of their relationship with you. CAC measures how much it costs to acquire a new customer. By comparing these two, you get the CLV:CAC ratio, a powerful indicator of your marketing efficiency and business model viability. A healthy ratio shows that you are efficiently acquiring customers who generate significant long-term value. This calculator simplifies the formulas, allowing you to input your business variables and see the results instantly, providing crucial insights for scaling your marketing efforts profitably.',
        faqs: [
            { q: 'What is a good CLV to CAC ratio?', a: 'A healthy CLV:CAC ratio is typically considered to be 3:1 or higher. This means for every dollar you spend to acquire a customer, you get three dollars in profit back over their lifetime. A ratio below 1:1 means you are losing money on each new customer.' },
            { q: 'How can I improve my CLV?', a: 'You can increase CLV by encouraging repeat purchases through loyalty programs, improving customer service to reduce churn, and increasing the average order value through upselling or cross-selling.' },
            { q: 'What should be included in "Total Marketing Spend"?', a: 'This should include all costs associated with acquiring new customers over a specific period. This includes ad spend, salaries of your marketing and sales teams, and the cost of any tools or software they use.'},
            { q: 'How do I estimate "Customer Lifetime"?', a: 'This can be tricky for new businesses. A simple way is to look at your churn rate (the percentage of customers who leave in a period). The average customer lifetime is 1 / churn rate. For example, if you lose 25% of your customers each year (0.25 churn), your average customer lifetime is 1 / 0.25 = 4 years.'},
            { q: 'Why is this ratio so important for startups?', a: 'For startups and growing businesses, this ratio is a key indicator for investors. It proves that your business model is sustainable. It shows that you not only know how to get new customers, but that you can do so profitably, which is essential for long-term success.'}
        ],
        examples: [
            {
                title: 'Example 1: Subscription Box Business',
                description: 'A subscription service with steady monthly revenue and clear acquisition costs.',
                inputs: { aov: 500, purchaseFrequency: 12, grossMargin: 70, customerLifetime: 2, marketingSpend: 100000, newCustomers: 500 },
                result: 'CLV is ₹8,400, CAC is ₹200, giving a very healthy 42:1 ratio.'
            },
            {
                title: 'Example 2: Online Clothing Store',
                description: 'An e-commerce store with less frequent purchases but a higher AOV.',
                inputs: { aov: 2500, purchaseFrequency: 3, grossMargin: 50, customerLifetime: 3, marketingSpend: 300000, newCustomers: 1000 },
                result: 'CLV is ₹11,250, CAC is ₹300, for an excellent 37.5:1 ratio.'
            }
        ]
    },
    'Inventory Management Calculator': {
        description: 'Take control of your supply chain and optimize your cash flow with this powerful inventory management tool. It calculates two fundamental metrics for efficient inventory control. First, the Economic Order Quantity (EOQ), which is the ideal order size that minimizes the total cost of ordering and holding inventory. Ordering too much increases holding costs, while ordering too little increases ordering frequency and costs. Second, the Reorder Point (ROP), which tells you the exact inventory level at which you need to place a new order to avoid stockouts, taking into account your daily sales and supplier lead time. Using these metrics helps you prevent costly stockouts, reduce storage expenses, and ensure that your capital isn\'t unnecessarily tied up in excess inventory, leading to a more efficient and profitable operation.',
        faqs: [
            { q: 'What is Safety Stock?', a: 'Safety stock is an extra quantity of a product which is stored in the warehouse to prevent an out-of-stock situation. It acts as a buffer against uncertainties in demand or supply lead time.' },
            { q: 'What is the difference between ordering cost and holding cost?', a: 'Ordering costs are the expenses incurred to create and process an order to a supplier (e.g., shipping fees, administrative costs). Holding costs are the costs associated with storing inventory that is waiting to be sold (e.g., warehouse rent, insurance, spoilage).' },
            { q: 'What is "Lead Time"?', a: 'Lead time is the total time it takes from the moment you place an order with your supplier to the moment you receive the goods in your warehouse. Accurately estimating this is crucial for the Reorder Point calculation.'},
            { q: 'Is EOQ always the right number of units to order?', a: 'EOQ is a theoretical ideal. In the real world, you might need to adjust it. For example, your supplier might have a Minimum Order Quantity (MOQ), or you might get a significant price break for ordering a larger quantity. EOQ is a fantastic baseline to guide your decision.'},
            { q: 'What are the risks of ignoring these metrics?', a: 'Ignoring these metrics can lead to two major problems: 1) Overstocking, which ties up your cash, increases storage costs, and risks product obsolescence. 2) Understocking, which leads to stockouts, lost sales, and unhappy customers who may go to a competitor.'}
        ],
        examples: [
            {
                title: 'Example 1: Small Retail Shop',
                description: 'Calculating the ideal order size and reorder point for a popular product.',
                inputs: { annualDemand: 1000, orderingCost: 50, holdingCost: 2, dailyDemand: 3, leadTime: 7, safetyStock: 10 },
                result: 'Ideal order size (EOQ) is 224 units. Reorder when stock hits 31 units.'
            },
            {
                title: 'Example 2: High-Volume Component',
                description: 'Managing inventory for a manufacturing component with high demand and significant ordering costs.',
                inputs: { annualDemand: 50000, orderingCost: 200, holdingCost: 5, dailyDemand: 137, leadTime: 14, safetyStock: 500 },
                result: 'Ideal order size (EOQ) is 2000 units. Reorder when stock hits 2418 units.'
            }
        ]
    },
    'Break-Even ROAS Calculator': {
        description: 'Stop guessing if your ad campaigns are profitable. This indispensable calculator for e-commerce businesses determines your Break-Even Return On Ad Spend (ROAS). ROAS is the total revenue generated for every dollar spent on advertising. However, a simple revenue-to-spend ratio is misleading because it doesn\'t account for your actual costs. This tool goes deeper by factoring in your Average Order Value (AOV), Cost of Goods Sold (COGS), shipping expenses, payment fees, and even losses from Return-to-Origin (RTO) orders. The result is the precise ROAS your campaigns must achieve for you to cover all costs associated with an advertised sale. Any ROAS above this number is profit, and any below is a loss. Use this to set clear targets for your marketing team and scale your ad spend with confidence.',
        faqs: [
            { q: 'What is ROAS?', a: 'ROAS stands for Return On Ad Spend. It\'s a marketing metric that measures the amount of revenue your business earns for each dollar it spends on advertising. A ROAS of 3, for example, means you make $3 in revenue for every $1 spent on ads.' },
            { q: 'Why is my break-even ROAS higher than I thought?', a: 'Break-even ROAS isn\'t just about covering the ad spend; it has to cover the cost of the product, shipping, fees, and even losses from returns. This is why the break-even point is often higher than just 1.0.' },
            { q: 'What is a good "target" ROAS?', a: 'This depends on your profit margin. A good target is significantly above your break-even point. Many businesses aim for a ROAS of 3:1 to 5:1 to ensure healthy profitability after all costs are considered.'},
            { q: 'How does RTO Rate affect my Break-Even ROAS?', a: 'A higher RTO rate dramatically increases your break-even ROAS. This is because you still have to pay for the ad that generated the sale, but you get no revenue from the order and incur additional costs for shipping and returns. Reducing RTO is a key lever for improving ad profitability.'},
            { q: 'Can I use this for lead generation businesses?', a: 'This calculator is specifically designed for e-commerce where a direct sale is made. For lead generation, you would need to calculate your lead-to-customer conversion rate and customer lifetime value to determine your break-even cost per lead.'}
        ],
        examples: [
            {
                title: 'Example 1: Standard E-commerce Store',
                description: 'A typical online store with average margins and RTO rates.',
                inputs: { aov: 500, cogsPercent: 30, shippingCost: 100, prepaidSalesMix: 50, rtoPercent: 15 },
                result: 'The Break-Even ROAS for this setup is approximately 2.30.'
            },
            {
                title: 'Example 2: Store with High RTO',
                description: 'Shows how a high RTO rate significantly increases the required ROAS to be profitable.',
                inputs: { aov: 500, cogsPercent: 30, shippingCost: 100, prepaidSalesMix: 50, rtoPercent: 30 },
                result: 'The Break-Even ROAS jumps to approximately 3.38.'
            }
        ]
    },
    'Break-Even Point Calculator': {
        description: 'Discover the most fundamental number for your business\'s survival and success: the break-even point. This is the moment when your total sales revenue exactly equals your total expenses, meaning you are neither making a profit nor a loss. This calculator helps you determine this critical milestone in two ways: by the number of units you need to sell, and by the total revenue you need to achieve. To do this, you will separate your costs into two categories: Fixed Costs (like rent and salaries, which don\'t change with sales volume) and Variable Costs (like raw materials, which do change with each unit sold). Understanding your break-even point is essential for setting realistic sales goals, making informed pricing decisions, and managing your costs effectively to chart a clear path to profitability.',
        faqs: [
            { q: 'What are fixed vs. variable costs?', a: 'Fixed costs are expenses that do not change regardless of the number of units sold (e.g., rent, salaries). Variable costs are expenses that change in direct proportion to the number of units sold (e.g., raw materials, direct labor).' },
            { q: 'How can I lower my break-even point?', a: 'You can lower your break-even point by either reducing your fixed costs (e.g., finding cheaper rent), reducing your variable costs per unit (e.g., finding a cheaper supplier), or increasing your selling price per unit.' },
            { q: 'What is a "Contribution Margin"?', a: 'The Contribution Margin is your Sale Price Per Unit minus your Variable Cost Per Unit. It\'s the amount of money from each sale that "contributes" to paying off your fixed costs. Once your fixed costs are covered, the contribution margin from each additional sale becomes pure profit.'},
            { q: 'Can I use this for a service business?', a: 'Yes. For a service business, a "unit" might be an hour of consulting, a project, or a monthly retainer. Your variable costs might include software used specifically for that client or contractor fees. The principle remains the same.'},
            { q: 'How often should I recalculate my break-even point?', a: 'It\'s a good practice to recalculate your break-even point whenever there is a significant change in your business, such as a rent increase, a change in supplier pricing, or when you are considering launching a new product or service.'}
        ],
        examples: [
            {
                title: 'Example 1: Coffee Shop',
                description: 'Calculating how many cups of coffee need to be sold per month to cover rent, salaries, and other fixed costs.',
                inputs: { fixedCosts: 100000, pricePerUnit: 150, variableCostPerUnit: 50 },
                result: 'You need to sell 1,000 units to break even.'
            },
            {
                title: 'Example 2: Software Subscription',
                description: 'Determining how many subscriptions are needed to cover server costs, marketing, and developer salaries.',
                inputs: { fixedCosts: 500000, pricePerUnit: 1000, variableCostPerUnit: 100 },
                result: 'You need to sell 556 subscriptions to break even.'
            }
        ]
    },
    'Profit Margin Calculator': {
        description: 'Quickly assess the financial health of your business or product with the Profit Margin Calculator. This tool computes two vital figures: Gross Profit and Gross Profit Margin. Gross Profit is the money left over after subtracting the Cost of Goods Sold (COGS) from your total revenue. The Gross Profit Margin turns this into a percentage, showing you how much profit you make for every dollar of revenue. This percentage is a universal indicator of efficiency and pricing power. A higher margin indicates that you are retaining a larger portion of each sale as profit. Use this calculator to compare the profitability of different products, track your performance over time, and make informed decisions about your pricing strategy and cost management.',
        faqs: [
            { q: 'What is the difference between Gross Profit and Profit Margin?', a: 'Gross Profit is the absolute monetary amount left over from revenue after subtracting the Cost of Goods Sold (e.g., $40). Profit Margin is that amount expressed as a percentage of revenue (e.g., 40%), which is useful for comparing profitability across different products or periods.' },
            { q: 'What is a good profit margin?', a: 'A "good" profit margin varies widely by industry. A retail business might have a margin of 20-30%, while a software company could have a margin of 80% or more. It\'s best to compare your margin to your industry\'s average.' },
            { q: 'What\'s the difference between Gross Margin and Net Margin?', a: 'Gross Margin only subtracts the direct Cost of Goods Sold (COGS). Net Margin is calculated after subtracting *all* business expenses, including operating costs like rent, salaries, and marketing. Gross margin measures production efficiency, while net margin measures overall business profitability.'},
            { q: 'How can I increase my profit margin?', a: 'There are two primary ways: 1) Increase your prices without losing too many customers. 2) Decrease your Cost of Goods Sold, for example by negotiating better prices with your suppliers or finding more efficient production methods.'},
            { q: 'Does this calculator work for services?', a: 'Yes. For a service-based business, the "Cost of Goods Sold" would be the direct costs associated with providing that service. For example, for a web design agency, COGS might include the salaries of the designers and the cost of software licenses used for client projects.'}
        ],
        examples: [
            {
                title: 'Example 1: Retail Product',
                description: 'Calculating the profit margin on a product sold in a retail store.',
                inputs: { revenue: 1000, cogs: 600 },
                result: 'The Gross Profit is ₹400.00, and the Profit Margin is 40%.'
            },
            {
                title: 'Example 2: Service-Based Project',
                description: 'Calculating the margin for a consulting project.',
                inputs: { revenue: 50000, cogs: 20000 },
                result: 'The Gross Profit is ₹30,000.00, and the Profit Margin is 60%.'
            }
        ]
    },
    'Discount Calculator': {
        description: 'A simple yet essential tool for savvy shoppers and retailers alike. This calculator makes it easy to figure out the final price of an item after a percentage-based discount. Simply enter the original price and the discount percentage to see the final price you\'ll pay. The calculator also clearly displays the exact amount of money you save, helping you instantly recognize the value of a deal. For retailers, this is a great tool for quickly calculating sale prices for promotions. For shoppers, it\'s your best friend during a sale, ensuring you know exactly what you\'re paying and saving before you head to the checkout counter. No more mental math or surprises—just clear, instant discount calculations.',
        faqs: [
            { q: 'How do I calculate a discount?', a: 'To calculate a discount, you convert the percentage to a decimal (e.g., 20% = 0.20) and multiply it by the original price. This gives you the saved amount. Subtract the saved amount from the original price to get the final price.' },
            { q: 'How do I calculate a price before a discount was applied?', a: 'To find the original price, you can use our GST/Tax calculator in "remove" mode. For example, if you paid $80 after a 20% discount, you can input 80 as the Final Amount and 20 as the Tax Rate to find the original price.'},
            { q: 'How do I calculate multiple discounts, like an extra 10% off an already 20% off item?', a: 'You cannot simply add the percentages (20% + 10% is not 30% off). You must apply them sequentially. First, calculate the price after the 20% discount. Then, use that new price as the "Original Price" and apply the 10% discount to it.'},
            { q: 'Can I use this for a discount in dollars instead of percent?', a: 'This calculator is designed for percentage-based discounts. For a fixed dollar amount discount (e.g., "$5 off"), you can simply use our Standard Calculator to subtract the discount amount from the original price.'},
            { q: 'Is the saved amount the same as profit?', a: 'No, not for a business. The "saved amount" is the discount given to the customer. The business\'s profit is the final price minus the cost of the item. Giving a discount reduces the business\'s profit on that item.'}
        ],
        examples: [
            {
                title: 'Example 1: Store Sale',
                description: 'Calculating the final price of a shirt during a 25% off sale.',
                inputs: { originalPrice: 1200, discount: 25 },
                result: 'Final price is ₹900.00, you save ₹300.00.'
            },
            {
                title: 'Example 2: Coupon on Electronics',
                description: 'Applying a 15% coupon to a new pair of headphones.',
                inputs: { originalPrice: 3500, discount: 15 },
                result: 'Final price is ₹2,975.00, you save ₹525.00.'
            }
        ]
    },
    'AOV Calculator': {
        description: 'Measure a critical e-commerce metric with our Average Order Value (AOV) Calculator. AOV represents the average dollar amount a customer spends every time they place an order on your website or in your store. To calculate it, simply input your total revenue over a specific period and the total number of orders from that same period. Tracking your AOV is crucial because increasing it is one of the most effective ways to boost revenue without the additional marketing cost of acquiring new customers. A rising AOV indicates that your customers are buying more expensive items or more items per transaction. Use this metric to gauge the effectiveness of your pricing strategies, product bundling, and upselling techniques.',
        faqs: [
            { q: 'Why is AOV important?', a: 'Increasing your AOV is one of the most effective ways to grow your revenue without needing more customers. A higher AOV means you are maximizing the value of each customer you acquire.' },
            { q: 'How can I increase my AOV?', a: 'Common strategies include offering free shipping over a certain threshold, bundling products together for a slight discount, and suggesting relevant add-ons or upsells during the checkout process.' },
            { q: 'What time period should I use for calculating AOV?', a: 'You can calculate it for any period, but common choices are monthly, quarterly, or yearly. Calculating it monthly helps you track trends and see the impact of recent marketing campaigns. Calculating it quarterly or yearly gives you a more stable, long-term view.'},
            { q: 'Is AOV the same as Customer Lifetime Value (CLV)?', a: 'No. AOV measures the value of a single transaction. CLV measures the total value a customer brings to your business over their entire relationship with you, which includes multiple transactions. AOV is a component used in calculating CLV.'},
            { q: 'Does a low AOV mean my business is failing?', a: 'Not necessarily. Businesses that sell low-cost, high-volume items will naturally have a lower AOV than businesses that sell high-ticket items. The key is to track your AOV over time. An increasing AOV is a sign of a healthy business, regardless of the absolute number.'}
        ],
        examples: [
            {
                title: 'Example 1: Monthly E-commerce Sales',
                description: 'Calculating the AOV for a small online store based on last month\'s performance.',
                inputs: { revenue: 150000, orders: 300 },
                result: 'The Average Order Value is ₹500.00.'
            },
            {
                title: 'Example 2: Black Friday Sale Event',
                description: 'Analyzing the AOV for a specific high-traffic sales event to see if promotions were effective.',
                inputs: { revenue: 500000, orders: 800 },
                result: 'The Average Order Value is ₹625.00.'
            }
        ]
    },
    'Standard Calculator': {
        description: "Your reliable and straightforward tool for all everyday calculations. This Standard Calculator provides a clean and familiar interface for performing basic arithmetic operations: addition, subtraction, multiplication, and division. It's designed for quick, on-the-go calculations where you don't need complex scientific functions. The display shows your current number, while the sub-display keeps track of the operation in progress, making it easy to follow along. It also includes handy functions for calculating percentages and inverting the sign of a number. Whether you're splitting a bill, figuring out a tip, or doing some quick budgeting, this calculator is the perfect digital companion for your daily mathematical needs.",
        faqs: [
            { q: 'How does the percentage button (%) work?', a: 'The percentage button works in context. For example, `100 + 10%` will calculate 10% of 100 (which is 10) and add it to 100, giving 110. `100 * 10%` will calculate 10% of 100, which is 10.' },
            { q: 'What is the order of operations?', a: 'This standard calculator processes operations sequentially as they are entered (e.g., `2 + 3 * 4` will be calculated as `5 * 4 = 20`). For strict mathematical order (PEMDAS/BODMAS), use the Scientific Calculator.' },
            { q: 'What does the "+/-" button do?', a: 'The plus/minus button toggles the sign of the number currently on the display. If you have "50", pressing it will change it to "-50", and pressing it again will change it back to "50".'},
            { q: 'How do I clear the entire calculation?', a: 'The "C" button clears the current entry. If you have a calculation in progress (e.g., "50 + "), pressing "C" will clear the second number you started typing. A second press will clear the whole operation.'},
            { q: 'Can I use this calculator offline?', a: 'Yes! Like all the calculators on our platform, the Standard Calculator is designed to work perfectly even without an internet connection, making it reliable wherever you are.'}
        ],
        examples: [
            {
                title: 'Example 1: Simple Addition',
                description: 'Adding two numbers together.',
                inputs: { Operation: '125 + 75' },
                result: '200'
            },
            {
                title: 'Example 2: Calculating a Tip',
                description: 'Calculating a 15% tip on a bill of ₹1500.',
                inputs: { Operation: '1500 + 15 %' },
                result: '1725'
            }
        ]
    },
    'Scientific Calculator': {
        description: "Tackle advanced mathematical problems with ease using our full-featured Scientific Calculator. This tool extends beyond basic arithmetic to include a wide range of functions essential for students and professionals in science, engineering, and mathematics. It provides trigonometric functions (sine, cosine, tangent) that can operate in both degrees and radians. You can perform logarithmic calculations (common log and natural log), calculate powers and square roots, and utilize mathematical constants like Pi (π) and Euler's number (e). The layout is designed to be intuitive, giving you access to powerful functions without a cluttered interface. Whether you're solving complex equations for school or work, this calculator provides the functionality you need for precise and reliable results.",
        faqs: [
            { q: 'How do I use the y^x button?', a: 'The y^x button is for calculating exponents. To calculate 5 to the power of 3 (5³), you would enter `5`, press `y^x`, enter `3`, and then press `=`. The result is 125.' },
            { q: 'What is "Deg/Rad" mode?', a: 'This switch changes the unit for trigonometric calculations. "Deg" stands for degrees (where a circle has 360°). "Rad" stands for radians (where a circle has 2π radians). Ensure you are in the correct mode for your problem.' },
            { q: 'What is the difference between log and ln?', a: '"log" calculates the base-10 logarithm, which answers the question "10 to what power gives this number?". "ln" calculates the natural logarithm (base e), which is crucial in calculus and financial calculations.'},
            { q: 'Does this calculator follow the order of operations (PEMDAS/BODMAS)?', a: 'This calculator processes operations as they are entered, similar to a standard calculator. For complex expressions requiring a strict order of operations, you should calculate parts in parentheses first and work through them step by step.'},
            { q: 'What are the constants "π" and "e"?', a: 'Pi (π) is approximately 3.14159 and is the ratio of a circle\'s circumference to its diameter. Euler\'s number (e) is approximately 2.71828 and is the base of the natural logarithm, frequently appearing in formulas related to growth and decay.'}
        ],
        examples: [
            {
                title: 'Example 1: Trigonometry',
                description: 'Finding the sine of a 30-degree angle.',
                inputs: { Operation: '30, then press sin (in Deg mode)' },
                result: '0.5'
            },
            {
                title: 'Example 2: Exponents',
                description: 'Calculating 2 to the power of 10.',
                inputs: { Operation: '2, press y^x, 10, then =' },
                result: '1024'
            }
        ]
    },
     'Loan Calculator': {
        description: 'Take control of your financial planning with our comprehensive Loan Calculator. This tool is designed to help you understand the full scope of a loan by calculating your Equated Monthly Installment (EMI). Simply input the total loan amount, the annual interest rate, and the loan term in years. The calculator will instantly provide you with your fixed monthly payment. More importantly, it breaks down the total cost of the loan, showing you the total principal you will repay versus the total interest you will pay over the entire term. This visibility is key to understanding the true cost of borrowing. The calculator also includes an amortization schedule, giving you a month-by-month breakdown of how each payment contributes to reducing your principal and covering interest.',
        faqs: [
            { q: 'What is EMI?', a: 'EMI stands for Equated Monthly Installment. It is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.' },
            { q: 'How is loan interest calculated?', a: 'Most loans use a reducing balance method. The interest is calculated on the outstanding loan amount for the month. As you pay your EMIs, the principal amount reduces, and so does the interest charged on it in subsequent months.' },
            { q: 'Why is the total payment so much higher than the loan amount?', a: 'The difference between the total payment and the loan amount is the total interest paid. Over a long loan term (like 15-30 years for a home loan), the interest can add up to be a significant amount, sometimes even more than the original loan principal.'},
            { q: 'What is an amortization schedule?', a: 'An amortization schedule is a table that details each periodic payment on a loan. It shows how much of each payment is applied to interest and how much is applied to the principal. In the beginning of the loan, a larger portion of your EMI goes towards interest.'},
            { q: 'How can I reduce the total interest I pay?', a: 'There are two main ways: 1) Choose a shorter loan term. A 15-year loan will have higher EMIs than a 30-year loan, but you will pay significantly less in total interest. 2) Make prepayments. Paying extra towards your principal whenever possible reduces the loan balance, which in turn reduces the total interest you pay over time.'}
        ],
        examples: [
            {
                title: 'Example 1: Personal Loan',
                description: 'Calculating the monthly EMI for a standard personal loan.',
                inputs: { principal: 500000, interestRate: 11, loanTerm: 5 },
                result: 'The monthly payment (EMI) is ₹10,871.19.'
            },
            {
                title: 'Example 2: Car Loan',
                description: 'Finding out the EMI and total interest for a car loan over a 7-year period.',
                inputs: { principal: 800000, interestRate: 9, loanTerm: 7 },
                result: 'The monthly payment (EMI) is ₹12,852.71.'
            }
        ]
    },
    'SIP Calculator': {
        description: 'Visualize your path to wealth creation with the Systematic Investment Plan (SIP) Calculator. This powerful tool helps you project the future value of your investments in mutual funds or other assets through regular, disciplined contributions. Enter the amount you plan to invest monthly, your expected annual rate of return, and the number of years you intend to stay invested. The calculator will then show you a detailed projection, including your total invested amount, the estimated returns you could earn, and the final maturity value. This demonstrates the incredible power of compounding over the long term. Additionally, our AI-powered "Plan a Goal" feature lets you work backward: input your financial target, and the AI will calculate the monthly SIP required to reach your goal, turning your dreams into an actionable plan.',
        faqs: [
            { q: 'What is a SIP?', a: 'A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you invest a fixed amount of money at regular intervals (e.g., monthly). It helps in disciplined investing and benefits from rupee cost averaging and the power of compounding.' },
            { q: 'Are the returns guaranteed?', a: 'No, mutual fund returns are subject to market risks. The calculator shows a projection based on the expected rate of return you enter. Actual returns can be higher or lower depending on market performance.' },
            { q: 'What is Rupee Cost Averaging?', a: 'When you invest a fixed amount every month, you automatically buy more units when the market price is low and fewer units when the price is high. Over time, this averages out your purchase cost and can reduce the impact of market volatility.'},
            { q: 'What is a realistic "Expected Return Rate" to use?', a: 'For long-term investments in equity mutual funds, a common historical average is around 10-14% per annum. However, this is not a guarantee. It\'s wise to be conservative with your estimate, for example, using 10% or 12% for planning.'},
            { q: 'How does the "Plan a Goal" feature work?', a: 'Our AI-powered goal planner uses the principles of future value calculations in reverse. You provide the future amount you want (your goal), the time you have, and your expected return rate. The AI then calculates the required monthly investment (the present value annuity) needed to reach that specific future value.'}
        ],
        examples: [
            {
                title: 'Example 1: Long-Term Wealth Creation',
                description: 'Projecting the outcome of a long-term SIP for retirement planning.',
                inputs: { monthlyInvestment: 10000, returnRate: 12, timePeriod: 25 },
                result: 'The final maturity value is approx. ₹1,89,76,269.'
            },
            {
                title: 'Example 2: Goal Planning with AI',
                description: 'Using the AI feature to find out the monthly SIP needed to reach a goal of ₹50 Lakhs.',
                inputs: { targetAmount: 5000000, returnRate: 12, timePeriod: 15 },
                result: 'The AI will calculate the required monthly SIP (approx. ₹9,992).'
            }
        ]
    },
    'BMI Calculator': {
        description: "The Body Mass Index (BMI) calculator is a widely used tool to gauge whether your weight is in a healthy range for your height. It's a simple, indirect measure of body fat. By entering your weight and height in either metric (kilograms and centimeters) or imperial (pounds and inches) units, the calculator computes a single number. This number falls into one of four categories: Underweight, Normal weight, Overweight, or Obesity. While it's a great starting point for assessing your weight status, it's important to remember that BMI is a general indicator. It doesn't differentiate between fat and muscle mass, which means very muscular individuals (like athletes) might have a high BMI without having excess body fat. Always consider BMI as one piece of a larger health puzzle and consult with a healthcare professional for a comprehensive assessment.",
        faqs: [
            { q: 'What do the BMI categories mean?', a: 'The standard BMI categories are: Below 18.5 (Underweight), 18.5-24.9 (Normal weight), 25.0-29.9 (Overweight), and 30.0 or higher (Obesity). These ranges help identify potential weight-related health risks.' },
            { q: 'Is BMI accurate for everyone?', a: 'BMI can be less accurate for certain groups like athletes (who have high muscle mass), pregnant women, the elderly, and children. It\'s best to consult a healthcare professional for a complete health evaluation.' },
            { q: 'What is the formula for BMI?', a: 'For metric units, the formula is: BMI = weight (kg) / [height (m)]². For imperial units, it is: BMI = (weight (lbs) / [height (in)]²) * 703.' },
            { q: 'What are the health risks associated with a high BMI?', a: 'A high BMI is associated with an increased risk for several health conditions, including type 2 diabetes, heart disease, high blood pressure, and certain types of cancer. Maintaining a healthy weight can help mitigate these risks.' },
            { q: 'If my BMI is high, what should I do?', a: 'If your BMI falls into the overweight or obesity category, it\'s a good idea to speak with a doctor or a registered dietitian. They can provide personalized advice on healthy eating, exercise, and lifestyle changes to help you reach a healthier weight.' }
        ],
        examples: [
            {
                title: 'Example 1: Metric Units',
                description: 'Calculating BMI for a person with a weight of 75 kg and height of 180 cm.',
                inputs: { unit: 'metric', weight: 75, height: 180 },
                result: 'BMI is 23.1 (Normal weight).'
            },
            {
                title: 'Example 2: Imperial Units',
                description: 'Calculating BMI for a person with a weight of 150 lbs and height of 65 inches.',
                inputs: { unit: 'imperial', weight: 150, height: 65 },
                result: 'BMI is 24.96 (Normal weight).'
            }
        ]
    },
    'Age Calculator': {
        description: "Ever wondered your exact age, down to the very second? Our Age Calculator provides a fun and precise way to measure your age based on your date of birth. It doesn't just stop at years; it breaks down your age into years, months, days, hours, minutes, and even live-ticking seconds. This tool is perfect for celebrating milestones, satisfying curiosity, or calculating the exact duration between two dates. Beyond the simple calculation, it also tells you how many days are remaining until your next birthday, helping you count down to your special day. To make things even easier, you can save important dates like birthdays and anniversaries of friends and family. This allows you to select a saved person and instantly see their age without having to re-enter their birth date every time.",
        faqs: [
            { q: 'How does the calculator handle leap years?', a: 'The calculator accurately accounts for leap years by calculating the difference between the two full dates, which inherently includes the extra day in leap years when it falls within the period.' },
            { q: 'Can I use this for things other than birthdays?', a: 'Yes! You can use it to calculate the duration between any two dates. For example, find out exactly how long you\'ve been working at your job or how long it has been since a major life event.' },
            { q: 'Is my saved data private?', a: 'Absolutely. All the dates you save are stored locally in your browser\'s storage. They are not sent to any server, ensuring your data remains private and accessible only to you on your device.' },
            { q: 'Why does the age update every second?', a: 'The live-ticking clock for hours, minutes, and seconds is a feature designed to give you a dynamic and precise representation of your age at this very moment. It emphasizes that age is a continuous measure of time.' },
            { q: 'How accurate is the "next birthday" countdown?', a: 'The countdown is very accurate. It calculates the number of full days between today and the date of your next birthday, so you know exactly how many more sleeps until you can celebrate!' }
        ],
        examples: [
            {
                title: 'Example 1: Calculate Your Age',
                description: 'Finding the precise age for someone born on January 15, 1990.',
                inputs: { birthDate: '1990-01-15' },
                result: 'The calculator will display the live-updating age in years, months, days, and more.'
            },
            {
                title: 'Example 2: Countdown to an Event',
                description: 'Finding the time elapsed since a historical event, like the moon landing.',
                inputs: { birthDate: '1969-07-20' },
                result: 'The calculator will show the total duration that has passed since that date.'
            }
        ]
    },
    'FD/RD Calculator': {
        description: "Plan your secure investments with our dual-function Fixed Deposit (FD) and Recurring Deposit (RD) calculator. FDs involve a one-time lump sum investment for a fixed period, while RDs involve regular monthly investments. This tool helps you project the maturity value for both scenarios. For an FD, enter your total investment, interest rate, tenure, and how often the interest compounds. For an RD, enter your monthly investment amount. The calculator shows you the total principal invested, the interest earned, and the final maturity amount, illustrating how your savings can grow in a low-risk environment.",
        faqs: [
            { q: "What's the difference between an FD and an RD?", a: "A Fixed Deposit (FD) is a one-time lump sum investment for a fixed period. A Recurring Deposit (RD) involves making fixed monthly investments for a predetermined period. FDs are for people who have a lump sum, while RDs are for those who want to save systematically each month." },
            { q: "What does 'Compounding Frequency' mean for an FD?", a: "This is how often the earned interest is added back to your principal amount. More frequent compounding (e.g., quarterly vs. annually) leads to slightly higher returns because you start earning interest on your interest sooner." },
            { q: "Is the interest from FDs and RDs taxable?", a: "Yes, in most jurisdictions, the interest earned from both Fixed Deposits and Recurring Deposits is considered as income and is taxable according to your income tax slab." },
            { q: "Which is better, FD or RD?", a: "It depends on your financial situation. If you have a lump sum of money you won't need for a while, an FD is a great choice. If you want to build a savings habit by investing a smaller amount each month from your salary, an RD is ideal." },
            { q: "Can I break my FD or RD before the tenure ends?", a: "Yes, most banks allow premature withdrawal of FDs and RDs, but they usually charge a penalty for it. The penalty is typically a reduction in the applicable interest rate (e.g., 0.5% or 1% lower than the agreed rate)." }
        ],
        examples: [
            {
                title: 'Example 1: Fixed Deposit',
                description: 'Calculating the maturity value of a lump sum FD invested for 5 years with quarterly compounding.',
                inputs: { depositType: 'FD', investment: '100000', rate: '7', tenure: '5' },
                result: 'Maturity Value will be approx. ₹1,41,477.88.'
            },
            {
                title: 'Example 2: Recurring Deposit',
                description: 'Projecting the future value of a monthly RD investment over 10 years.',
                inputs: { depositType: 'RD', investment: '2000', rate: '7.5', tenure: '10' },
                result: 'Maturity Value will be approx. ₹3,56,826.97.'
            }
        ]
    },
     'Mutual Fund Returns Calculator': {
        description: "Project the potential growth of your mutual fund investments with our versatile calculator. This tool caters to two primary investment strategies: a one-time Lump Sum investment or a disciplined monthly Systematic Investment Plan (SIP). Simply choose your investment type, enter the amount, the expected annual rate of return, and your investment period. The calculator will estimate the future value of your investment, clearly breaking down the total amount you invested versus the potential returns you could earn. This is a perfect tool for financial planning, helping you visualize how different investment amounts and time horizons can impact your journey towards achieving your financial goals.",
        faqs: [
            { q: "What is the difference between SIP and Lump Sum?", a: "A Lump Sum investment is when you invest a large amount of money at once. A Systematic Investment Plan (SIP) involves investing a smaller, fixed amount at regular intervals (usually monthly). SIPs are great for disciplined saving, while lump sums are suitable if you have a large amount of cash on hand." },
            { q: "Is the 'Expected Return Rate' guaranteed?", a: "No. Mutual funds are linked to the market, and their returns are not guaranteed. The expected return is an estimate based on historical performance or your own expectations. Actual returns may be higher or lower." },
            { q: "What is a good expected return rate for mutual funds?", a: "For equity mutual funds, a long-term historical average is often cited in the range of 10-14% per annum. For debt funds, it's typically lower, around 6-8%. It's always wise to be conservative in your planning." },
            { q: "Which is better for me, SIP or Lump Sum?", a: "For most people, especially salaried individuals, SIPs are the recommended method. They encourage discipline and benefit from rupee cost averaging. A lump sum investment can be beneficial if you have a windfall and believe the market is at a reasonable valuation." },
            { q: "How does this differ from the SIP Calculator?", a: "This calculator provides a streamlined view for both SIP and Lump Sum mutual fund investments. The dedicated SIP Calculator offers additional features like an AI-powered goal planning tool." }
        ],
        examples: [
            {
                title: 'Example 1: SIP Investment',
                description: 'Calculating the future value of a monthly SIP of ₹5,000 over 15 years.',
                inputs: { investmentType: 'SIP', amount: '5000', rate: '12', tenure: '15' },
                result: 'The estimated future value is approx. ₹25,22,868.'
            },
            {
                title: 'Example 2: Lump Sum Investment',
                description: 'Calculating the future value of a one-time lump sum investment of ₹2,00,000 over 10 years.',
                inputs: { investmentType: 'LumpSum', amount: '200000', rate: '12', tenure: '10' },
                result: 'The estimated future value is approx. ₹6,21,170.'
            }
        ]
    },
    // Add all other calculators here
    'Compound Interest Calculator': {
        description: "Harness the power of compounding with this calculator. It shows how your initial investment (principal) can grow over time as you earn interest not only on the principal but also on the accumulated interest. Input your principal, interest rate, time period, and how frequently the interest is compounded to see the final amount and total interest earned.",
        faqs: [
            { q: "What is compound interest?", a: "It's 'interest on interest'. The interest you earn is added to the principal, and future interest calculations are based on this new, larger amount, leading to exponential growth over time." },
            { q: "How does compounding frequency affect my returns?", a: "The more frequently interest is compounded (e.g., monthly vs. annually), the faster your investment grows. This is because interest starts earning its own interest sooner." },
            { q: "Is compound interest only for investments?", a: "No, it also works on debt. Credit card debt, for example, often compounds daily, which is why balances can grow so quickly if not paid off." },
            { q: "What's the 'Rule of 72'?", a: "It's a quick way to estimate how long it will take for an investment to double. Divide 72 by your annual interest rate. For example, at an 8% interest rate, your money will double in approximately 9 years (72 / 8 = 9)." },
            { q: "Can I use this for my savings account?", a: "Yes, you can use it to project the growth of your savings account. Just find out your bank's interest rate and compounding frequency (usually quarterly or semi-annually)." }
        ],
        examples: [
            {
                title: "Example 1: Long-Term Investment",
                description: "Calculating the growth of ₹50,000 invested for 20 years at 8% interest, compounded annually.",
                inputs: { principal: '50000', rate: '8', time: '20', frequency: '1' },
                result: "The final amount will be approx. ₹2,33,047.82."
            },
            {
                title: "Example 2: More Frequent Compounding",
                description: "The same investment as above, but with monthly compounding to see the difference.",
                inputs: { principal: '50000', rate: '8', time: '20', frequency: '12' },
                result: "The final amount will be approx. ₹2,46,645.10, showing the benefit of more frequent compounding."
            }
        ]
    },
    'Credit Card Interest Calculator': {
        description: "Understand the true cost of your credit card debt and create a plan to pay it off. This calculator shows you how long it will take to become debt-free based on your outstanding balance, Annual Percentage Rate (APR), and your planned monthly payment. It also calculates the total amount of interest you'll pay over that period, often revealing a surprisingly high number. Use this tool to see how increasing your monthly payment can drastically reduce both your payoff time and the total interest paid.",
        faqs: [
            { q: "What is APR?", a: "APR, or Annual Percentage Rate, is the yearly interest rate you're charged on your credit card balance. The calculator divides this by 12 to get the monthly interest rate used for calculations." },
            { q: "Why is my debt not decreasing if I make minimum payments?", a: "Minimum payments are often set very low, sometimes just enough to cover the monthly interest and a tiny bit of the principal. If your payment is too low, your balance can remain stagnant or even grow, as shown by the calculator's error message." },
            { q: "How can I pay off my credit card debt faster?", a: "The most effective way is to pay more than the minimum payment each month. Even a small extra amount can make a big difference over time. Try increasing the 'Monthly Payment' in the calculator to see the impact." },
            { q: "Does this calculator account for new purchases?", a: "No, this calculator assumes you are not making any new purchases on the card while you are paying it off. It calculates the payoff schedule for your *current* outstanding balance." },
            { q: "What's a good strategy for multiple credit cards?", a: "Two popular methods are the 'Avalanche' method (paying off the card with the highest APR first to save the most on interest) and the 'Snowball' method (paying off the card with the smallest balance first for a quick psychological win)." }
        ],
        examples: [
            {
                title: "Example 1: Standard Payoff",
                description: "Calculating the payoff time and total interest for a typical credit card balance.",
                inputs: { balance: '50000', apr: '24', monthlyPayment: '2000' },
                result: "It will take approx. 32 months to pay off, with ₹13,443.91 in total interest."
            },
            {
                title: "Example 2: Increased Payment",
                description: "Seeing the impact of increasing the monthly payment by just ₹1000.",
                inputs: { balance: '50000', apr: '24', monthlyPayment: '3000' },
                result: "It will now take only 19 months, and the total interest drops to ₹7,570.83."
            }
        ]
    },
    'Home Loan EMI & Affordability': {
        description: "Make one of the biggest financial decisions of your life with confidence. This calculator not only computes your Equated Monthly Installment (EMI) for a home loan but also includes an optional affordability check. Enter your loan amount, interest rate, and tenure to find your monthly payment, total interest, and total payout. Then, enter your monthly income and other existing EMIs to see if the new home loan fits within a healthy financial range (typically, total EMIs should be less than 50% of your income). This dual functionality helps you plan your dream home purchase responsibly.",
        faqs: [
            { q: "What is EMI?", a: "Equated Monthly Installment is the fixed amount you pay to the bank each month to repay your loan. It consists of both a principal and an interest component." },
            { q: "What is the 50% rule for affordability?", a: "Most lenders and financial advisors recommend that your total monthly debt payments (including your proposed home loan and any other existing loans) should not exceed 50% of your net monthly income. This ensures you have enough money left for other living expenses and savings." },
            { q: "How can a longer tenure help?", a: "A longer loan tenure (e.g., 30 years vs. 20 years) will result in a lower monthly EMI, which can make a loan more affordable on a month-to-month basis. However, you will end up paying significantly more in total interest over the life of the loan." },
            { q: "Should I include my partner's income?", a: "If you are applying for the loan jointly with your partner, you should combine your net monthly incomes to get a true picture of your household's affordability." },
            { q: "What other costs are involved in buying a home?", a: "This calculator covers the loan itself. Remember to also budget for a down payment (typically 10-20% of the property value), stamp duty, registration charges, property taxes, and ongoing maintenance costs." }
        ],
        examples: [
            {
                title: "Example 1: Calculating EMI",
                description: "Finding the monthly EMI for a ₹40 lakh loan for 25 years.",
                inputs: { amount: '4000000', rate: '8.5', tenure: '25' },
                result: "The monthly EMI is approx. ₹32,273."
            },
            {
                title: "Example 2: Affordability Check",
                description: "Checking if the above loan is affordable for someone with a monthly income of ₹80,000 and no other loans.",
                inputs: { amount: '4000000', rate: '8.5', tenure: '25', income: '80000', otherEmi: '0' },
                result: "The loan is considered affordable, as the EMI is well below 50% of the income."
            }
        ]
    },
     'GST/Tax Calculator': {
        description: "Quickly calculate Goods and Services Tax (GST) or any other value-added tax with this easy-to-use tool. It works both ways: you can add tax to a pre-tax amount to find the final price, or you can remove tax from a final price to find the original amount and the tax component. This is perfect for small business owners creating invoices, freelancers calculating service fees, and shoppers who want to understand the price breakdown of a product. Just enter the amount, the tax rate, and choose whether to add or remove the tax.",
        faqs: [
            { q: "How do I add GST to a price?", a: "To add GST, the calculator multiplies the initial amount by the tax rate (as a decimal) to find the tax amount. It then adds this tax amount to the initial amount to get the final price." },
            { q: "How do I remove or back-calculate GST from a final price?", a: "To find the pre-tax amount from a price that already includes tax, the calculator uses the formula: Initial Amount = Final Amount / (1 + Tax Rate). For example, to remove 18% GST from ₹118, it calculates 118 / 1.18 = ₹100." },
            { q: "Can I use this for other taxes like VAT?", a: "Yes, absolutely. The mathematical principle is the same for any value-added tax (VAT), sales tax, or GST. Just enter the applicable tax rate." },
            { q: "What are common GST rates?", a: "GST rates vary by country and product/service type. Common slabs are often 5%, 12%, 18%, and 28%. Essential goods might be 0%, while luxury items have the highest rates." },
            { q: "How is the tax amount calculated in 'remove' mode?", a: "After calculating the initial (pre-tax) amount, the calculator simply subtracts this from the final (inclusive) amount to determine how much of the total price was tax." }
        ],
        examples: [
            {
                title: "Example 1: Adding GST",
                description: "Calculating the final price of a service costing ₹5,000 with 18% GST.",
                inputs: { amount: '5000', rate: '18', action: 'add' },
                result: "The final amount is ₹5,900 (Tax: ₹900)."
            },
            {
                title: "Example 2: Removing GST",
                description: "Finding the original price and tax component from a product that costs ₹1,680 inclusive of 12% GST.",
                inputs: { amount: '1680', rate: '12', action: 'remove' },
                result: "The initial amount is ₹1,500 (Tax: ₹180)."
            }
        ]
    },
     'Area Cost Estimator': {
        description: "Get a quick and reliable budget estimate for your next construction or renovation project. This calculator helps you determine the total cost based on the size of the area and the cost per unit of area. Simply enter the total area (in square feet or square meters) and the estimated cost per unit for materials and labor. The calculator instantly multiplies these values to give you a total estimated project cost. It's an essential first step for planning home construction, flooring installation, painting jobs, or any project where cost is directly tied to the area being worked on.",
        faqs: [
            { q: "How do I find the 'Cost per Unit'?", a: "This is the most critical input. You can get this figure by asking local contractors for a rough estimate, checking prices at hardware stores for materials (like tiles or paint), or looking up average construction costs for your region online." },
            { q: "What does the 'Cost per Unit' typically include?", a: "It should ideally include both the cost of materials and the cost of labor for one square foot or square meter. For example, for flooring, it would be the cost of the tile plus the installation fee per square foot." },
            { q: "Is this estimate final?", a: "No, this is a preliminary budget estimate. The final cost can be affected by factors like the quality of materials, complexity of the work, unforeseen repairs, and finishing touches. It's always a good idea to add a contingency fund (10-15%) to your estimate." },
            { q: "How do I convert between square feet and square meters?", a: "1 square meter is approximately equal to 10.764 square feet. You can use our Unit Converter for precise conversions." },
            { q: "Can I use this for non-construction projects?", a: "Yes, you can use it for anything where cost scales with area, such as buying carpet, sod for a lawn, or even estimating advertising costs for a billboard." }
        ],
        examples: [
            {
                title: "Example 1: Flooring Installation",
                description: "Estimating the cost to install new tiles in a 500 sq. ft. room where the tile and labor cost is ₹150 per sq. ft.",
                inputs: { area: '500', unit: 'sqft', costPerUnit: '150' },
                result: "The total estimated cost is ₹75,000."
            },
            {
                title: "Example 2: House Construction",
                description: "Getting a budget estimate for building a 150 sq. m. house where the average construction cost is ₹18,000 per sq. m.",
                inputs: { area: '150', unit: 'sqm', costPerUnit: '18000' },
                result: "The total estimated cost is ₹27,00,000."
            }
        ]
    },
    'Rent vs Buy Calculator': {
        description: "Tackle one of life's biggest financial questions with our Rent vs. Buy Calculator. This tool provides a purely financial comparison of the two options over a specific time frame. Input the details for buying a home, including the property price, your down payment, and loan terms. Then, input your current or expected monthly rent. Finally, set a comparison period (e.g., 5, 10, or 20 years). The calculator will project the total cash outflow for both scenarios over that period. The 'buy' cost includes your down payment plus all the EMIs paid during the period, while the 'rent' cost is the total rent paid. This helps you see which option is financially lighter over different time horizons.",
        faqs: [
            { q: "Does this calculator prove that buying is always better in the long run?", a: "Not necessarily. While buying often becomes cheaper over very long periods due to equity building, this calculator focuses on total cash spent. Renting can sometimes be cheaper if the rent is low and the property prices are very high, allowing you to invest the difference elsewhere." },
            { q: "What costs are *not* included in this calculator?", a: "This is a simplified model. It doesn't include property taxes, maintenance costs, or home insurance for buying. It also doesn't account for potential rent increases over time for renting. These are important factors to consider in your final decision." },
            { q: "What is a 'down payment'?", a: "A down payment is the initial, upfront portion of the total price of a property that you pay in cash. The remaining amount is typically financed through a home loan." },
            { q: "How do I choose a 'Comparison Period'?", a: "Choose a period that reflects how long you realistically plan to stay in one location. If you expect to move for work in 3-5 years, use that as your period. If you are settling down for the long term, use 10 years or more." },
            { q: "Can the result change based on the comparison period?", a: "Yes, dramatically. In the short term (e.g., 3 years), renting is almost always cheaper because of the huge down payment cost for buying. In the long term (e.g., 20 years), buying often becomes cheaper as your loan gets paid down." }
        ],
        examples: [
            {
                title: "Example 1: Short-Term Comparison",
                description: "Comparing the costs over a 5-year period.",
                inputs: { propertyPrice: '5000000', downPayment: '1000000', loanTerm: '20', interestRate: '8.5', monthlyRent: '15000', comparisonYears: '5' },
                result: "Renting is cheaper by approx. ₹2,67,118 over 5 years."
            },
            {
                title: "Example 2: Long-Term Comparison",
                description: "Comparing the costs for the same property over a 15-year period.",
                inputs: { propertyPrice: '5000000', downPayment: '1000000', loanTerm: '20', interestRate: '8.5', monthlyRent: '15000', comparisonYears: '15' },
                result: "Buying is cheaper by approx. ₹1,20,355 over 15 years."
            }
        ]
    },
    'Carpet Area vs Built-up Area': {
        description: "Navigate real estate listings like a pro by understanding the crucial difference between Carpet Area and Built-up Area. Carpet Area is the actual usable area within the walls of your apartment. Built-up Area includes the carpet area plus the thickness of the walls and other unusable spaces like balconies or terraces. This calculator helps you convert between the two. You can either input the Built-up Area to find the likely Carpet Area, or vice-versa. Just provide the area and an estimated percentage for non-carpet spaces (typically 15-25%) to get an accurate estimate of the livable space you're actually paying for.",
        faqs: [
            { q: "What is Carpet Area?", a: "Carpet Area is the net usable area of an apartment. It's the space where you could literally lay a carpet. It does not include the thickness of the inner walls." },
            { q: "What is Built-up Area?", a: "Built-up Area is the carpet area plus the area covered by the walls (both inner and outer) and other unusable areas like balconies, terraces, and utility areas." },
            { q: "What about Super Built-up Area?", a: "Super Built-up Area is the built-up area plus a proportion of the common areas like the lobby, staircase, elevator, etc. This calculator focuses on the more direct comparison between carpet and built-up areas." },
            { q: "Why is this calculation important?", a: "Real estate is often priced based on the Built-up or Super Built-up area, but you live in the Carpet Area. Understanding the difference helps you compare properties fairly and know exactly how much usable space you are getting for your money." },
            { q: "What is a typical percentage for non-carpet areas?", a: "The area occupied by walls, balconies, and shafts typically ranges from 15% to 25% of the built-up area. A lower percentage is more efficient and means you get more usable space." }
        ],
        examples: [
            {
                title: "Example 1: Find Carpet Area",
                description: "A builder lists a 1200 sq. ft. apartment (Built-up Area) and you estimate 20% is non-carpet area.",
                inputs: { mode: 'builtUpToCarpet', area: '1200', nonCarpetPercent: '20' },
                result: "The estimated Carpet Area is 960 sq. ft."
            },
            {
                title: "Example 2: Find Built-up Area",
                description: "You measure your apartment's usable Carpet Area to be 800 sq. ft. and want to find the likely Built-up Area.",
                inputs: { mode: 'carpetToBuiltUp', area: '800', nonCarpetPercent: '20' },
                result: "The estimated Built-up Area is 1000 sq. ft."
            }
        ]
    },
    'Percentage Calculator': {
        description: "Handle any percentage-based problem with this versatile three-in-one calculator. Whether you need to find a percentage of a number, determine what percentage one number is of another, or calculate the percentage change between two values, this tool has you covered. Simply select the calculation mode that matches your question, enter your values, and get an instant, accurate result. It's perfect for calculating discounts, figuring out tips, analyzing growth metrics, or solving homework problems. This single calculator eliminates the need to remember different formulas for various percentage calculations.",
        faqs: [
            { q: "How does the '% of' mode work?", a: "This mode answers questions like 'What is 20% of 500?'. It calculates this by converting the percentage to a decimal (20% -> 0.20) and multiplying it by the number (0.20 * 500 = 100)." },
            { q: "What is the 'X is what % of Y' mode for?", a: "This mode answers questions like '10 is what percent of 50?'. It calculates this using the formula (X / Y) * 100, so (10 / 50) * 100 = 20%." },
            { q: "How is 'Percentage Change' calculated?", a: "This mode calculates the increase or decrease from a starting value to an ending value. The formula is ((New Value - Old Value) / Old Value) * 100. A positive result is an increase, and a negative result is a decrease." },
            { q: "Can I use this for calculating tips?", a: "Yes! Use the '% of' mode. For a 15% tip on a ₹1000 bill, you would calculate '15% of 1000' to find the tip amount (₹150)." },
            { q: "How can I use this for business growth?", a: "The 'Percentage Change' mode is perfect for this. If your sales were ₹10,000 last month and ₹12,000 this month, you can calculate the percentage change from 10,000 to 12,000 to find your monthly growth rate (20%)." }
        ],
        examples: [
            {
                title: "Example 1: Finding a Percentage",
                description: "Calculating what 25% of 150 is.",
                inputs: { mode: 'percentOf', val1: '25', val2: '150' },
                result: "The result is 37.5."
            },
            {
                title: "Example 2: Percentage Change",
                description: "Calculating the percentage increase from 80 to 100.",
                inputs: { mode: 'percentChange', val1: '80', val2: '100' },
                result: "The result is a 25% increase."
            }
        ]
    },
    'Average Calculator': {
        description: "Effortlessly find the average (or arithmetic mean) of a set of numbers. Simply enter your numbers, separated by commas, into the text box. The calculator will instantly process the list to give you the average, as well as the sum of all the numbers and the total count of the numbers you entered. This tool is perfect for students calculating their grade average, analysts finding the average sales figure, or anyone needing to find the central tendency of a dataset. No need to add everything up and divide manually—let the calculator do the work for you.",
        faqs: [
            { q: "What is an average?", a: "The average, or mean, is a measure of the central value of a set of numbers. It is calculated by adding all the numbers in the set together and then dividing by the count of numbers in the set." },
            { q: "Can I use negative numbers?", a: "Yes, the calculator correctly handles both positive and negative numbers in the dataset." },
            { q: "Does spacing or extra commas matter?", a: "No, the calculator is designed to be flexible. It will ignore extra spaces around your numbers and can handle multiple commas between numbers without causing an error." },
            { q: "What's the difference between average, median, and mode?", a: "The average is the sum divided by the count. The median is the middle value when the numbers are sorted. The mode is the number that appears most frequently. We have a separate calculator for Median and Mode!" },
            { q: "What if I enter text instead of numbers?", a: "The calculator will simply ignore any non-numeric entries and calculate the average of the valid numbers you have provided." }
        ],
        examples: [
            {
                title: "Example 1: Student Grades",
                description: "Calculating the average score for a student who scored 85, 92, 78, and 95 on four tests.",
                inputs: { numbers: '85, 92, 78, 95' },
                result: "The average is 87.5."
            },
            {
                title: "Example 2: Daily Sales",
                description: "Finding the average daily sales from a week's worth of data.",
                inputs: { numbers: '1200, 1500, 1350, 1600, 1800, 2200, 2000' },
                result: "The average is 1664.29."
            }
        ]
    },
     'Median & Mode Calculator': {
        description: "Dive deeper into your data by calculating the Median and Mode. Unlike the average, which can be skewed by unusually high or low numbers, the median gives you the true middle value of your dataset. The mode tells you which number appears most frequently. To use the calculator, just enter a comma-separated list of numbers. The tool will automatically sort them and find both the median and the mode for you. This is essential for statisticians, data analysts, and anyone who wants a more nuanced understanding of their data beyond a simple average.",
        faqs: [
            { q: "What is the median?", a: "The median is the middle number in a sorted list of numbers. If there is an even number of entries, the median is the average of the two middle numbers." },
            { q: "What is the mode?", a: "The mode is the number that appears most often in a set of numbers. A dataset can have one mode, more than one mode, or no mode at all." },
            { q: "When would I use median instead of average?", a: "Median is particularly useful when your dataset has outliers (extremely high or low values). For example, when calculating the 'average' house price in an area, the median is often used because a few mansions could dramatically skew the average price upwards." },
            { q: "What does 'No mode' mean?", a: "If the calculator returns 'No mode', it means that every number in your dataset appears only once. There is no single number that is more frequent than any other." },
            { q: "Can a dataset have more than one mode?", a: "Yes. If two or more numbers are tied for the most frequent appearance, the dataset is multimodal. Our calculator will show all the numbers that qualify as the mode." }
        ],
        examples: [
            {
                title: "Example 1: Odd Number of Entries",
                description: "Finding the median and mode for a simple dataset.",
                inputs: { numbers: '2, 3, 4, 4, 5' },
                result: "Median: 4, Mode: 4."
            },
            {
                title: "Example 2: Even Number of Entries and Multiple Modes",
                description: "A more complex dataset with an even count and two modes.",
                inputs: { numbers: '10, 20, 20, 30, 40, 50, 50, 60' },
                result: "Median: 35, Mode: 20, 50."
            }
        ]
    },
    'Logarithm & Trigonometry': {
        description: "A powerful tool for students and professionals dealing with advanced mathematics. This calculator simplifies complex logarithmic and trigonometric functions. You can calculate the common logarithm (base 10) and the natural logarithm (base e) of any number. For trigonometry, you can find the sine, cosine, and tangent of an angle. A crucial feature is the ability to switch between Degrees and Radians, ensuring your trigonometric calculations are accurate for any context. Whether you're in a physics class, an engineering lab, or a finance lecture, this calculator provides the essential functions you need.",
        faqs: [
            { q: "What is a logarithm?", a: "A logarithm answers the question: 'What exponent do we need to raise a specific base to, to get this number?'. For example, the log (base 10) of 100 is 2, because 10² = 100." },
            { q: "What's the difference between 'log' and 'ln'?", a: "'log' typically refers to the common logarithm, which has a base of 10. 'ln' refers to the natural logarithm, which has a base of 'e' (Euler's number, approx. 2.718). Natural logarithms are fundamental in calculus, physics, and finance." },
            { q: "What are sine, cosine, and tangent?", a: "These are the three main functions in trigonometry, based on the ratios of the sides of a right-angled triangle. They are used to relate the angles of a triangle to the lengths of its sides." },
            { q: "Why is the Degrees/Radians switch important?", a: "Angles can be measured in degrees (360° in a circle) or radians (2π in a circle). Scientific and mathematical formulas often use radians, while everyday applications might use degrees. Using the wrong mode will give you a completely different and incorrect answer for trig functions." },
            { q: "Can I find the inverse functions like arcsin or antilog?", a: "This calculator focuses on the primary functions. For inverse trigonometric (arcsin, arccos, arctan) or inverse logarithmic (antilog) functions, our full Scientific Calculator is the right tool." }
        ],
        examples: [
            {
                title: "Example 1: Finding a Logarithm",
                description: "Calculating the common log (base 10) of 1000.",
                inputs: { value: '1000', operation: 'log' },
                result: "The result is 3."
            },
            {
                title: "Example 2: Trigonometry in Degrees",
                description: "Calculating the cosine of a 60-degree angle.",
                inputs: { value: '60', mode: 'Degrees', operation: 'cos' },
                result: "The result is 0.5."
            }
        ]
    },
     'Force & Acceleration': {
        description: "Solve problems based on Newton's Second Law of Motion (F=ma) with this physics calculator. This versatile tool allows you to calculate any one of the three variables—Force (in Newtons), Mass (in kilograms), or Acceleration (in meters per second squared)—by providing the other two. Simply select which variable you want to find, enter the known values, and get an instant result. It's an essential tool for physics students, engineers, and anyone working with the fundamental principles of mechanics.",
        faqs: [
            { q: "What is Newton's Second Law?", a: "Newton's Second Law of Motion states that the force acting on an object is equal to the mass of that object times its acceleration. The formula is F = m × a." },
            { q: "What units are used in this calculator?", a: "The calculator uses standard SI units: Newtons (N) for force, kilograms (kg) for mass, and meters per second squared (m/s²) for acceleration." },
            { q: "Can I calculate the weight of an object?", a: "Yes. Weight is a force. To find the weight of an object on Earth, use the 'Calculate Force' mode, enter the object's mass in kg, and use an acceleration of 9.8 m/s² (the acceleration due to gravity)." },
            { q: "What happens if I enter zero for mass or acceleration?", a: "The calculator will handle this gracefully. If you try to find mass or acceleration and the divisor is zero, it will return an error or 'N/A', as division by zero is undefined." },
            { q: "Does this account for friction or air resistance?", a: "No, this calculator performs ideal calculations based on the F=ma formula. In real-world scenarios, other forces like friction and air resistance would also need to be considered." }
        ],
        examples: [
            {
                title: "Example 1: Calculating Force",
                description: "Finding the force required to accelerate a 5 kg object at 10 m/s².",
                inputs: { calculate: 'force', mass: '5', acceleration: '10' },
                result: "The required force is 50 N."
            },
            {
                title: "Example 2: Calculating Acceleration",
                description: "Finding the acceleration of a 20 kg object when a 100 N force is applied.",
                inputs: { calculate: 'acceleration', force: '100', mass: '20' },
                result: "The acceleration is 5 m/s²."
            }
        ]
    },
     'Velocity & Distance': {
        description: "Solve basic motion problems with the Speed, Distance, and Time calculator. Based on the fundamental formula (Distance = Speed × Time), this tool lets you find any one of the three variables if you know the other two. Need to find your average speed? Enter the distance and time. Want to know how long a trip will take? Enter the distance and your expected speed. It's a straightforward tool for travel planning, physics homework, or any situation involving constant velocity.",
        faqs: [
            { q: "What units does this calculator use?", a: "The calculator uses a standard set of units for simplicity: speed in kilometers per hour (km/h), distance in kilometers (km), and time in hours." },
            { q: "What's the difference between speed and velocity?", a: "In physics, speed is a scalar quantity (how fast you're going), while velocity is a vector quantity (how fast you're going *and* in what direction). For this calculator, we are using the terms interchangeably to refer to the rate of motion." },
            { q: "Does this work for accelerating objects?", a: "No, this calculator assumes a constant or average speed over the entire duration. For problems involving changes in speed (acceleration), you would need to use our 'Force & Acceleration' calculator or more advanced kinematic equations." },
            { q: "How can I input time in minutes?", a: "You need to convert minutes to hours before entering them. To do this, divide the number of minutes by 60. For example, 30 minutes is 0.5 hours." },
            { q: "Can I use different units like miles?", a: "Currently, the calculator is set to kilometers and hours. To work with other units like miles, you would first need to convert your inputs to kilometers using our Unit Converter." }
        ],
        examples: [
            {
                title: "Example 1: Calculating Trip Time",
                description: "Finding out how long it will take to travel 300 km at an average speed of 60 km/h.",
                inputs: { calculate: 'time', distance: '300', speed: '60' },
                result: "The trip will take 5 hours."
            },
            {
                title: "Example 2: Calculating Required Speed",
                description: "Finding the average speed needed to cover 150 km in 2.5 hours.",
                inputs: { calculate: 'speed', distance: '150', time: '2.5' },
                result: "You need an average speed of 60 km/h."
            }
        ]
    },
    'All Shapes Area Calculator': {
        description: "A versatile geometry tool for calculating the area of the most common shapes. Whether you're a student, a DIY enthusiast, or a professional, this calculator has you covered. Select from a Circle, Square, Rectangle, or Triangle, and the calculator will provide the specific input fields needed for that shape. Enter the dimensions, and it will instantly compute the area using the correct formula. It's a quick and reliable way to find the area for homework problems, construction projects, or any practical application.",
        faqs: [
            { q: "What are the formulas used?", a: "The calculator uses standard geometry formulas: Circle (π × r²), Square (side²), Rectangle (length × width), and Triangle (0.5 × base × height)." },
            { q: "What is 'π' (Pi)?", a: "Pi (π) is a mathematical constant, approximately equal to 3.14159. It represents the ratio of a circle's circumference to its diameter and is fundamental in circle-related calculations." },
            { q: "Can I use different units for length and width?", a: "No, you must use the same unit for all dimensions within a single calculation (e.g., all in meters or all in inches). The result will be in the square of that unit (e.g., square meters)." },
            { q: "Does this work for the area of a right-angled triangle?", a: "Yes, the base × height formula works for all triangles, including right-angled triangles, where the two shorter sides can be used as the base and height." },
            { q: "How can I calculate the area of a more complex shape?", a: "For a complex or irregular shape, a common strategy is to break it down into simpler shapes (like rectangles and triangles), calculate the area of each part using this calculator, and then add them all together." }
        ],
        examples: [
            {
                title: "Example 1: Area of a Circle",
                description: "Finding the area of a circular garden with a radius of 5 meters.",
                inputs: { shape: 'Circle', radius: '5' },
                result: "The area is approx. 78.54 square meters."
            },
            {
                title: "Example 2: Area of a Triangle",
                description: "Calculating the area of a triangular sail with a base of 4 meters and a height of 6 meters.",
                inputs: { shape: 'Triangle', base: '4', height: '6' },
                result: "The area is 12 square meters."
            }
        ]
    },
    'All Shapes Volume Calculator': {
        description: "Calculate the volume of common three-dimensional shapes with this easy-to-use tool. Select from a Sphere, Cube, Cylinder, or Cone, and the calculator will prompt you for the necessary dimensions. Enter the values, and it will instantly compute the volume, which represents the total amount of space inside the 3D object. This calculator is perfect for students learning solid geometry, engineers in design, or anyone needing to calculate capacity for practical purposes.",
        faqs: [
            { q: "What are the formulas used for volume?", a: "The calculator uses standard formulas: Sphere (4/3 × π × r³), Cube (side³), Cylinder (π × r² × height), and Cone (1/3 × π × r² × height)." },
            { q: "What's the difference between area and volume?", a: "Area is a measure of a two-dimensional surface (like a floor) and is measured in square units (e.g., m²). Volume is a measure of the space occupied by a three-dimensional object (like a box) and is measured in cubic units (e.g., m³)." },
            { q: "Do I need to use the same units for all inputs?", a: "Yes, all dimensions (like radius and height) must be in the same unit. The final result for the volume will be in the cube of that unit (e.g., if you use centimeters, the result will be in cubic centimeters)." },
            { q: "How are the cylinder and cone formulas related?", a: "A cone's volume is exactly one-third of the volume of a cylinder that has the same base radius and height. This is a fundamental relationship in solid geometry." },
            { q: "How can I find the volume of a rectangular box (cuboid)?", a: "While not a listed shape, you can use the 'All Shapes Area Calculator' to find the area of the rectangular base (length × width) and then multiply that result by the height using the 'Standard Calculator'." }
        ],
        examples: [
            {
                title: "Example 1: Volume of a Cylinder",
                description: "Finding the volume of a water tank that is a cylinder with a radius of 2 meters and a height of 5 meters.",
                inputs: { shape: 'Cylinder', radius: '2', height: '5' },
                result: "The volume is approx. 62.83 cubic meters."
            },
            {
                title: "Example 2: Volume of a Cube",
                description: "Calculating the volume of a box that is a perfect cube with a side length of 10 centimeters.",
                inputs: { shape: 'Cube', side: '10' },
                result: "The volume is 1000 cubic centimeters."
            }
        ]
    },
     'Unit Converter': {
        description: "Seamlessly convert between different units of measurement with our comprehensive Unit Converter. Choose a category like Length, Mass, or Temperature, and then select the 'from' and 'to' units. Enter the value you want to convert, and the calculator provides the result instantly. This tool eliminates the need for manual conversion formulas and is perfect for students, travelers, scientists, and anyone who needs to work with different measurement systems. It supports a wide range of common metric and imperial units.",
        faqs: [
            { q: "How does the converter work for Length and Mass?", a: "For categories like Length and Mass, all units are converted to a standard base unit (like meters or grams) behind the scenes. Then, this base unit value is converted to the desired target unit. This ensures accuracy across all possible conversions." },
            { q: "Why is Temperature a special category?", a: "Temperature conversions (Celsius, Fahrenheit, Kelvin) don't use simple multiplication factors. They require specific formulas involving addition and subtraction (e.g., °F = °C × 9/5 + 32). Therefore, it's handled as a special case." },
            { q: "Can I convert complex units like meters per second to kilometers per hour?", a: "This converter is designed for single-unit conversions. For compound units, you would need to perform multiple conversions. For example, to convert m/s to km/h, you would first convert meters to kilometers and seconds to hours separately." },
            { q: "How accurate are the conversions?", a: "The conversions are based on standard, internationally accepted conversion factors, ensuring a high degree of accuracy for all calculations." },
            { q: "How do I use the swap button?", a: "The swap button instantly switches your 'From' and 'To' units, making it very fast to convert back and forth between two units without having to re-select them from the dropdown menus." }
        ],
        examples: [
            {
                title: "Example 1: Converting Miles to Kilometers",
                description: "Finding out how many kilometers are in 26.2 miles (the length of a marathon).",
                inputs: { category: 'Length', fromUnit: 'Mile', toUnit: 'Kilometer', inputValue: '26.2' },
                result: "The result is approx. 42.16 kilometers."
            },
            {
                title: "Example 2: Converting Fahrenheit to Celsius",
                description: "Converting a body temperature of 100.4°F to Celsius.",
                inputs: { category: 'Temperature', fromUnit: 'Fahrenheit', toUnit: 'Celsius', inputValue: '100.4' },
                result: "The result is 38°C."
            }
        ]
    },
     'Currency Converter': {
        description: "Get quick currency conversions with our simple converter. This tool allows you to easily convert an amount from one major currency to another. Select your 'from' and 'to' currencies, enter the amount, and see the converted result instantly. Please note that for demonstration purposes, this calculator uses static, non-live exchange rates. For real-time financial transactions, you should always consult a service that provides live market rates. This tool is perfect for quick estimates, travel planning, or educational purposes.",
        faqs: [
            { q: "Are the exchange rates live?", a: "No, the rates in this calculator are static and for illustrative purposes only. They are not updated in real-time and should not be used for actual financial transactions." },
            { q: "Where do currency exchange rates come from?", a: "Live exchange rates are determined by the global foreign exchange (forex) market, where currencies are traded 24/7. Rates fluctuate constantly based on supply, demand, economic stability, and many other factors." },
            { q: "Why would I need a currency converter?", a: "It's useful for many situations, such as planning a travel budget for a foreign country, understanding the price of an item sold in a different currency online, or for businesses that deal with international clients." },
            { q: "How does the conversion work?", a: "The calculator converts your input amount to a standard base currency (like USD) and then converts that base amount to your target currency using the stored exchange rates." },
            { q: "Can I find historical exchange rates?", a: "This tool does not provide historical data. For historical rates, you would typically need to consult a financial data provider or the website of a central bank." }
        ],
        examples: [
            {
                title: "Example 1: USD to INR",
                description: "Converting $150 USD to Indian Rupees (INR) for travel planning.",
                inputs: { fromCurrency: 'USD', toCurrency: 'INR', amount: '150' },
                result: "The result is approx. ₹12,495."
            },
            {
                title: "Example 2: EUR to GBP",
                description: "Converting €50 EUR to British Pounds (GBP) for an online purchase.",
                inputs: { fromCurrency: 'EUR', toCurrency: 'GBP', amount: '50' },
                result: "The result is approx. £42.93."
            }
        ]
    },
    'Fuel Cost Calculator': {
        description: "Plan your travel budget with precision using the Fuel Cost Calculator. This tool helps you estimate the total cost of fuel for a trip. Simply enter the trip distance, your vehicle's average mileage (in kilometers per litre), and the current price of fuel per litre. The calculator will determine the total amount of fuel needed for the journey and multiply it by the price to give you the total estimated fuel cost. It's an indispensable tool for road trips, daily commutes, or any travel where you need to manage your expenses.",
        faqs: [
            { q: "How can I find my vehicle's mileage?", a: "You can find your car's official mileage in the owner's manual. For a more accurate real-world figure, you can calculate it yourself: fill your tank, reset your trip meter, drive until your tank is nearly empty, then refill it. Divide the kilometers driven by the number of litres it took to refill the tank." },
            { q: "Does this calculator account for traffic or driving style?", a: "No, the calculation is based on the average mileage you provide. Aggressive driving, heavy traffic, and using the air conditioner can all reduce your actual mileage and increase your fuel cost." },
            { q: "Can I use miles and gallons?", a: "This calculator is standardized to kilometers and litres. You can use our Unit Converter to convert miles to kilometers and gallons to litres before using this tool." },
            { q: "How is the total fuel calculated?", a: "The calculator uses a simple formula: Total Fuel Needed = Total Trip Distance / Vehicle Mileage. For example, a 400 km trip with a 10 km/L mileage will require 40 litres of fuel." },
            { q: "Is this useful for electric vehicles (EVs)?", a: "This tool is designed for gasoline or diesel vehicles. For an EV, you would need to calculate the cost based on your vehicle's efficiency (in kWh per km) and the price of electricity per kWh." }
        ],
        examples: [
            {
                title: "Example 1: Road Trip",
                description: "Estimating the fuel cost for a 600 km road trip in a car with 18 km/L mileage and fuel at ₹105/L.",
                inputs: { distance: '600', mileage: '18', fuelPrice: '105' },
                result: "The total estimated fuel cost is ₹3,500."
            },
            {
                title: "Example 2: Daily Commute",
                description: "Calculating the monthly fuel cost for a daily commute of 50 km (round trip) for 22 working days.",
                inputs: { distance: '1100', mileage: '12', fuelPrice: '98' },
                result: "The total estimated monthly fuel cost is ₹8,983.33."
            }
        ]
    },
    'Trip Expense Splitter': {
        description: "Effortlessly split bills with friends and family using the Trip Expense Splitter. This handy tool is perfect for dining out, group trips, or any shared expense. Enter the total bill amount, the number of people to split it with, and an optional tip percentage. The calculator instantly tells you how much each person needs to pay. It also shows the total amount including the tip and the tip amount itself, making it easy to settle the bill without any confusion or complicated mental math. It's the fastest way to keep things fair and simple when sharing costs.",
        faqs: [
            { q: "How is the tip calculated?", a: "The tip is calculated as a percentage of the *original* bill amount, before it's split. For example, a 10% tip on a ₹2000 bill is ₹200." },
            { q: "What if someone wants to pay a different amount?", a: "This calculator is designed for an equal split among all people. For more complex splits where individuals pay for specific items, you would need to calculate those manually." },
            { q: "Can I use this for things other than restaurant bills?", a: "Absolutely! You can use it to split any shared cost, like rent for a vacation home, groceries for a group, or tickets for an event. In those cases, you can simply set the tip percentage to 0." },
            { q: "Does the number of people have to be a whole number?", a: "Yes, you should enter the total number of people who are splitting the bill as a whole number (e.g., 4)." },
            { q: "How is the per-person cost determined?", a: "The calculator first adds the tip amount to the total bill to get the final amount. Then, it divides this final amount by the number of people to get the equal share for each person." }
        ],
        examples: [
            {
                title: "Example 1: Dinner with Friends",
                description: "Splitting a ₹3,500 dinner bill among 5 people with a 10% tip.",
                inputs: { billAmount: '3500', people: '5', tipPercent: '10' },
                result: "Each person pays ₹770."
            },
            {
                title: "Example 2: Splitting Rent for a Weekend",
                description: "Splitting a ₹12,000 accommodation cost among 6 friends with no tip.",
                inputs: { billAmount: '12000', people: '6', tipPercent: '0' },
                result: "Each person pays ₹2,000."
            }
        ]
    }
};