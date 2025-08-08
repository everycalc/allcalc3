export const calculatorDescriptions: { [key: string]: { description: string; faqs: { q: string; a: string }[] } } = {
    'E-commerce Profit Calculator': {
        description: 'Gain a crystal-clear understanding of your e-commerce profitability on a per-order basis. This expert-level tool goes beyond simple revenue-minus-cost calculations. It meticulously accounts for the complex variables that determine true profit in an online business, including the cost of goods (COGS), packaging, forward shipping to the customer, and variable fees from payment gateways and marketplaces. Crucially, it also factors in the financial impact of Return-to-Origin (RTO) orders—a major profit leak for many businesses. By calculating losses from RTO shipping and determining if the product cost is also lost, this tool provides a "blended profit" per order. This blended figure is an average that represents your profitability across both successful deliveries and costly returns, giving you an accurate and realistic picture of your business\'s financial health. Use these insights to optimize pricing, reduce RTOs, and make data-driven decisions to boost your bottom line.',
        faqs: [
            {
                q: 'What is blended profit?',
                a: 'Blended profit is your average profit across all orders, factoring in both successfully delivered orders and costly returned (RTO) orders. It gives you a more realistic view of your business\'s health than looking at delivered orders alone.'
            },
            {
                q: 'Why is my Return-to-Origin (RTO) rate so important?',
                a: 'A high RTO rate can severely damage profitability. For every RTO, you lose money on forward shipping, reverse shipping, packaging, and potentially the cost of the product itself if it\'s damaged. Reducing your RTO rate is one of the fastest ways to increase profits.'
            },
            { q: 'What should be included in COGS?', a: 'Cost of Goods Sold (COGS) should include all direct costs related to the product itself. This means the purchase price from your supplier, any raw material costs, and manufacturing labor. It should not include indirect costs like marketing or rent.' },
            { q: 'What is the difference between a Payment Gateway Fee and a Marketplace Fee?', a: 'A Payment Gateway Fee (e.g., Stripe, Razorpay) is what you pay to process the customer\'s credit/debit card transaction. A Marketplace Fee (e.g., Amazon, Etsy) is the commission the platform takes for listing and selling your product on their site.'},
            { q: 'How can I reduce my RTO shipping costs?', a: 'Negotiate with your courier partners for better reverse shipping rates. Some couriers offer lower RTO rates than forward shipping. Also, implementing better address verification at checkout can reduce delivery failures, which are a primary cause of RTOs.'}
        ]
    },
    'Product Cost Calculator': {
        description: 'Unlock the true cost of creating your product with this comprehensive calculator. Accurately determining your cost per unit is the cornerstone of a sustainable business strategy. This tool enables you to break down your expenses into four critical categories: Materials (the raw components of your product), Labor (the work involved in assembly), Packaging (the final presentation and protection), and Overheads (indirect costs like rent or utilities spread across a production batch). By inputting these variables, you get a precise cost-per-unit figure. But it doesn\'t stop there. You can then input your desired profit margin to calculate the recommended selling price, ensuring that your pricing strategy is not just covering costs, but actively building a profitable business. This empowers you to price with confidence, understand your profitability drivers, and make strategic decisions about sourcing and production.',
        faqs: [
            {
                q: 'What is the difference between direct and indirect (overhead) costs?',
                a: 'Direct costs, like materials and labor, are directly tied to producing a single unit. Indirect or overhead costs, like rent or software subscriptions, are general business expenses that must be distributed across all units produced to get a true cost.'
            },
            {
                q: 'Why is accurate product costing important?',
                a: 'Accurate costing is the foundation of a profitable business. It allows you to set the right price, understand your profit margins, identify areas to reduce costs, and make informed decisions about which products to promote or discontinue.'
            },
            { q: 'How should I calculate labor cost if I pay myself?', a: 'Even if you\'re a solo founder, it\'s crucial to pay yourself. Determine a realistic hourly wage for your time and track the minutes it takes to produce one unit. Use the "Per Hour" labor cost type to accurately factor this into your product cost.'},
            { q: 'What does "Units Produced in Batch" mean for overheads?', a: 'Overhead costs are typically fixed for a period (e.g., monthly rent). To allocate this to a single product, you divide the total overhead cost by the number of units you produce in that period. This ensures each product carries its fair share of the indirect costs.'},
            { q: 'What is a typical profit margin?', a: 'This varies massively by industry. Retail might see 20-40%, while software can be 80%+. A good starting point is 50%, which means your cost is half your selling price. Research your specific industry to set a competitive yet profitable margin.'}
        ]
    },
    'Recipe Cost Calculator': {
        description: 'An essential tool for any culinary business, from restaurants and cafes to bakeries and home-based food creators. This calculator allows you to determine the precise cost of any dish on your menu by breaking down the cost of each individual ingredient. Simply list your ingredients, enter the price you pay for the bulk package (e.g., the cost of a 5kg bag of flour) and its size, and then specify the exact amount used in a single serving of your recipe. The tool automatically calculates the cost for each component and sums them up to give you the total food cost for the dish. This granular approach is critical for effective menu engineering, ensuring your prices are not only competitive but also profitable. Use this data to manage your food costs, optimize your menu, and build a financially successful food business.',
        faqs: [
            {
                q: 'How do I account for ingredient waste?',
                a: 'A common industry practice is to add a small percentage (e.g., 5-10%) to your final recipe cost to account for potential waste like spoilage, trimming, or cooking errors. You can do this by slightly increasing the "used amount" for key ingredients.'
            },
            {
                q: 'How does this help with menu pricing?',
                a: 'Knowing your exact recipe cost is crucial for menu pricing. A general rule is that your food cost should be around 25-35% of your menu price, leaving the rest to cover labor, overheads, and profit.'
            },
            { q: 'Should I include water or salt in the costing?', a: 'While the cost is minimal, it\'s good practice to include everything. For items like salt, spices, or oil that are hard to measure per dish, you can add a small, fixed "sundry" cost (e.g., $0.10) to each recipe to account for them.'},
            { q: 'What unit should I use for package size and used amount?', a: 'The most important thing is to be consistent. If your package size is in grams, your used amount should also be in grams. If it\'s in milliliters, the used amount should be in milliliters. Consistency is key to an accurate calculation.'},
            { q: 'How often should I update my recipe costs?', a: 'Ingredient prices fluctuate. It\'s a good idea to review and update your recipe costs every 3-6 months, or whenever you notice a significant price change from one of your main suppliers, to ensure your menu remains profitable.'}
        ]
    },
    'CLV & CAC Calculator': {
        description: 'Measure the long-term health and sustainability of your business with two of the most critical metrics in marketing: Customer Lifetime Value (CLV) and Customer Acquisition Cost (CAC). CLV predicts the total net profit your business will make from a single customer over the entire duration of their relationship with you. CAC measures how much it costs to acquire a new customer. By comparing these two, you get the CLV:CAC ratio, a powerful indicator of your marketing efficiency and business model viability. A healthy ratio shows that you are efficiently acquiring customers who generate significant long-term value. This calculator simplifies the formulas, allowing you to input your business variables and see the results instantly, providing crucial insights for scaling your marketing efforts profitably.',
        faqs: [
            {
                q: 'What is a good CLV to CAC ratio?',
                a: 'A healthy CLV:CAC ratio is typically considered to be 3:1 or higher. This means for every dollar you spend to acquire a customer, you get three dollars in profit back over their lifetime. A ratio below 1:1 means you are losing money on each new customer.'
            },
            {
                q: 'How can I improve my CLV?',
                a: 'You can increase CLV by encouraging repeat purchases through loyalty programs, improving customer service to reduce churn, and increasing the average order value through upselling or cross-selling.'
            },
            { q: 'What should be included in "Total Marketing Spend"?', a: 'This should include all costs associated with acquiring new customers over a specific period. This includes ad spend, salaries of your marketing and sales teams, and the cost of any tools or software they use.'},
            { q: 'How do I estimate "Customer Lifetime"?', a: 'This can be tricky for new businesses. A simple way is to look at your churn rate (the percentage of customers who leave in a period). The average customer lifetime is 1 / churn rate. For example, if you lose 25% of your customers each year (0.25 churn), your average customer lifetime is 1 / 0.25 = 4 years.'},
            { q: 'Why is this ratio so important for startups?', a: 'For startups and growing businesses, this ratio is a key indicator for investors. It proves that your business model is sustainable. It shows that you not only know how to get new customers, but that you can do so profitably, which is essential for long-term success.'}
        ]
    },
    'Inventory Management Calculator': {
        description: 'Take control of your supply chain and optimize your cash flow with this powerful inventory management tool. It calculates two fundamental metrics for efficient inventory control. First, the Economic Order Quantity (EOQ), which is the ideal order size that minimizes the total cost of ordering and holding inventory. Ordering too much increases holding costs, while ordering too little increases ordering frequency and costs. Second, the Reorder Point (ROP), which tells you the exact inventory level at which you need to place a new order to avoid stockouts, taking into account your daily sales and supplier lead time. Using these metrics helps you prevent costly stockouts, reduce storage expenses, and ensure that your capital isn\'t unnecessarily tied up in excess inventory, leading to a more efficient and profitable operation.',
        faqs: [
            {
                q: 'What is Safety Stock?',
                a: 'Safety stock is an extra quantity of a product which is stored in the warehouse to prevent an out-of-stock situation. It acts as a buffer against uncertainties in demand or supply lead time.'
            },
            {
                q: 'What is the difference between ordering cost and holding cost?',
                a: 'Ordering costs are the expenses incurred to create and process an order to a supplier (e.g., shipping fees, administrative costs). Holding costs are the costs associated with storing inventory that is waiting to be sold (e.g., warehouse rent, insurance, spoilage).'
            },
            { q: 'What is "Lead Time"?', a: 'Lead time is the total time it takes from the moment you place an order with your supplier to the moment you receive the goods in your warehouse. Accurately estimating this is crucial for the Reorder Point calculation.'},
            { q: 'Is EOQ always the right number of units to order?', a: 'EOQ is a theoretical ideal. In the real world, you might need to adjust it. For example, your supplier might have a Minimum Order Quantity (MOQ), or you might get a significant price break for ordering a larger quantity. EOQ is a fantastic baseline to guide your decision.'},
            { q: 'What are the risks of ignoring these metrics?', a: 'Ignoring these metrics can lead to two major problems: 1) Overstocking, which ties up your cash, increases storage costs, and risks product obsolescence. 2) Understocking, which leads to stockouts, lost sales, and unhappy customers who may go to a competitor.'}
        ]
    },
    'Break-Even ROAS Calculator': {
        description: 'Stop guessing if your ad campaigns are profitable. This indispensable calculator for e-commerce businesses determines your Break-Even Return On Ad Spend (ROAS). ROAS is the total revenue generated for every dollar spent on advertising. However, a simple revenue-to-spend ratio is misleading because it doesn\'t account for your actual costs. This tool goes deeper by factoring in your Average Order Value (AOV), Cost of Goods Sold (COGS), shipping expenses, payment fees, and even losses from Return-to-Origin (RTO) orders. The result is the precise ROAS your campaigns must achieve for you to cover all costs associated with an advertised sale. Any ROAS above this number is profit, and any below is a loss. Use this to set clear targets for your marketing team and scale your ad spend with confidence.',
        faqs: [
            {
                q: 'What is ROAS?',
                a: 'ROAS stands for Return On Ad Spend. It\'s a marketing metric that measures the amount of revenue your business earns for each dollar it spends on advertising. A ROAS of 3, for example, means you make $3 in revenue for every $1 spent on ads.'
            },
            {
                q: 'Why is my break-even ROAS higher than I thought?',
                a: 'Break-even ROAS isn\'t just about covering the ad spend; it has to cover the cost of the product, shipping, fees, and even losses from returns. This is why the break-even point is often higher than just 1.0.'
            },
            { q: 'What is a good "target" ROAS?', a: 'This depends on your profit margin. A good target is significantly above your break-even point. Many businesses aim for a ROAS of 3:1 to 5:1 to ensure healthy profitability after all costs are considered.'},
            { q: 'How does RTO Rate affect my Break-Even ROAS?', a: 'A higher RTO rate dramatically increases your break-even ROAS. This is because you still have to pay for the ad that generated the sale, but you get no revenue from the order and incur additional costs for shipping and returns. Reducing RTO is a key lever for improving ad profitability.'},
            { q: 'Can I use this for lead generation businesses?', a: 'This calculator is specifically designed for e-commerce where a direct sale is made. For lead generation, you would need to calculate your lead-to-customer conversion rate and customer lifetime value to determine your break-even cost per lead.'}
        ]
    },
    'Break-Even Point Calculator': {
        description: 'Discover the most fundamental number for your business\'s survival and success: the break-even point. This is the moment when your total sales revenue exactly equals your total expenses, meaning you are neither making a profit nor a loss. This calculator helps you determine this critical milestone in two ways: by the number of units you need to sell, and by the total revenue you need to achieve. To do this, you will separate your costs into two categories: Fixed Costs (like rent and salaries, which don\'t change with sales volume) and Variable Costs (like raw materials, which do change with each unit sold). Understanding your break-even point is essential for setting realistic sales goals, making informed pricing decisions, and managing your costs effectively to chart a clear path to profitability.',
        faqs: [
            {
                q: 'What are fixed vs. variable costs?',
                a: 'Fixed costs are expenses that do not change regardless of the number of units sold (e.g., rent, salaries). Variable costs are expenses that change in direct proportion to the number of units sold (e.g., raw materials, direct labor).'
            },
            {
                q: 'How can I lower my break-even point?',
                a: 'You can lower your break-even point by either reducing your fixed costs (e.g., finding cheaper rent), reducing your variable costs per unit (e.g., finding a cheaper supplier), or increasing your selling price per unit.'
            },
            { q: 'What is a "Contribution Margin"?', a: 'The Contribution Margin is your Sale Price Per Unit minus your Variable Cost Per Unit. It\'s the amount of money from each sale that "contributes" to paying off your fixed costs. Once your fixed costs are covered, the contribution margin from each additional sale becomes pure profit.'},
            { q: 'Can I use this for a service business?', a: 'Yes. For a service business, a "unit" might be an hour of consulting, a project, or a monthly retainer. Your variable costs might include software used specifically for that client or contractor fees. The principle remains the same.'},
            { q: 'How often should I recalculate my break-even point?', a: 'It\'s a good practice to recalculate your break-even point whenever there is a significant change in your business, such as a rent increase, a change in supplier pricing, or when you are considering launching a new product or service.'}
        ]
    },
    'Profit Margin Calculator': {
        description: 'Quickly assess the financial health of your business or product with the Profit Margin Calculator. This tool computes two vital figures: Gross Profit and Gross Profit Margin. Gross Profit is the money left over after subtracting the Cost of Goods Sold (COGS) from your total revenue. The Gross Profit Margin turns this into a percentage, showing you how much profit you make for every dollar of revenue. This percentage is a universal indicator of efficiency and pricing power. A higher margin indicates that you are retaining a larger portion of each sale as profit. Use this calculator to compare the profitability of different products, track your performance over time, and make informed decisions about your pricing strategy and cost management.',
        faqs: [
            {
                q: 'What is the difference between Gross Profit and Profit Margin?',
                a: 'Gross Profit is the absolute monetary amount left over from revenue after subtracting the Cost of Goods Sold (e.g., $40). Profit Margin is that amount expressed as a percentage of revenue (e.g., 40%), which is useful for comparing profitability across different products or periods.'
            },
            {
                q: 'What is a good profit margin?',
                a: 'A "good" profit margin varies widely by industry. A retail business might have a margin of 20-30%, while a software company could have a margin of 80% or more. It\'s best to compare your margin to your industry\'s average.'
            },
            { q: 'What\'s the difference between Gross Margin and Net Margin?', a: 'Gross Margin only subtracts the direct Cost of Goods Sold (COGS). Net Margin is calculated after subtracting *all* business expenses, including operating costs like rent, salaries, and marketing. Gross margin measures production efficiency, while net margin measures overall business profitability.'},
            { q: 'How can I increase my profit margin?', a: 'There are two primary ways: 1) Increase your prices without losing too many customers. 2) Decrease your Cost of Goods Sold, for example by negotiating better prices with your suppliers or finding more efficient production methods.'},
            { q: 'Does this calculator work for services?', a: 'Yes. For a service-based business, the "Cost of Goods Sold" would be the direct costs associated with providing that service. For example, for a web design agency, COGS might include the salaries of the designers and the cost of software licenses used for client projects.'}
        ]
    },
    'Discount Calculator': {
        description: 'A simple yet essential tool for savvy shoppers and retailers alike. This calculator makes it easy to figure out the final price of an item after a percentage-based discount. Simply enter the original price and the discount percentage to see the final price you\'ll pay. The calculator also clearly displays the exact amount of money you save, helping you instantly recognize the value of a deal. For retailers, this is a great tool for quickly calculating sale prices for promotions. For shoppers, it\'s your best friend during a sale, ensuring you know exactly what you\'re paying and saving before you head to the checkout counter. No more mental math or surprises—just clear, instant discount calculations.',
        faqs: [
            {
                q: 'How do I calculate a discount?',
                a: 'To calculate a discount, you convert the percentage to a decimal (e.g., 20% = 0.20) and multiply it by the original price. This gives you the saved amount. Subtract the saved amount from the original price to get the final price.'
            },
            {
                q: 'How do I calculate a price before a discount was applied?',
                a: 'To find the original price, you can use our GST/Tax calculator in "remove" mode. For example, if you paid $80 after a 20% discount, you can input 80 as the Final Amount and 20 as the Tax Rate to find the original price.'
            },
            { q: 'How do I calculate multiple discounts, like an extra 10% off an already 20% off item?', a: 'You cannot simply add the percentages (20% + 10% is not 30% off). You must apply them sequentially. First, calculate the price after the 20% discount. Then, use that new price as the "Original Price" and apply the 10% discount to it.'},
            { q: 'Can I use this for a discount in dollars instead of percent?', a: 'This calculator is designed for percentage-based discounts. For a fixed dollar amount discount (e.g., "$5 off"), you can simply use our Standard Calculator to subtract the discount amount from the original price.'},
            { q: 'Is the saved amount the same as profit?', a: 'No, not for a business. The "saved amount" is the discount given to the customer. The business\'s profit is the final price minus the cost of the item. Giving a discount reduces the business\'s profit on that item.'}
        ]
    },
    'AOV Calculator': {
        description: 'Measure a critical e-commerce metric with our Average Order Value (AOV) Calculator. AOV represents the average dollar amount a customer spends every time they place an order on your website or in your store. To calculate it, simply input your total revenue over a specific period and the total number of orders from that same period. Tracking your AOV is crucial because increasing it is one of the most effective ways to boost revenue without the additional marketing cost of acquiring new customers. A rising AOV indicates that your customers are buying more expensive items or more items per transaction. Use this metric to gauge the effectiveness of your pricing strategies, product bundling, and upselling techniques.',
        faqs: [
            {
                q: 'Why is AOV important?',
                a: 'Increasing your AOV is one of the most effective ways to grow your revenue without needing more customers. A higher AOV means you are maximizing the value of each customer you acquire.'
            },
            {
                q: 'How can I increase my AOV?',
                a: 'Common strategies include offering free shipping over a certain threshold, bundling products together for a slight discount, and suggesting relevant add-ons or upsells during the checkout process.'
            },
            { q: 'What time period should I use for calculating AOV?', a: 'You can calculate it for any period, but common choices are monthly, quarterly, or yearly. Calculating it monthly helps you track trends and see the impact of recent marketing campaigns. Calculating it quarterly or yearly gives you a more stable, long-term view.'},
            { q: 'Is AOV the same as Customer Lifetime Value (CLV)?', a: 'No. AOV measures the value of a single transaction. CLV measures the total value a customer brings to your business over their entire relationship with you, which includes multiple transactions. AOV is a component used in calculating CLV.'},
            { q: 'Does a low AOV mean my business is failing?', a: 'Not necessarily. Businesses that sell low-cost, high-volume items will naturally have a lower AOV than businesses that sell high-ticket items. The key is to track your AOV over time. An increasing AOV is a sign of a healthy business, regardless of the absolute number.'}
        ]
    },
    'Standard Calculator': {
        description: "Your reliable and straightforward tool for all everyday calculations. This Standard Calculator provides a clean and familiar interface for performing basic arithmetic operations: addition, subtraction, multiplication, and division. It's designed for quick, on-the-go calculations where you don't need complex scientific functions. The display shows your current number, while the sub-display keeps track of the operation in progress, making it easy to follow along. It also includes handy functions for calculating percentages and inverting the sign of a number. Whether you're splitting a bill, figuring out a tip, or doing some quick budgeting, this calculator is the perfect digital companion for your daily mathematical needs.",
        faqs: [
            {
                q: 'How does the percentage button (%) work?',
                a: 'The percentage button works in context. For example, `100 + 10%` will calculate 10% of 100 (which is 10) and add it to 100, giving 110. `100 * 10%` will calculate 10% of 100, which is 10.'
            },
            {
                q: 'What is the order of operations?',
                a: 'This standard calculator processes operations sequentially as they are entered (e.g., `2 + 3 * 4` will be calculated as `5 * 4 = 20`). For strict mathematical order (PEMDAS/BODMAS), use the Scientific Calculator.'
            },
            { q: 'What does the "+/-" button do?', a: 'The plus/minus button toggles the sign of the number currently on the display. If you have "50", pressing it will change it to "-50", and pressing it again will change it back to "50".'},
            { q: 'How do I clear the entire calculation?', a: 'The "C" button clears the current entry. If you have a calculation in progress (e.g., "50 + "), pressing "C" will clear the second number you started typing. A second press will clear the whole operation.'},
            { q: 'Can I use this calculator offline?', a: 'Yes! Like all the calculators on our platform, the Standard Calculator is designed to work perfectly even without an internet connection, making it reliable wherever you are.'}
        ]
    },
    'Scientific Calculator': {
        description: "Tackle advanced mathematical problems with ease using our full-featured Scientific Calculator. This tool extends beyond basic arithmetic to include a wide range of functions essential for students and professionals in science, engineering, and mathematics. It provides trigonometric functions (sine, cosine, tangent) that can operate in both degrees and radians. You can perform logarithmic calculations (common log and natural log), calculate powers and square roots, and utilize mathematical constants like Pi (π) and Euler's number (e). The layout is designed to be intuitive, giving you access to powerful functions without a cluttered interface. Whether you're solving complex equations for school or work, this calculator provides the functionality you need for precise and reliable results.",
        faqs: [
            {
                q: 'How do I use the y^x button?',
                a: 'The y^x button is for calculating exponents. To calculate 5 to the power of 3 (5³), you would enter `5`, press `y^x`, enter `3`, and then press `=`. The result is 125.'
            },
            {
                q: 'What is "Deg/Rad" mode?',
                a: 'This switch changes the unit for trigonometric calculations. "Deg" stands for degrees (where a circle has 360°). "Rad" stands for radians (where a circle has 2π radians). Ensure you are in the correct mode for your problem.'
            },
            { q: 'What is the difference between log and ln?', a: '"log" calculates the base-10 logarithm, which answers the question "10 to what power gives this number?". "ln" calculates the natural logarithm (base e), which is crucial in calculus and financial calculations.'},
            { q: 'Does this calculator follow the order of operations (PEMDAS/BODMAS)?', a: 'This calculator processes operations as they are entered, similar to a standard calculator. For complex expressions requiring a strict order of operations, you should calculate parts in parentheses first and work through them step by step.'},
            { q: 'What are the constants "π" and "e"?', a: 'Pi (π) is approximately 3.14159 and is the ratio of a circle\'s circumference to its diameter. Euler\'s number (e) is approximately 2.71828 and is the base of the natural logarithm, frequently appearing in formulas related to growth and decay.'}
        ]
    },
     'Loan Calculator': {
        description: 'Take control of your financial planning with our comprehensive Loan Calculator. This tool is designed to help you understand the full scope of a loan by calculating your Equated Monthly Installment (EMI). Simply input the total loan amount, the annual interest rate, and the loan term in years. The calculator will instantly provide you with your fixed monthly payment. More importantly, it breaks down the total cost of the loan, showing you the total principal you will repay versus the total interest you will pay over the entire term. This visibility is key to understanding the true cost of borrowing. The calculator also includes an amortization schedule, giving you a month-by-month breakdown of how each payment contributes to reducing your principal and covering interest.',
        faqs: [
            {
                q: 'What is EMI?',
                a: 'EMI stands for Equated Monthly Installment. It is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.'
            },
            {
                q: 'How is loan interest calculated?',
                a: 'Most loans use a reducing balance method. The interest is calculated on the outstanding loan amount for the month. As you pay your EMIs, the principal amount reduces, and so does the interest charged on it in subsequent months.'
            },
            { q: 'Why is the total payment so much higher than the loan amount?', a: 'The difference between the total payment and the loan amount is the total interest paid. Over a long loan term (like 15-30 years for a home loan), the interest can add up to be a significant amount, sometimes even more than the original loan principal.'},
            { q: 'What is an amortization schedule?', a: 'An amortization schedule is a table that details each periodic payment on a loan. It shows how much of each payment is applied to interest and how much is applied to the principal. In the beginning of the loan, a larger portion of your EMI goes towards interest.'},
            { q: 'How can I reduce the total interest I pay?', a: 'There are two main ways: 1) Choose a shorter loan term. A 15-year loan will have higher EMIs than a 30-year loan, but you will pay significantly less in total interest. 2) Make prepayments. Paying extra towards your principal whenever possible reduces the loan balance, which in turn reduces the total interest you pay over time.'}
        ]
    },
    'SIP Calculator': {
        description: 'Visualize your path to wealth creation with the Systematic Investment Plan (SIP) Calculator. This powerful tool helps you project the future value of your investments in mutual funds or other assets through regular, disciplined contributions. Enter the amount you plan to invest monthly, your expected annual rate of return, and the number of years you intend to stay invested. The calculator will then show you a detailed projection, including your total invested amount, the estimated returns you could earn, and the final maturity value. This demonstrates the incredible power of compounding over the long term. Additionally, our AI-powered "Plan a Goal" feature lets you work backward: input your financial target, and the AI will calculate the monthly SIP required to reach your goal, turning your dreams into an actionable plan.',
        faqs: [
            {
                q: 'What is a SIP?',
                a: 'A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you invest a fixed amount of money at regular intervals (e.g., monthly). It helps in disciplined investing and benefits from rupee cost averaging and the power of compounding.'
            },
            {
                q: 'Are the returns guaranteed?',
                a: 'No, mutual fund returns are subject to market risks. The calculator shows a projection based on the expected rate of return you enter. Actual returns can be higher or lower depending on market performance.'
            },
            { q: 'What is Rupee Cost Averaging?', a: 'When you invest a fixed amount every month, you automatically buy more units when the market price is low and fewer units when the price is high. Over time, this averages out your purchase cost and can reduce the impact of market volatility.'},
            { q: 'What is a realistic "Expected Return Rate" to use?', a: 'For long-term investments in equity mutual funds, a common historical average is around 10-14% per annum. However, this is not a guarantee. It\'s wise to be conservative with your estimate, for example, using 10% or 12% for planning.'},
            { q: 'How does the "Plan a Goal" feature work?', a: 'Our AI-powered goal planner uses the principles of future value calculations in reverse. You provide the future amount you want (your goal), the time you have, and your expected return rate. The AI then calculates the required monthly investment (the present value annuity) needed to reach that specific future value.'}
        ]
    },
    // Adding more calculators with expanded content
    'BMI Calculator': {
        description: "The Body Mass Index (BMI) calculator is a widely used tool to gauge whether your weight is in a healthy range for your height. It's a simple, indirect measure of body fat. By entering your weight and height in either metric (kilograms and centimeters) or imperial (pounds and inches) units, the calculator computes a single number. This number falls into one of four categories: Underweight, Normal weight, Overweight, or Obesity. While it's a great starting point for assessing your weight status, it's important to remember that BMI is a general indicator. It doesn't differentiate between fat and muscle mass, which means very muscular individuals (like athletes) might have a high BMI without having excess body fat. Always consider BMI as one piece of a larger health puzzle and consult with a healthcare professional for a comprehensive assessment.",
        faqs: [
            {
                q: 'What do the BMI categories mean?',
                a: 'The standard BMI categories are: Below 18.5 (Underweight), 18.5-24.9 (Normal weight), 25.0-29.9 (Overweight), and 30.0 or higher (Obesity). These ranges help identify potential weight-related health risks.'
            },
            {
                q: 'Is BMI accurate for everyone?',
                a: 'BMI can be less accurate for certain groups like athletes (who have high muscle mass), pregnant women, the elderly, and children. It\'s best to consult a healthcare professional for a complete health evaluation.'
            },
            {
                q: 'What is the formula for BMI?',
                a: 'For metric units, the formula is: BMI = weight (kg) / [height (m)]². For imperial units, it is: BMI = (weight (lbs) / [height (in)]²) * 703.'
            },
            {
                q: 'What are the health risks associated with a high BMI?',
                a: 'A high BMI is associated with an increased risk for several health conditions, including type 2 diabetes, heart disease, high blood pressure, and certain types of cancer. Maintaining a healthy weight can help mitigate these risks.'
            },
            {
                q: 'If my BMI is high, what should I do?',
                a: 'If your BMI falls into the overweight or obesity category, it\'s a good idea to speak with a doctor or a registered dietitian. They can provide personalized advice on healthy eating, exercise, and lifestyle changes to help you reach a healthier weight.'
            }
        ]
    },
    'Age Calculator': {
        description: "Ever wondered your exact age, down to the very second? Our Age Calculator provides a fun and precise way to measure your age based on your date of birth. It doesn't just stop at years; it breaks down your age into years, months, days, hours, minutes, and even live-ticking seconds. This tool is perfect for celebrating milestones, satisfying curiosity, or calculating the exact duration between two dates. Beyond the simple calculation, it also tells you how many days are remaining until your next birthday, helping you count down to your special day. To make things even easier, you can save important dates like birthdays and anniversaries of friends and family. This allows you to select a saved person and instantly see their age without having to re-enter their birth date every time.",
        faqs: [
            {
                q: 'How does the calculator handle leap years?',
                a: 'The calculator accurately accounts for leap years by calculating the difference between the two full dates, which inherently includes the extra day in leap years when it falls within the period.'
            },
            {
                q: 'Can I use this for things other than birthdays?',
                a: 'Yes! You can use it to calculate the duration between any two dates. For example, find out exactly how long you\'ve been working at your job or how long it has been since a major life event.'
            },
            {
                q: 'Is my saved data private?',
                a: 'Absolutely. All the dates you save are stored locally in your browser\'s storage. They are not sent to any server, ensuring your data remains private and accessible only to you on your device.'
            },
            {
                q: 'Why does the age update every second?',
                a: 'The live-ticking clock for hours, minutes, and seconds is a feature designed to give you a dynamic and precise representation of your age at this very moment. It emphasizes that age is a continuous measure of time.'
            },
            {
                q: 'How accurate is the "next birthday" countdown?',
                a: 'The countdown is very accurate. It calculates the number of full days between today and the date of your next birthday, so you know exactly how many more sleeps until you can celebrate!'
            }
        ]
    }
};